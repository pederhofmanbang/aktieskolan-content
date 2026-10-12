#!/usr/bin/env bash
# Rapporterar sessionens tillstånd till dashboarden.
#
# Registreras för SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest,
# PostToolUse, PostToolUseFailure, SubagentStart, SubagentStop, Stop,
# StopFailure, Notification och SessionEnd. Läser hookens JSON på stdin och
# postar det användbara, avkortat. Vad det betyder för kortet avgör servern,
# så att dashboarden kan byggas ut utan att hooken behöver ändras.
#
# Två regler styr allt här: hooken får aldrig sinka sessionen, och den får
# aldrig fälla den. Därför körs curl i bakgrunden med timeout, all output
# kastas, och skriptet avslutar alltid med 0.

# Bada satts som miljovariabler, inte har i filen.
#   Webbsessioner: claude.ai/code -> miljoinstallningar -> Environment variables
#   Lokalt:        i skalets profil, eller setx pa Windows
# Saknas de gor hooken ingenting alls, tyst.
CC_INGEST_URL="${CC_INGEST_URL:-}"
CC_INGEST_TOKEN="${CC_INGEST_TOKEN:-}"

[ -z "$CC_INGEST_URL" ] && exit 0
[ -z "$CC_INGEST_TOKEN" ] && exit 0

# I molnet startar Claude Code ibland en kort stund innan själva sessionen,
# utan sessions-id. Den körningen hör inte till någon session och ska inte
# bli ett kort.
[ "${CLAUDE_CODE_REMOTE}" = "true" ] && [ -z "${CLAUDE_CODE_REMOTE_SESSION_ID}" ] && exit 0

