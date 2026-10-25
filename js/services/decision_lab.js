// ==========================================================================
// Wealth Signal Interactive Financial Decision Lab
// Real-world financial dilemma simulation with AI Behavioral Evaluation
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const SCENARIOS = [
    {
      id: "lab-01",
      title: "The 2020 Black Swan Crash",
      category: "Market Psychology & Crisis Management",
      difficulty: "Intermediate",
      premise: "Global pandemic panic triggers a brutal 38% market drop in 3 weeks. Your equity portfolio drops from ₹20,00,000 to ₹12,40,000. Headlines scream 'Global Depression Imminent'. You have ₹4,00,000 in liquid emergency cash remaining.",
      choices: [
        {
          id: "A",
          text: "Panic Sell Everything: Liquidate the entire ₹12.4L portfolio to cash to prevent further losses until markets show a guaranteed recovery.",
          score: 25,
          bias: "Severe Loss Aversion & Recency Bias",
          consequence: "You lock in a ₹7.6L permanent capital loss. The market begins a historic V-shaped rally 6 weeks later. Staying in cash results in missing a 140% multi-year bull run.",
          wealthImpact10Y: "Portfolio value at Year 10: ₹21 Lakhs (barely outpacing inflation)."
        },
        {
          id: "B",
          text: "Do Nothing & Hold: Maintain your existing asset allocation without selling, but refrain from investing additional cash out of uncertainty.",
          score: 75,
          bias: "Passive Inaction / Status Quo Bias",
          consequence: "Disciplined emotional containment prevents you from selling at the bottom. Your existing portfolio fully recovers to pre-crash levels within 8 months.",
          wealthImpact10Y: "Portfolio value at Year 10: ₹58 Lakhs."
        },
        {
          id: "C",
          text: "Systematic Opportunistic Buying: Deploy 50% of surplus cash (₹2,00,000) systematically into high-quality index funds over 4 tranches, keeping ₹2,00,000 as essential emergency buffer.",
          score: 98,
          bias: "Rational Anti-Cyclical Discipline (Buffett Rule)",
          consequence: "You acquire productive assets at generational price-to-earnings valuations while preserving a 6-month living safety net. Returns compound exponentially over the subsequent bull cycle.",
          wealthImpact10Y: "Portfolio value at Year 10: ₹84 Lakhs (Maximized Compound Wealth)."
        }
      ],
      aiDebrief: "Warren Buffett famously noted: 'Be fearful when others are greedy, and greedy when others are fearful.' In severe market drawdowns, volatility is the price of admission for long-term equity compounding. Selling locks in temporary paper drawdowns into permanent capital destruction."
    },
    {
      id: "lab-02",
      title: "The ₹15,00,000 Windfall Dilemma",
      category: "Personal Capital Allocation & Debt",
      difficulty: "Beginner",
      premise: "You receive an unexpected ₹15,00,000 performance bonus after taxes. You currently have an active 20-year Home Loan of ₹45,00,000 at 8.6% interest rate. Historical equity index returns average 12.5% CAGR.",
      choices: [
        {
          id: "A",
          text: "Prepay 100% into Home Loan: Put the entire ₹15 Lakhs into the loan principal to drastically reduce interest burden and shave 8 years off the tenure.",
          score: 82,
          bias: "Debt Aversion / Psychological Freedom",
          consequence: "Guarantees a risk-free, tax-free return equal to your loan interest rate (8.6%). Provides immense peace of mind, though sacrifices the higher compounding potential of equity markets.",
          wealthImpact10Y: "Net Interest Saved: ₹22.8 Lakhs. Mental peace: High."
        },
        {
          id: "B",
          text: "Invest 100% in Broad Market Equity: Keep paying the regular monthly home loan EMI and invest the full ₹15 Lakhs into Nifty 50 / S&P 500 index funds.",
          score: 85,
          bias: "Mathematical Optimizer / High Risk Tolerance",
          consequence: "Maximizes mathematical expected value (+3.9% net interest spread over 15-20 years), but exposes the lump sum to intermediate equity volatility and interest rate hike cycles.",
          wealthImpact10Y: "Projected Equity Value at Year 10: ₹48.7 Lakhs vs remaining loan."
        },
        {
          id: "C",
          text: "The Balanced Hybrid: Prepay ₹7.5 Lakhs toward loan principal (saving 4.5 years of EMI) and invest ₹7.5 Lakhs systematically into equity funds.",
          score: 96,
          bias: "Balanced Behavioral Pragmatism",
          consequence: "Achieves the holy grail of behavioral finance: tangible debt relief that reduces monthly anxiety, combined with significant long-term equity growth compounding.",
          wealthImpact10Y: "Net Wealth Advantage: ₹36 Lakhs with superior psychological resilience."
        }
      ],
      aiDebrief: "Pure mathematics often clashes with human sleep-at-night factor. While equity compounding theoretically beats an 8.6% loan rate, a guaranteed risk-free 8.6% return from debt prepayment provides unbeatable defensive balance."
    },
    {
      id: "lab-03",
      title: "The 18% Guaranteed Debenture Trap",
      category: "Scam Detection & Yield Risk",
      difficulty: "Intermediate",
      premise: "A friend invites you to an exclusive private finance firm offering '18% Fixed Guaranteed Annual Returns' on secured high-yield company debentures, backed by 'real estate assets'. Bank Fixed Deposits are currently paying 7.1%.",
      choices: [
        {
          id: "A",
          text: "Invest 50% of Life Savings: The 18% return will double your capital in 4 years (Rule of 72). The company shows impressive glossy brochures and testimonials.",
          score: 15,
          bias: "Greed & Unchecked Yield Chasing",
          consequence: "Classic Ponzi / Unregulated deposit scheme. Within 18 months, payouts stall, promoter absconds, and police filings begin. Total recovery: less than 10%.",
          wealthImpact10Y: "Capital permanently decimated."
        },
        {
          id: "B",
          text: "Invest a small token amount of ₹50,000 'just to test' if they really pay monthly interest.",
          score: 40,
          bias: "Gambler's Foot-in-the-Door Vulnerability",
          consequence: "Ponzi schemes intentionally pay the first 3-6 months from new investor inflows to build trust and entice you to deposit millions later.",
          wealthImpact10Y: "High risk of subsequent larger deposit trap."
        },
        {
          id: "C",
          text: "Conduct Regulatory Verification & Reject: Check SEBI SCORES, RBI Sachchet portal, and MCA registry. When finding no approved SEBI Credit Rating (AAA/AA) or public prospectus, report the scheme.",
          score: 100,
          bias: "Zero-Trust Financial Skepticism",
          consequence: "You protect 100% of your hard-earned capital. You stick to regulated instruments (RBI Floating Rate Bonds, AAA Corporate Bonds, Sovereign Gold Bonds).",
          wealthImpact10Y: "100% capital preservation with compounding in legitimate assets."
        }
      ],
      aiDebrief: "Financial Axiom: 'If an investment promises equity-like returns (18%+) with zero risk, the risk is not zero — the return is zero because the principal is fraudulent.' In India, always verify issuers on sebi.gov.in."
    }
  ];

  const DecisionLab = {
    getScenarios() {
      return SCENARIOS;
    },
    getScenarioById(id) {
      return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
    }
  };

  window.ArthashalaServices.decisionLab = DecisionLab;
})();
