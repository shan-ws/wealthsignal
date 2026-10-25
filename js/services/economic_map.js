// ==========================================================================
// Wealth Signal Global Economic Connections Map Engine
// Visual Macroeconomic Ripple Network & Capital Flow Transmission System
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const MACRO_SCENARIOS = [
    {
      id: "fed-hike",
      name: "US Federal Reserve Hikes Policy Rates (+50 bps)",
      tagline: "Global liquidity contraction & emerging market capital outflows",
      nodes: [
        { id: "central_rates", name: "Central Bank Rates", change: "+50 bps", trend: "up", reason: "Fed raises federal funds rate to suppress domestic consumer inflation." },
        { id: "usd_inr", name: "US Dollar Index (DXY)", change: "+1.8%", trend: "up", reason: "Higher US yields attract global institutional capital into USD cash equivalents." },
        { id: "bond_yields", name: "Global & Indian Bond Yields", change: "+24 bps", trend: "up", reason: "Bond prices fall as secondary market yields readjust upward to compete with Fed rates." },
        { id: "equities", name: "Stock Markets (Equities)", change: "-2.4%", trend: "down", reason: "Higher discount rates in DCF models compress valuation multiples (P/E compression)." },
        { id: "gold", name: "Gold & Commodities", change: "-1.5%", trend: "down", reason: "Rising non-yielding opportunity cost pressures gold in the immediate short term." },
        { id: "fii_flows", name: "FII Inflows into Emerging Markets", change: "-$1.4B Outflow", trend: "down", reason: "Foreign institutional investors pull capital from emerging equities to capture safe US Treasury yields." }
      ],
      transmissionStages: [
        "Stage 1 (Day 1-3): US Dollar surges; short-term debt and Treasury bills yield more.",
        "Stage 2 (Week 1-3): Foreign portfolio investors sell Indian large-cap equities; USD/INR touches resistance.",
        "Stage 3 (Month 1-3): RBI intervenes via forex reserves ($690B+) or liquidity tightening to stabilize rupee."
      ],
      historicalPrecedent: "2022-2023 Federal Reserve hiking cycle from 0% to 5.25%: Triggered global tech multiple contraction followed by flight to quality cash flow businesses."
    },
    {
      id: "oil-surge",
      name: "Geopolitical Shock: Crude Oil Spikes to $105/bbl",
      tagline: "Imported inflation shock for energy-dependent developing nations",
      nodes: [
        { id: "crude_oil", name: "Brent Crude Oil", change: "+28%", trend: "up", reason: "Supply disruptions through maritime chokepoints squeeze global petroleum inventories." },
        { id: "inflation", name: "Headline CPI Inflation", change: "+1.2%", trend: "up", reason: "Higher diesel & fuel freight costs cascade across food, FMCG, and manufacturing logistics." },
        { id: "usd_inr", name: "Indian Rupee (USD/INR)", change: "-0.8% (Weaker)", trend: "down", reason: "Oil marketing companies demand massive US dollar volumes to pay for imported oil tankers." },
        { id: "corporate_margins", name: "Corporate Operating Margins", change: "-180 bps", trend: "down", reason: "Airlines, Paint companies, and Plastics face sharp raw material cost escalation." },
        { id: "upstream_energy", name: "Upstream Oil & Gas (ONGC)", change: "+6.5%", trend: "up", reason: "Domestic crude oil producers realize premium prices on every exported and refined barrel." },
        { id: "gold", name: "Gold & Safe Havens", change: "+3.2%", trend: "up", reason: "Geopolitical fear triggers sovereign flight to physical gold reserves." }
      ],
      transmissionStages: [
        "Stage 1: Crude benchmark spikes on supply disruption announcements.",
        "Stage 2: Indian refiners purchase foreign exchange, widening India's Trade Deficit.",
        "Stage 3: Corporate earnings reports show EBITDA margin compression in consumer durables."
      ],
      historicalPrecedent: "March 2022 Russia-Ukraine conflict onset: Crude breached $130/bbl, causing global inflation spikes and widespread central bank rate interventions."
    },
    {
      id: "rbi-cut",
      name: "RBI Cuts Benchmark Repo Rate (-50 bps)",
      tagline: "Domestic credit expansion, real estate acceleration & debt rally",
      nodes: [
        { id: "central_rates", name: "RBI Repo Rate", change: "-50 bps", trend: "down", reason: "Monetary easing enacted to stimulate industrial capex and affordable housing demand." },
        { id: "bond_yields", name: "Indian 10Y G-Sec Yield", change: "-35 bps", trend: "down", reason: "Bond prices surge aggressively as lower rates lock in capital gains for bondholders." },
        { id: "real_estate", name: "Real Estate & Housing", change: "+4.8%", trend: "up", reason: "Floating rate home loan EMIs drop, expanding affordability for retail homebuyers." },
        { id: "equities", name: "Domestic Equities (Nifty)", change: "+3.4%", trend: "up", reason: "Cheaper corporate debt service and increased retail liquidity fuel stock valuation multiples." },
        { id: "bank_margins", name: "Bank Net Interest Margins (NIM)", change: "-15 bps", trend: "down", reason: "Asset yields reprice downward quicker than fixed deposit liability costs." },
        { id: "gold", name: "Domestic Gold Prices", change: "+1.1%", trend: "up", reason: "Lower interest returns on fixed deposits encourage gold asset allocation." }
      ],
      transmissionStages: [
        "Stage 1: Bond markets rally immediately on announcement day; G-Sec yields drop.",
        "Stage 2: Commercial banks adjust MCLR and External Benchmark Lending Rates (EBLR).",
        "Stage 3: Consumer vehicle loans and retail home disbursements pick up over 2-4 quarters."
      ],
      historicalPrecedent: "2019-2020 RBI rate cut cycle: Supported India's historic residential housing turnaround and fueled mid-cap equity expansion."
    }
  ];

  const EconomicMap = {
    getScenarios() {
      return MACRO_SCENARIOS;
    },
    getScenarioById(id) {
      return MACRO_SCENARIOS.find(s => s.id === id) || MACRO_SCENARIOS[0];
    }
  };

  window.ArthashalaServices.economicMap = EconomicMap;
})();
