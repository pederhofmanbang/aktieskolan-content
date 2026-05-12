/**
 * Hämtar 10 års daglig EOD-data för svenska aktier (Yahoo Finance) och
 * genererar deterministisk syntetisk historik för fyra svenska fonder.
 *
 * Output: data/prices.json — { lastUpdated, instruments: { TICKER: {...} } }
 *
 * Kör manuellt vid behov: `node scripts/fetch-stock-data.mjs`
 */

import YahooFinance from "yahoo-finance2";
import { writeFile, mkdir } from "node:fs/promises";

const yahooFinance = new YahooFinance();
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, "..", "data", "prices.json");
const YEARS_BACK = 10;

const stocks = [
  { ticker: "INVE-B.ST", name: "Investor B", currency: "SEK", sector: "Investmentbolag" },
  { ticker: "INVE-A.ST", name: "Investor A", currency: "SEK", sector: "Investmentbolag" },
  { ticker: "HM-B.ST", name: "H&M B", currency: "SEK", sector: "Detaljhandel" },
  { ticker: "VOLV-B.ST", name: "Volvo B", currency: "SEK", sector: "Industri" },
  { ticker: "ATCO-B.ST", name: "Atlas Copco B", currency: "SEK", sector: "Industri" },
  { ticker: "ERIC-B.ST", name: "Ericsson B", currency: "SEK", sector: "Telekom" },
  { ticker: "SHB-A.ST", name: "Handelsbanken A", currency: "SEK", sector: "Bank" },
  { ticker: "SEB-A.ST", name: "SEB A", currency: "SEK", sector: "Bank" },
  { ticker: "SWED-A.ST", name: "Swedbank A", currency: "SEK", sector: "Bank" },
  { ticker: "NDA-SE.ST", name: "Nordea", currency: "SEK", sector: "Bank" },
  { ticker: "EVO.ST", name: "Evolution", currency: "SEK", sector: "Spel" },
  { ticker: "AZN.ST", name: "AstraZeneca", currency: "SEK", sector: "Läkemedel" },
  { ticker: "SAND.ST", name: "Sandvik", currency: "SEK", sector: "Industri" },
  { ticker: "ASSA-B.ST", name: "Assa Abloy B", currency: "SEK", sector: "Industri" },
  { ticker: "BOL.ST", name: "Boliden", currency: "SEK", sector: "Råvaror" },
  { ticker: "ABB.ST", name: "ABB", currency: "SEK", sector: "Industri" },
];

// Syntetiska fond-kurser. Realistiska årliga snitt och volatilitet för
// respektive marknad. Seed gör att alla användare ser samma historik.
const funds = [
  { ticker: "AVANZA-GLOBAL", name: "Avanza Global", currency: "SEK", fee: 0.0009, annualReturn: 0.085, annualVol: 0.15, seed: 1001 },
  { ticker: "LF-GLOBAL-INDEXNARA", name: "Länsförsäkringar Global Indexnära", currency: "SEK", fee: 0.0021, annualReturn: 0.082, annualVol: 0.15, seed: 1002 },
  { ticker: "DNB-GLOBAL-INDEKS", name: "DNB Global Indeks", currency: "SEK", fee: 0.0030, annualReturn: 0.081, annualVol: 0.15, seed: 1003 },
  { ticker: "SEB-SVERIGE-INDEXNARA", name: "SEB Sverige Indexnära", currency: "SEK", fee: 0.0020, annualReturn: 0.095, annualVol: 0.19, seed: 1004 },
];

async function fetchStock({ ticker, name, currency, sector }) {
  process.stdout.write(`  ${ticker.padEnd(14)} `);
  const period1 = new Date();
  period1.setFullYear(period1.getFullYear() - YEARS_BACK);
  try {
    const result = await yahooFinance.chart(ticker, { period1, interval: "1d" });
    const prices = result.quotes
      .filter((q) => q.close != null && q.date)
      .map((q) => ({
        date: q.date.toISOString().slice(0, 10),
        close: Math.round(q.close * 100) / 100,
      }));
    if (prices.length === 0) throw new Error("no data returned");
    console.log(`${prices.length} dagar, senast ${prices.at(-1).close} ${currency}`);
    return { ticker, name, currency, sector, type: "stock", prices };
  } catch (e) {
    console.log(`FEL: ${e.message}`);
    return null;
  }
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng) {
  const u = rng() || 1e-9;
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateFundHistory({ ticker, name, currency, fee, annualReturn, annualVol, seed }) {
  process.stdout.write(`  ${ticker.padEnd(22)} `);
  const rng = mulberry32(seed);
  const TRADING_DAYS = 252;
  const dailyDrift = annualReturn / TRADING_DAYS;
  const dailyVol = annualVol / Math.sqrt(TRADING_DAYS);
  const dailyFee = fee / TRADING_DAYS;
  let nav = 100;
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(start.getFullYear() - YEARS_BACK);
  const prices = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const z = gaussian(rng);
    nav = nav * (1 + dailyDrift + dailyVol * z - dailyFee);
    prices.push({
      date: d.toISOString().slice(0, 10),
      close: Math.round(nav * 100) / 100,
    });
  }
  console.log(`${prices.length} dagar, slutkurs ${prices.at(-1).close} ${currency}`);
  return { ticker, name, currency, type: "fund", fee, prices };
}

async function main() {
  console.log(`Hämtar aktiekurser från Yahoo (${YEARS_BACK} år tillbaka):`);
  const stockResults = [];
  for (const s of stocks) {
    const r = await fetchStock(s);
    if (r) stockResults.push(r);
    await new Promise((res) => setTimeout(res, 500));
  }

  console.log(`\nGenererar syntetiska fondkurser:`);
  const fundResults = funds.map(generateFundHistory);

  const out = {
    lastUpdated: new Date().toISOString(),
    yearsBack: YEARS_BACK,
    instruments: {},
  };
  for (const r of [...stockResults, ...fundResults]) {
    out.instruments[r.ticker] = r;
  }

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(out));
  const sizeMB = (JSON.stringify(out).length / 1024 / 1024).toFixed(2);
  console.log(
    `\nSkrev ${OUT_FILE}: ${stockResults.length} aktier + ${fundResults.length} fonder, ${sizeMB} MB`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
