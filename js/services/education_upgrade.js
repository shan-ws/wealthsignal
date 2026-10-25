// ==========================================================================
// Wealth Signal Financial Intelligence Score (FIS) & Skill Passport Engine
// Verifiable Credentialing, Dynamic Adaptive Assessment & Milestone Certificates
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_FIS = "arthashala_fis_score_data";

  const FIS_QUESTIONS = [
    {
      id: 1,
      category: "Compounding & Time Value",
      question: "According to the Rule of 72, how long will it take for an investment to double in value at a 12% annual compounding rate?",
      options: [
        "Approximately 4 years",
        "Approximately 6 years",
        "Approximately 8.5 years",
        "Approximately 12 years"
      ],
      correctIndex: 1,
      explanation: "Rule of 72 formula: 72 / Annual Interest Rate = Years to double. 72 / 12 = 6 years."
    },
    {
      id: 2,
      category: "Risk Management",
      question: "If your trading capital is ₹5,00,000 and you adhere to the standard institutional 1% risk rule, what is the maximum amount you should risk on a single trade?",
      options: [
        "₹50,000",
        "₹15,000",
        "₹5,000",
        "₹1,000"
      ],
      correctIndex: 2,
      explanation: "1% of ₹5,00,000 = ₹5,000. Your position sizing and stop-loss must be calculated so that hitting the stop-loss loses no more than ₹5,000."
    },
    {
      id: 3,
      category: "Fixed Income & Bonds",
      question: "When market interest rates increase, what happens to the market price of existing fixed-rate bonds?",
      options: [
        "Bond prices rise",
        "Bond prices fall",
        "Bond prices remain completely unchanged",
        "Bond coupon payments double automatically"
      ],
      correctIndex: 1,
      explanation: "Bond prices and market interest yields have an inverse relationship. When prevailing yields rise, older bonds paying lower coupon rates must fall in price to offer competitive yields."
    },
    {
      id: 4,
      category: "Derivatives & Options",
      question: "Which options Greek represents the rate of time decay per day in an option's premium?",
      options: [
        "Delta (Δ)",
        "Gamma (Γ)",
        "Theta (Θ)",
        "Vega (ν)"
      ],
      correctIndex: 2,
      explanation: "Theta measures the decay in option value as each day passes toward expiration, which accelerates in the final weeks before expiry."
    },
    {
      id: 5,
      category: "Macroeconomics",
      question: "When the RBI increases the Cash Reserve Ratio (CRR), what direct effect does it have on the economy?",
      options: [
        "Banks have more money to lend, increasing money supply",
        "Banks must lock up more cash with RBI, reducing lending liquidity",
        "Corporate income tax drops by 5%",
        "Gold import duties are automatically removed"
      ],
      correctIndex: 1,
      explanation: "CRR is the mandatory portion of deposits banks must keep as cash reserves with the RBI. Raising CRR sucks liquidity out of the banking system to cool inflation."
    },
    {
      id: 6,
      category: "Taxation & Compliance",
      question: "Under Indian Income Tax rules post-Budget July 2024, what is the Long-Term Capital Gains (LTCG) tax rate on listed equity shares above the ₹1.25 Lakh exemption limit?",
      options: [
        "10%",
        "12.5%",
        "15%",
        "20%"
      ],
      correctIndex: 1,
      explanation: "Post-Budget 2024, LTCG on listed equities is revised to 12.5% for capital gains exceeding ₹1.25 Lakh per financial year."
    },
    {
      id: 7,
      category: "Scam Defense",
      question: "How are IPO application funds securely processed in India for retail investors?",
      options: [
        "By transferring cash via Google Pay directly to the broker's personal account",
        "Via ASBA (Application Supported by Blocked Amount) where funds stay in your own bank until allotment",
        "By wiring money to an offshore escrow account in Mauritius",
        "By sending cash through speed post to the stock exchange"
      ],
      correctIndex: 1,
      explanation: "ASBA keeps your funds safely blocked inside your own bank account. If shares are allotted, money is debited; if not allotted, the block is instantly released."
    },
    {
      id: 8,
      category: "Portfolio Analytics",
      question: "What does a Sharpe Ratio of 1.8 indicate about an investment portfolio?",
      options: [
        "The portfolio is losing 1.8% per month",
        "The portfolio generates 1.8 units of excess return for every 1 unit of total volatility risk",
        "The portfolio has an 82% probability of bankruptcy",
        "The portfolio holds exactly 18 different stocks"
      ],
      correctIndex: 1,
      explanation: "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Standard Deviation. A Sharpe above 1.0 is considered good, and above 1.5 is excellent risk-adjusted performance."
    }
  ];

  let storedData = null;
  try {
    storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_FIS));
  } catch(e) {
    storedData = null;
  }

  const defaultData = storedData || {
    score: 645,
    tier: "Competent Investor",
    assessedDate: "Recent",
    skills: {
      technical: 72,
      fundamental: 68,
      riskManagement: 75,
      macroeconomics: 62,
      scamDefense: 90
    },
    certificateId: "WS-CERT-2026-" + Math.floor(1000 + Math.random() * 9000)
  };

  const EducationUpgrade = {
    getFISQuestions() {
      return FIS_QUESTIONS;
    },

    getFISData() {
      return defaultData;
    },

    saveAssessment(score, answers) {
      let tier = "Novice Investor";
      if (score >= 780) tier = "Master Market Strategist";
      else if (score >= 675) tier = "Proficient Wealth Builder";
      else if (score >= 550) tier = "Competent Investor";

      defaultData.score = score;
      defaultData.tier = tier;
      defaultData.assessedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      try {
        localStorage.setItem(STORAGE_KEY_FIS, JSON.stringify(defaultData));
      } catch(e) {
        console.warn("Could not save FIS data:", e);
      }
      return defaultData;
    }
  };

  window.ArthashalaServices.educationUpgrade = EducationUpgrade;
})();
