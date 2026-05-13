"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { formatKr } from "@/lib/format";
import type { MyPlan, Portfolio } from "@/lib/portfolio";

const DEFAULT_RULES: { key: string; label: string }[] = [
  {
    key: "no_sell_drop",
    label:
      "Jag säljer ALDRIG min globalfond på grund av kursnedgångar.",
  },
  {
    key: "no_fomo_buy",
    label:
      "Jag köper INGEN enskild aktie inom första 7 dagarna jag hört talas om den.",
  },
  {
    key: "max_quarter_check",
    label: "Jag kollar portföljen MAX 1 gång per kvartal.",
  },
  {
    key: "rebalance_yearly",
    label: "Jag rebalanserar 1 gång per år.",
  },
  {
    key: "three_reasons_not",
    label:
      "För att köpa en enskild aktie måste jag skriva ner 3 anledningar att INTE äga den.",
  },
  {
    key: "buy_more_in_crash",
    label:
      "Om börsen är ner > 25 %: jag KÖPER istället för att sälja (om jag har likvider).",
  },
];

const DEFAULT_PLAN: MyPlan = {
  goal: "",
  horizonYears: 30,
  monthlyAmount: 2000,
  allocationCore: 80,
  allocationSweden: 10,
  allocationSpice: 10,
  rules: Object.fromEntries(DEFAULT_RULES.map((r) => [r.key, false])),
  signature: "",
};

