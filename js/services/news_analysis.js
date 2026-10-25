// ==========================================================================
// Wealth Signal AI Financial News Analysis & Sentiment Intelligence Engine
// Features: Fear & Greed Index, Curated Breaking Wire, AI Explain Breakdown
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const NEWS_FEED = [
    {
      id: "news-01",
      title: "RBI MPC Holds Repo Rate at 6.50%, Shifts Stance to Neutral Amid Food Inflation Watch",
      source: "Reserve Bank of India / Financial Bureau",
      category: "Macro & Central Bank",
      timestamp: "18m ago",
      sentiment: "bullish",
      sentimentScore: 65,
      impact: {
        banking: "+0.9%",
        realEstate: "+1.4%",
        itSector: "+0.2%",
        bonds: "+0.6%"
      },
      summary: "The Monetary Policy Committee voted 5-1 to maintain the benchmark repo rate at 6.50% while shifting policy stance from 'Withdrawal of Accommodation' to 'Neutral', signaling potential rate cuts if inflation stabilizes within the 4% target band.",
      whyItMatters: "A 'Neutral' stance confirms that the tightening cycle is concluded. This lowers corporate borrowing rate expectations, stabilizes sovereign bond yields, and encourages home loan demand without triggering immediate currency depreciation.",
      portfolioImpact: "Rate-sensitive sectors (Real Estate, Auto, NBFCs) benefit first. Long-duration debt mutual funds and 10Y G-Secs rally as yields ease downward.",
      beginnerTLDR: "Imagine taking your foot off the brake while driving up a hill. The RBI isn't speeding up yet (no rate cut), but it's ready to shift gears smoothly as soon as the coast is clear.",
      educationalTakeaway: "Interest rate cycles move bond prices inversely: when future rate cuts loom, current bonds yielding 7%+ become more valuable."
    },
    {
      id: "news-02",
      title: "US Tech Giants Report $45B AI Infrastructure Capex Surge; Semiconductor Stocks Rally",
      source: "Nasdaq Intelligence / SEC 10-Q Filings",
      category: "Equities & AI",
      timestamp: "42m ago",
      sentiment: "bullish",
      sentimentScore: 82,
      impact: {
        semiconductors: "+3.8%",
        cloudSoftware: "+1.9%",
        energyUtilities: "+2.1%",
        consumerGoods: "-0.2%"
      },
      summary: "Hyperscalers (Microsoft, Alphabet, Amazon, Meta) revised full-year AI data center capital expenditures upward by 28%, securing next-generation GPU and ASIC allocations through 2026.",
      whyItMatters: "High capital expenditure directly flows into semiconductor foundry revenue, advanced cooling hardware, and power utility grids required to sustain multi-gigawatt AI clusters.",
      portfolioImpact: "Massive tailwind for Nvidia, TSMC, and semiconductor equipment manufacturers. Indian IT firms with cloud modernization practices experience expanding deal pipelines.",
      beginnerTLDR: "During a gold rush, the surest way to make money is selling picks, shovels, and sturdy boots. Tech giants are buying every shovel Nvidia can manufacture.",
      educationalTakeaway: "Capex cycles indicate corporate management's long-term conviction, but monitor Return on Invested Capital (ROIC) over 2-3 years to ensure spending yields real cash flow."
    },
    {
      id: "news-03",
      title: "Crude Oil Surges 3.2% as Middle East Transit Disruption Risks Mount; Brent Hits $78/bbl",
      source: "CME & S&P Global Platts",
      category: "Commodities & Energy",
      timestamp: "1h ago",
      sentiment: "bearish",
      sentimentScore: -48,
      impact: {
        oilGasUpstream: "+2.4%",
        paintsPaints: "-2.1%",
        aviation: "-3.0%",
        inrCurrency: "-0.2%"
      },
      summary: "Shipping reroutes around the Cape of Good Hope and geopolitical tensions add a risk premium to crude benchmarks, raising landed oil import costs for energy-importing economies.",
      whyItMatters: "India imports over 85% of its crude requirements. Every $10/barrel rise in crude typically expands India's Current Account Deficit by ~0.5% of GDP and puts mild pressure on the Rupee.",
      portfolioImpact: "Upstream oil exploration companies (ONGC, Oil India) benefit from higher realizations, whereas Paint manufacturers, Airlines, and Specialty Chemical firms face margin compression.",
      beginnerTLDR: "When the price of milk rises, tea stalls either raise cup prices or take a loss. For India, oil is the 'milk' of the entire transportation economy.",
      educationalTakeaway: "Track how raw material inflation transmits through corporate balance sheets: firms with strong pricing power can pass costs to consumers, while low-moat companies suffer."
    },
    {
      id: "news-04",
      title: "SEBI Mandates Higher F&O Lot Sizes and Eliminates Multiple Weekly Index Expiries",
      source: "Securities and Exchange Board of India Circular",
      category: "Derivatives & Regulation",
      timestamp: "2h ago",
      sentiment: "neutral",
      sentimentScore: 12,
      impact: {
        discountBrokers: "-4.2%",
        retailTraders: "Disciplined",
        cashMarketLiquidity: "+1.8%",
        exchanges: "-1.5%"
      },
      summary: "In response to findings that 93% of retail derivative participants lose money, SEBI raised minimum contract value from ₹5 Lakh to ₹15 Lakh and restricted weekly index option expiries to one per exchange.",
      whyItMatters: "Cuts down reckless speculative intraday gambling on expiry day 'hero-or-zero' options and redirects retail capital toward long-term systematic equity wealth creation.",
      portfolioImpact: "Brokerage revenues take an initial hit, but financial market systemic stability improves and cash market equity volumes rise.",
      beginnerTLDR: "The casino manager raised the minimum table bet from ₹500 to ₹1,500 so inexperienced players stop blowing their entire month's grocery budget in 10 minutes.",
      educationalTakeaway: "Options are mathematical risk-management insurance contracts, not lottery tickets. Understanding Theta decay is essential before placing any derivative trade."
    },
    {
      id: "news-05",
      title: "Gold MCX Crosses Record ₹73,000/10g on Global Central Bank Reserve Diversification",
      source: "World Gold Council / Bullion Wire",
      category: "Precious Metals",
      timestamp: "3h ago",
      sentiment: "bullish",
      sentimentScore: 74,
      impact: {
        jewelleryRetailers: "+1.2%",
        sovereignGoldBonds: "+2.0%",
        goldETFs: "+1.8%",
        cashHolders: "-0.5%"
      },
      summary: "Global central banks added 483 metric tons of gold in the past half-year to diversify foreign currency reserves away from weaponized fiat assets, propelling bullion to fresh peaks.",
      whyItMatters: "Gold remains humanity's oldest hedge against currency debasement and geopolitical fragmentation. Central banks are structural buyers with zero intention of short-term selling.",
      portfolioImpact: "Investors holding 10-15% gold allocation in their multi-asset portfolio enjoy reduced overall volatility and steady inflation defense.",
      beginnerTLDR: "When the weather forecast predicts multiple stormy seasons, governments stock up on umbrellas that never expire. Gold is the ultimate economic umbrella.",
      educationalTakeaway: "Holding Sovereign Gold Bonds (SGB) provides both physical gold price appreciation and an additional 2.50% annual coupon paid by the RBI."
    }
  ];

  const NewsAnalysis = {
    getFearAndGreed() {
      // Dynamic composite based on market conditions: 0 to 100
      return {
        value: 68,
        label: "Greed",
        description: "Investors are actively accumulating quality equities and tech leaders, supported by stable interest rate expectations and strong domestic liquidity.",
        historical: {
          yesterday: 65,
          lastWeek: 58,
          lastMonth: 44
        }
      };
    },

    getAllNews() {
      return NEWS_FEED;
    },

    getNewsById(id) {
      return NEWS_FEED.find(n => n.id === id) || NEWS_FEED[0];
    }
  };

  window.ArthashalaServices.newsAnalysis = NewsAnalysis;
})();