# Allt nedan körs i en subshell vars fel sväljs. exit 0 sist, alltid.
{
  input=$(cat)

  # Webbsession eller lokal? CLAUDE_CODE_REMOTE är satt till true i molnet.
  if [ "${CLAUDE_CODE_REMOTE}" = "true" ]; then
    source_kind="web"
  else
    source_kind="local"
  fi

  # Sessionens id i URL:en är INTE samma som session_id i hookens JSON.
  # JSON ger en UUID. URL:en bygger på CLAUDE_CODE_REMOTE_SESSION_ID, som
  # ser ut som cse_01ABC... medan adressen är claude.ai/code/session_01ABC...
  session_url=""
  remote_id="${CLAUDE_CODE_REMOTE_SESSION_ID}"
  case "$remote_id" in
    cse_*)     session_url="https://claude.ai/code/session_${remote_id#cse_}" ;;
    session_*) session_url="https://claude.ai/code/${remote_id}" ;;
  esac

  payload=""

  # Föredra python3. Den finns i webbsandlådan och parsar JSON korrekt,
  # inklusive citattecken och radbrytningar i Notification-texten.
  if command -v python3 >/dev/null 2>&1; then
    payload=$(printf '%s' "$input" | CC_SOURCE="$source_kind" CC_URL="$session_url" python3 -c '
import json, os, re, subprocess, sys, tempfile, time

# Version 3 skickar livesignal medan Claude jobbar. Servern varnar bara för
# stannade sessioner när hooken har den versionen.
VERSION = 3

STATUS = {
    "SessionStart": "working",
    "UserPromptSubmit": "working",
    "PostToolUse": "working",
    "PostToolUseFailure": "working",
    "PreToolUse": "needs_input",
    "PermissionRequest": "needs_input",
    "Stop": "done",
    "StopFailure": "needs_input",
    "Notification": "needs_input",
    "SessionEnd": "ended",
}

# Notification skickas för mer än "behöver dig". De här betyder inte att
# den här sessionen väntar på svar och ska inte göra kortet rött.
# agent_completed gäller en annan session i bakgrunden, inte den här.
IGNORERA = {"auth_success", "elicitation_complete", "elicitation_response", "agent_completed"}

# Verktyg som stannar mitt i ett arbetspass och väntar på ditt svar.
FRAGOR = {"AskUserQuestion", "ExitPlanMode"}

# Verktyg som alltid rapporteras, eftersom servern bygger uppgiftslistan och
# PR-länken av dem.
def alltid(namn):
    return namn in ("TaskCreate", "TaskUpdate", "TodoWrite") or "pull_request" in namn

# Livesignal medan Claude jobbar: högst så här ofta.
LIVSSIGNAL_S = 20

# Fält med filinnehåll skickas aldrig.
UTELAMNA = {"content", "old_string", "new_string", "edits", "new_source", "file_text"}

def trim(v, n=300, djup=0):
    if isinstance(v, str):
        return v if len(v) <= n else v[:n] + " …"
    if v is None or isinstance(v, (bool, int, float)):
        return v
    if djup >= 3:
        return trim(json.dumps(v, ensure_ascii=False), n)
    if isinstance(v, list):
        return [trim(x, n, djup + 1) for x in v[:20]]
    if isinstance(v, dict):
        return {k: trim(x, n, djup + 1) for k, x in list(v.items())[:30] if k not in UTELAMNA}
    return trim(str(v), n)

def kort(s, n):
    s = " ".join(str(s).split())
    return s if len(s) <= n else s[:n].rsplit(" ", 1)[0] + " …"

try:
    d = json.load(sys.stdin)
except Exception:
    d = {}

event = d.get("hook_event_name") or ""
ntype = d.get("notification_type") or ""
tool = d.get("tool_name") or ""
cwd = d.get("cwd") or os.getcwd()
session_id = d.get("session_id") or ""

if not session_id:
    sys.exit(1)

status = STATUS.get(event, "working")
# Bara aktivitet: uppdaterar vad Claude gör, men ändrar inte kortets färg.
bara_aktivitet = False
message = None
details = []

if event == "Notification":
    if ntype in IGNORERA or ntype.startswith("quota_"):
        print("__SKIP__")
        sys.exit(0)
    if ntype == "idle_prompt":
        # Kommer en minut efter att Claude blivit klar. Sessionen är då klar,
        # inte blockerad. Den fångar också en avbruten session, där Stop
        # aldrig kommer.
        status = "done"
    else:
        # Typen går före texten. Dashboarden översätter typerna till svenska.
        message = ntype or d.get("message")
elif event == "PreToolUse" and tool not in FRAGOR:
    # Visar vad Claude gör just nu, till exempel ett långt testkommando.
    # Ändrar inte färgen: ett godkännande kan komma direkt efter.
    bara_aktivitet = True
elif event == "PreToolUse":
    message = tool
    indata = d.get("tool_input") or {}
    if tool == "AskUserQuestion":
        # Varje fråga blir en punkt, med svarsalternativen efter.
        for q in indata.get("questions") or []:
            if not isinstance(q, dict) or not q.get("question"):
                continue
            val = [o.get("label") for o in q.get("options") or [] if isinstance(o, dict) and o.get("label")]
            details.append(kort(q["question"] + (" (" + " / ".join(val) + ")" if val else ""), 240))
        if details:
            message = kort(indata["questions"][0]["question"], 240)
    elif isinstance(indata.get("plan"), str):
        # Planens första rader, utan markdown-tecken.
        for rad in indata["plan"].splitlines():
            rad = rad.strip().lstrip("#-*0123456789.) ").strip()
            if rad:
                details.append(kort(rad, 160))
            if len(details) >= 5:
                break
elif event == "PermissionRequest":
    # Frågor och planer har redan rapporterats av PreToolUse.
    if tool in FRAGOR:
        print("__SKIP__")
        sys.exit(0)
    message = "permission_prompt"
    indata = d.get("tool_input") or {}
    if tool == "Bash" and indata.get("command"):
        details.append("Vill köra: " + kort(indata["command"], 200))
        if indata.get("description"):
            details.append(kort(indata["description"], 160))
    elif indata.get("file_path"):
        details.append("Vill ändra: " + kort(indata["file_path"], 200))
    elif indata.get("url"):
        details.append("Vill hämta: " + kort(indata["url"], 200))
    else:
        details.append("Vill använda " + tool)
elif event == "StopFailure":
    message = d.get("last_assistant_message") or d.get("error")
    if d.get("error_details"):
        details.append(kort(d["error_details"], 240))
elif event in ("SubagentStart", "SubagentStop"):
    bara_aktivitet = True

# Vad som senast skickades, och när, sparas i en fil per session. Efter
# verktyg och notiser skickas bara byten, plus en livesignal då och då.
safe_id = "".join(c for c in session_id if c.isalnum() or c in "-_")[:100]
state_dir = os.path.join(tempfile.gettempdir(), "cc-monitor")
state = os.path.join(state_dir, safe_id)

forra_status, forra_tid = "", 0.0
try:
    with open(state) as f:
        rad = f.read().strip()
    if rad.startswith("{"):
        sparat = json.loads(rad)
        forra_status, forra_tid = sparat.get("status", ""), float(sparat.get("t", 0))
    else:
        forra_status = rad
except (OSError, ValueError):
    pass

nu = time.time()
dags_for_livsignal = nu - forra_tid >= LIVSSIGNAL_S

if event in ("PostToolUse", "PostToolUseFailure"):
    if forra_status == status and not alltid(tool) and not dags_for_livsignal:
        print("__SKIP__")
        sys.exit(0)
elif event == "PreToolUse" and bara_aktivitet:
    if not dags_for_livsignal:
        print("__SKIP__")
        sys.exit(0)
elif event in ("Notification", "PermissionRequest"):
    if forra_status == status:
        print("__SKIP__")
        sys.exit(0)

# SessionStart och ren aktivitet ändrar inte kortets färg, så de ändrar inte
# heller den sparade statusen. Tiden uppdateras alltid.
if event != "SessionStart" and not bara_aktivitet:
    forra_status = status
try:
    os.makedirs(state_dir, exist_ok=True)
    with open(state, "w") as f:
        json.dump({"status": forra_status, "t": nu}, f)
except OSError:
    pass

def git(*args):
    try:
        r = subprocess.run(["git", "-C", cwd, *args], capture_output=True, text=True, timeout=2)
        return r.stdout.strip()
    except Exception:
        return ""

out = {
    "v": VERSION,
    "session_id": session_id,
    "repo": os.path.basename(cwd.rstrip("/")) or "okänt",
    "status": None if bara_aktivitet else status,
    "activity_only": bara_aktivitet,
    "last_event": event,
    "message": message,
    "source": os.environ.get("CC_SOURCE", "local"),
    "label": os.environ.get("CC_MONITOR_LABEL") or None,
    "session_url": os.environ.get("CC_URL") or None,
}

if details:
    out["details"] = "\n".join(details)
if event == "UserPromptSubmit" and d.get("prompt"):
    out["prompt"] = str(d["prompt"])[:4000]
if event == "Stop" and d.get("last_assistant_message"):
    # Servern läser svaret: slutar det med en fråga väntar Claude på dig.
    out["last_message"] = str(d["last_assistant_message"])[:20000]

if tool:
    out["tool"] = tool
    out["tool_input"] = trim(d.get("tool_input") or {})
    if alltid(tool) and "tool_response" in d:
        out["tool_response"] = trim(d.get("tool_response"), 500)

# Hela uppgiftslistan, som Claude Code sparar som en fil per uppgift. Skickas
# hel varje gång, så att listan rättar sig själv om två signaler krockar.
if tool in ("TaskCreate", "TaskUpdate"):
    hem = os.environ.get("CLAUDE_CONFIG_DIR") or os.path.join(os.path.expanduser("~"), ".claude")
    mapp = os.path.join(hem, "tasks", safe_id)
    lista = []
    try:
        for namn in os.listdir(mapp):
            if not namn.endswith(".json"):
                continue
            try:
                with open(os.path.join(mapp, namn)) as f:
                    u = json.load(f)
                lista.append({"id": str(u.get("id")), "subject": kort(u.get("subject") or "", 200), "status": u.get("status")})
            except (OSError, ValueError):
                pass
        lista.sort(key=lambda u: int(u["id"]) if u["id"].isdigit() else 0)
        out["tasks"] = lista[:50]
    except OSError:
        pass

# Branch och GitHub-repo, för länkar på kortet.
branch = git("rev-parse", "--abbrev-ref", "HEAD")
if branch and branch != "HEAD":
    out["branch"] = branch
traff = re.search(r"github\.com[:/]+([^/]+)/([^/]+?)(?:\.git)?/?$", git("config", "--get", "remote.origin.url"))
if traff:
    out["github"] = traff.group(1) + "/" + traff.group(2)

# Resten av det Claude Code skickar, avkortat. Servern kan börja använda
# nya fält utan att hooken behöver ändras.
out["extra"] = trim({k: v for k, v in d.items() if k not in (
    "tool_input", "tool_response", "last_assistant_message", "prompt",
    "transcript_path", "cwd", "session_id", "hook_event_name", "tool_name")})

json.dump(out, sys.stdout, ensure_ascii=False)
' 2>/dev/null)
  fi

  # Reserv om python3 saknas. Klarar vanliga fall, inte exotisk escaping.
  if [ -z "$payload" ]; then
    # Första förekomsten av fältet. Senare träffar kan komma från verktygets
    # indata, som ligger längre in i JSON:en.
    field() {
      printf '%s' "$input" \
        | grep -oE '"'"$1"'"[[:space:]]*:[[:space:]]*"([^"\\]|\\.)*"' \
        | head -1 \
        | sed -E 's/^"[^"]*"[[:space:]]*:[[:space:]]*"(.*)"$/\1/'
    }

    session_id=$(field session_id)
    [ -z "$session_id" ] && exit 0

    event=$(field hook_event_name)
    cwd=$(field cwd)
    ntype=$(field notification_type)
    tool=$(field tool_name)
    message=""
    details=""
    prompt=""
    last_message=""

    case "$event" in
      SubagentStart|SubagentStop) exit 0 ;;
    esac

    case "$event" in
      SessionStart|UserPromptSubmit|PostToolUse|PostToolUseFailure) status="working" ;;
      Stop)                                 status="done" ;;
      Notification|PreToolUse|PermissionRequest|StopFailure) status="needs_input" ;;
      SessionEnd)                           status="ended" ;;
      *)                                    status="working" ;;
    esac

    # Samma undantag som i python-vägen.
    case "$event" in
      Notification)
        case "$ntype" in
          auth_success|elicitation_complete|elicitation_response|agent_completed|quota_*) exit 0 ;;
          idle_prompt) status="done" ;;
          *) message="${ntype:-$(field message)}" ;;
        esac
        ;;
      PreToolUse)
        case "$tool" in
          AskUserQuestion|ExitPlanMode) message="$tool" ;;
          *) exit 0 ;;
        esac
        ;;
      PermissionRequest)
        case "$tool" in
          AskUserQuestion|ExitPlanMode) exit 0 ;;
          *) message="permission_prompt"; details="Vill använda $tool" ;;
        esac
        ;;
      UserPromptSubmit)
        prompt=$(field prompt)
        ;;
      Stop)
        last_message=$(field last_assistant_message)
        ;;
      StopFailure)
        message=$(field error)
        ;;
    esac

    # Bara byten efter verktyg och notiser, som i python-vägen.
    state_dir="${TMPDIR:-/tmp}/cc-monitor"
    state="$state_dir/$(printf '%s' "$session_id" | tr -cd 'A-Za-z0-9_-' | cut -c1-100)"
    case "$event" in
      PostToolUse|PostToolUseFailure|Notification|PermissionRequest)
        grep -q "\"status\":\"$status\"" "$state" 2>/dev/null && exit 0
        ;;
    esac
    [ "$event" != "SessionStart" ] && mkdir -p "$state_dir" && printf '{"status":"%s","t":0}' "$status" > "$state"

    repo=$(basename "${cwd:-$PWD}")

    # session_id, event, message, prompt och last_message kommer ordagrant ur
    # JSON:en och är därmed redan escapade. De ska inte escapas igen. Bara värden som kommer från
    # miljön eller härletts behöver behandlas.
    esc() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

    payload=$(printf '{"session_id":"%s","repo":"%s","status":"%s","last_event":"%s","message":"%s","source":"%s","label":"%s","session_url":"%s","details":"%s","prompt":"%s","last_message":"%s"}' \
      "$session_id" "$(esc "$repo")" "$status" "$event" \
      "$message" "$source_kind" "$(esc "${CC_MONITOR_LABEL}")" "$(esc "$session_url")" \
      "$(esc "$details")" "$prompt" "$last_message")
  fi

  [ -z "$payload" ] && exit 0
  [ "$payload" = "__SKIP__" ] && exit 0

  # I bakgrunden, med tak på hur länge det får ta. Inget väntar på det här.
  curl -sS -m 5 --connect-timeout 3 \
    -X POST "$CC_INGEST_URL" \
    -H "Content-Type: application/json" \
    -H "x-cc-token: $CC_INGEST_TOKEN" \
    -d "$payload" \
    >/dev/null 2>&1 </dev/null &

} >/dev/null 2>&1

exit 0