export function MyPlanSection({
  portfolio,
  onSave,
}: {
  portfolio: Portfolio;
  onSave: (plan: MyPlan) => void;
}) {
  const [plan, setPlan] = useState<MyPlan>(
    () => portfolio.myPlan ?? DEFAULT_PLAN,
  );
  const [editing, setEditing] = useState<boolean>(!portfolio.myPlan?.signedAt);

  useEffect(() => {
    if (portfolio.myPlan) setPlan(portfolio.myPlan);
  }, [portfolio.myPlan]);

  const allocationSum =
    plan.allocationCore + plan.allocationSweden + plan.allocationSpice;
  const allocationOk = Math.abs(allocationSum - 100) < 0.01;
  const allRulesChecked = DEFAULT_RULES.every((r) => plan.rules[r.key]);
  const filledOut =
    plan.goal.trim().length > 0 &&
    plan.horizonYears > 0 &&
    plan.monthlyAmount >= 0 &&
    plan.signature.trim().length > 0 &&
    allocationOk &&
    allRulesChecked;

  const updateNum = (key: keyof MyPlan, value: string) => {
    const n = Number(value.replace(",", "."));
    if (Number.isFinite(n)) {
      setPlan({ ...plan, [key]: n });
    }
  };

  const updateText = (key: keyof MyPlan, value: string) => {
    setPlan({ ...plan, [key]: value });
  };

  const toggleRule = (key: string) => {
    setPlan({ ...plan, rules: { ...plan.rules, [key]: !plan.rules[key] } });
  };

  const handleSign = () => {
    if (!filledOut) return;
    const signed = { ...plan, signedAt: new Date().toISOString() };
    onSave(signed);
    setPlan(signed);
    setEditing(false);
  };

  const handleSaveDraft = () => {
    onSave(plan);
  };

  const handleEdit = () => {
    const draft = { ...plan, signedAt: undefined };
    setPlan(draft);
    onSave(draft);
    setEditing(true);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const signed = !!plan.signedAt && !editing;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-neutral-900">
        Min plan (IPS) {signed && <span className="text-primary-dark">— signerad ✓</span>}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
        Din <strong>Investeringspolicy</strong> (lektion 10) — skriven nu när
        du är lugn, för att läsa när du är panikslagen. Tidigare-du är klokare
        än just-nu-du under en krasch. Fyll i, signera, skriv ut. Skicka den
        gärna till en kompis eller förälder som pre-commitment på riktigt.
      </p>

      {signed ? (
        <CertificateView plan={plan} onEdit={handleEdit} onPrint={handlePrint} />
      ) : (
        <PlanForm
          plan={plan}
          allocationSum={allocationSum}
          allocationOk={allocationOk}
          allRulesChecked={allRulesChecked}
          filledOut={filledOut}
          updateNum={updateNum}
          updateText={updateText}
          toggleRule={toggleRule}
          onSign={handleSign}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </section>
  );
}

function PlanForm({
  plan,
  allocationSum,
  allocationOk,
  allRulesChecked,
  filledOut,
  updateNum,
  updateText,
  toggleRule,
  onSign,
  onSaveDraft,
}: {
  plan: MyPlan;
  allocationSum: number;
  allocationOk: boolean;
  allRulesChecked: boolean;
  filledOut: boolean;
  updateNum: (key: keyof MyPlan, value: string) => void;
  updateText: (key: keyof MyPlan, value: string) => void;
  toggleRule: (key: string) => void;
  onSign: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="mt-4 space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
      <Field label="1. Mitt mål" hint="Vad sparar du till? Pension, hus, frihet, trygghet…">
        <input
          type="text"
          value={plan.goal}
          onChange={(e) => updateText("goal", e.target.value)}
          placeholder="t.ex. Ekonomisk frihet vid 55"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </Field>

      <Field label="2. Min sparhorisont" hint="Antal år tills du behöver pengarna">
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={plan.horizonYears}
            onChange={(e) => updateNum("horizonYears", e.target.value)}
            className="w-20 rounded-lg border border-neutral-200 px-2 py-2 text-sm tabular-nums focus:border-primary focus:outline-none"
          />
          <span className="text-sm text-neutral-500">år</span>
        </div>
      </Field>

      <Field
        label="3. Mitt månadssparande"
        hint="Belopp som dras automatiskt varje månad — gärna direkt efter lön"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={plan.monthlyAmount}
            onChange={(e) => updateNum("monthlyAmount", e.target.value)}
            className="w-24 rounded-lg border border-neutral-200 px-2 py-2 text-sm tabular-nums focus:border-primary focus:outline-none"
          />
          <span className="text-sm text-neutral-500">kr/månad</span>
        </div>
      </Field>

      <Field
        label="4. Min allokering"
        hint="Hur du fördelar mellan kärna (global), Sverige-tilt och krydda (enskilda)"
      >
        <div className="grid grid-cols-3 gap-3">
          <AllocInput
            label="Globalfond (kärna)"
            value={plan.allocationCore}
            onChange={(v) => updateNum("allocationCore", v)}
          />
          <AllocInput
            label="Sverige-tilt"
            value={plan.allocationSweden}
            onChange={(v) => updateNum("allocationSweden", v)}
          />
          <AllocInput
            label="Krydda"
            value={plan.allocationSpice}
            onChange={(v) => updateNum("allocationSpice", v)}
          />
        </div>
        <p
          className={cn(
            "mt-2 text-xs",
            allocationOk ? "text-neutral-500" : "text-red-600",
          )}
        >
          Summa: {allocationSum.toFixed(0)} %{" "}
          {allocationOk ? "(ok)" : "— måste bli exakt 100 %"}
        </p>
      </Field>

      <Field
        label="5. Mina regler"
        hint="Bocka i de regler du lovar dig själv följa. Alla ska kryssas för att signera."
      >
        <div className="space-y-2">
          {DEFAULT_RULES.map((r) => (
            <label
              key={r.key}
              className="flex items-start gap-2 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={!!plan.rules[r.key]}
                onChange={() => toggleRule(r.key)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
        {!allRulesChecked && (
          <p className="mt-2 text-xs text-amber-700">
            Du måste kryssa i alla reglerna för att signera planen.
          </p>
        )}
      </Field>

      <Field
        label="6. Underskrift"
        hint="Skriv ditt namn för att signera planen — som ett löfte till framtida-dig"
      >
        <input
          type="text"
          value={plan.signature}
          onChange={(e) => updateText("signature", e.target.value)}
          placeholder="Ditt namn"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
        <button
          type="button"
          onClick={onSign}
          disabled={!filledOut}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Signera och spara
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
        >
          Spara utkast
        </button>
        {!filledOut && (
          <span className="text-xs text-neutral-500">
            Fyll i alla fält + bocka alla regler + ange underskrift för att signera.
          </span>
        )}
      </div>
    </div>
  );
}

function CertificateView({
  plan,
  onEdit,
  onPrint,
}: {
  plan: MyPlan;
  onEdit: () => void;
  onPrint: () => void;
}) {
  const signedDate = plan.signedAt
    ? new Date(plan.signedAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="mt-4 space-y-6">
      <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-white to-white p-8 print:border-black">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-neutral-500">
            Aktieskolan
          </div>
          <h3 className="mt-2 text-2xl font-bold text-neutral-900">Certifikat</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Detta intygar att <strong>{plan.signature}</strong> har gått igenom
            Aktieskolans 10 lektioner och skrivit en egen investeringspolicy
            den {signedDate}.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-2">
          <Row label="Mål">{plan.goal}</Row>
          <Row label="Horisont">{plan.horizonYears} år</Row>
          <Row label="Månadssparande">{formatKr(plan.monthlyAmount)}/månad</Row>
          <Row label="Allokering">
            {plan.allocationCore} % global · {plan.allocationSweden} % Sverige ·{" "}
            {plan.allocationSpice} % krydda
          </Row>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            Mina regler
          </div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            {DEFAULT_RULES.filter((r) => plan.rules[r.key]).map((r) => (
              <li key={r.key} className="flex items-start gap-2">
                <span aria-hidden="true" className="text-primary-dark">
                  ✓
                </span>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-neutral-200 pt-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              Underskrift
            </div>
            <div className="mt-1 font-mono text-lg italic text-neutral-900">
              {plan.signature}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              Datum
            </div>
            <div className="mt-1 tabular-nums text-neutral-900">
              {signedDate}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={onPrint}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Skriv ut / spara som PDF
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
        >
          Redigera planen
        </button>
      </div>

      <p className="text-xs leading-relaxed text-neutral-500 print:hidden">
        Tips: skicka certifikatet till en kompis eller förälder. Pre-commitment
        är hela poängen — att binda upp framtida-dig vid de regler nuvarande-dig
        är klok nog att sätta.
      </p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-neutral-900">{label}</div>
      <div className="mt-0.5 text-xs text-neutral-500">{hint}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function AllocInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-600">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm tabular-nums focus:border-primary focus:outline-none"
        />
        <span className="text-neutral-500">%</span>
      </div>
    </label>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-neutral-900">{children}</div>
    </div>
  );
}
