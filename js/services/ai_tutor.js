// =========================================================================================
// Wealth Signal Omni-Market Financial AI Tutor & Universal Intelligence Controller
// Conversational Engine, Multi-Market State Management, Explanations (Beginner to Institutional),
// Verified Citations & Text-to-Speech Audio Synthesis
// =========================================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_CHAT = "arthashala_ai_chat_history";
  const STORAGE_KEY_CAT = "arthashala_ai_selected_cat";
  const STORAGE_KEY_LVL = "arthashala_ai_explanation_level";

  const DEFAULT_WELCOME = {
    role: "assistant",
    title: "Namaste & Welcome to Wealth Signal AI Financial Intelligence Tutor",
    category: "all",
    level: "intermediate",
    citations: [
      "SEBI Master Circulars (Equities & F&O Risk)",
      "RBI Monetary Policy & Forex Guidelines",
      "US Federal Reserve & SEC Disclosure Rules",
      "CBOE Options Institute & OCC Standards",
      "Fabozzi Fixed Income Mathematics & US Treasury",
      "BIS Basel III Capital Adequacy Framework",
      "World Gold Council & MCX By-Laws"
    ],
    content: `I am your verified **AI Financial Intelligence Tutor**. I provide mathematically rigorous, regulatory-grounded guidance across all major asset classes and personal finance disciplines:

- **Stock Market / Equities**: NSE/BSE fundamentals, Damodaran DCF, ASM/GSM surveillance, P/E vs PEG, corporate governance red flags.
- **Options & Derivatives**: The Greeks ($\\Delta, \\Gamma, \\Theta, \\nu$), Black-Scholes pricing, defined-risk spreads, SEBI 93% retail loss study.
- **Crypto & Digital Assets**: Bitcoin Halving cycles, Proof-of-Work vs Proof-of-Stake, on-chain metrics, Indian 30% tax (Sec 115BBH) & 1% TDS.
- **Forex & Currencies**: Pips, lots, USD/INR mechanics, RBI forex intervention ($690B+ reserves), carry trades, FEMA 1999 boundaries.
- **Commodities & Energy**: MCX Gold & Silver delivery, Contango vs Backwardation, Brent vs WTI crude, OPEC+ quotas, Doctor Copper.
- **Bond Market & Fixed Income**: The inverse law of bond prices & yields, Macaulay duration, 10Y Indian G-Sec benchmark, inverted yield curve signals.
- **Personal Wealth & Risk**: Emergency runways, debt payoff optimization, retirement FIRE math, and the 1% risk rule.

Toggle your desired explanation level above (**Beginner, Intermediate, Advanced, or Institutional**), ask any question below, or click any suggested prompt!`,
    timestamp: Date.now() - 3600000 * 4,
    followUps: [
      "Explain P/E ratio vs PEG ratio with TCS vs Tata Motors",
      "Why do 93% retail traders lose money in options according to SEBI?",
      "How does an inverted yield curve predict economic recessions?",
      "How does the RBI Repo rate impact my floating rate home loan EMI?"
    ]
  };

  let chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_CHAT)) || [DEFAULT_WELCOME];
  let isHinglishMode = false;
  let activeCategory = localStorage.getItem(STORAGE_KEY_CAT) || "all";
  let explanationLevel = localStorage.getItem(STORAGE_KEY_LVL) || "intermediate";

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatHistory));
      localStorage.setItem(STORAGE_KEY_CAT, activeCategory);
      localStorage.setItem(STORAGE_KEY_LVL, explanationLevel);
    } catch(e) {
      console.warn("Could not save AI tutor history to localStorage:", e);
    }
  }

  // Voice Speech Synthesis Helper
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const cleanText = text.replace(/[*#`_$\\]/g, "").replace(/\n+/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 350));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  function generateFollowUps(domain) {
    switch(domain) {
      case "stocks":
        return [
          "What are the top 3 audit red flags in an Indian annual report?",
          "How does SEBI's ASM and GSM framework protect retail investors?",
          "How do I calculate intrinsic value using Damodaran DCF?"
        ];
      case "options":
        return [
          "Explain Theta decay and why weekly options expire at zero",
          "What is the difference between Bull Call Spread and Iron Condor?",
          "How do I calculate Implied Volatility (IV) Rank and Percentile?"
        ];
      case "crypto":
        return [
          "Compare Proof of Work (Bitcoin) vs Proof of Stake (Ethereum)",
          "What is Impermanent Loss for Uniswap liquidity providers?",
          "Explain Indian crypto tax under Section 115BBH and 1% TDS"
        ];
      case "forex":
        return [
          "How does RBI manage USD/INR volatility in the forex market?",
          "What is the global currency carry trade and why does it unwind?",
          "What are legal boundaries for trading forex under FEMA 1999?"
        ];
      case "commodities":
        return [
          "What is the difference between Contango and Backwardation in Crude Oil?",
          "Why is Gold considered a macro hedge against fiat debasement?",
          "How does the historical Gold-to-Silver ratio work?"
        ];
      case "bonds":
        return [
          "Why do bond prices fall when interest rates rise?",
          "What is an inverted yield curve and why does it predict recessions?",
          "How can Indian retail investors buy G-Secs via RBI Retail Direct?"
        ];
      case "macro":
      default:
        return [
          "How does an RBI Repo Rate hike affect Bank Nifty and loan EMIs?",
          "How do I calculate safe position size with the 1.5% risk formula?",
          "What is the difference between CPI and WPI inflation in India?"
        ];
    }
  }

  window.ArthashalaServices.aiTutor = {
    getHistory: function() {
      return chatHistory;
    },
    isHinglish: function() {
      return isHinglishMode;
    },
    setHinglish: function(enabled) {
      isHinglishMode = !!enabled;
      return isHinglishMode;
    },
    getLevel: function() {
      return explanationLevel;
    },
    setLevel: function(lvl) {
      explanationLevel = lvl || "intermediate";
      save();
      return explanationLevel;
    },
    speakText: function(text) {
      speak(text);
    },
    getCategory: function() {
      return activeCategory;
    },
    setCategory: function(cat) {
      activeCategory = cat || "all";
      save();
      return activeCategory;
    },
    clearHistory: function() {
      chatHistory = [DEFAULT_WELCOME];
      save();
    },
    getSources: function(category = "all") {
      const allSources = (window.ArthashalaData.aiKnowledge && window.ArthashalaData.aiKnowledge.valuableSources) || [];
      if (!category || category === "all") return allSources;
      return allSources.filter(s => s.category === category);
    },
    getQuickPrompts: function(category = "all") {
      const allPrompts = (window.ArthashalaData.aiKnowledge && window.ArthashalaData.aiKnowledge.quickPrompts) || [];
      if (!category || category === "all") return allPrompts;
      return allPrompts.filter(p => p.category === category || p.category === "all");
    },
    ask: function(queryText) {
      if (!queryText || !queryText.trim()) return null;

      const trimmed = queryText.trim();

      // Add user message to history
      const userMsg = {
        role: "user",
        content: trimmed,
        category: activeCategory,
        level: explanationLevel,
        timestamp: Date.now()
      };
      chatHistory.push(userMsg);

      // Generate verified knowledge response via our Omni-Engine
      const knowledgeEngine = window.ArthashalaData.aiKnowledge;
      const baseAnswer = knowledgeEngine.generateAnswer(trimmed, isHinglishMode, activeCategory);

      // Adapt answer tone based on selected explanation level
      let adaptedText = baseAnswer.text;
      let levelBadge = "";
      if (explanationLevel === "beginner") {
        levelBadge = "🔰 **Beginner Perspective (Plain English & Analogy)**:\n\n";
        adaptedText = levelBadge + adaptedText;
      } else if (explanationLevel === "advanced") {
        levelBadge = "⚡ **Quantitative & Risk Analysis Depth**:\n\n";
        adaptedText = levelBadge + adaptedText + "\n\n> *Mathematical Note: Ensure position delta and tail-risk VaR remain strictly monitored within portfolio allocation limits.*";
      } else if (explanationLevel === "institutional") {
        levelBadge = "🏛️ **Institutional & Regulatory Perspective (SEBI/RBI/SEC/BIS)**:\n\n";
        adaptedText = levelBadge + adaptedText + "\n\n> *Regulatory Notice: Citations verified against SEBI Master Circulars, RBI External Commercial Borrowing/NDS-OM guidelines, and Basel Committee on Banking Supervision.*";
      }

      const followUps = generateFollowUps(baseAnswer.category || "stocks");

      const assistantMsg = {
        role: "assistant",
        title: baseAnswer.title,
        category: baseAnswer.category,
        level: explanationLevel,
        citations: baseAnswer.citations,
        content: adaptedText,
        simulatorAction: baseAnswer.simulatorAction,
        followUps: followUps,
        timestamp: Date.now()
      };

      chatHistory.push(assistantMsg);
      save();

      // Award XP for engaging with multi-market financial education
      if (window.ArthashalaServices.gamification) {
        window.ArthashalaServices.gamification.addXP(25, `Consulted AI Finance Tutor (${explanationLevel.toUpperCase()})`);
      }

      return assistantMsg;
    }
  };
})();
