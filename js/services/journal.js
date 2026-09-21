// Arthashala Psychological Trading Journal & Behavioral Bias Analytics
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_JOURNAL = "arthashala_trading_journal";

  let entries = JSON.parse(localStorage.getItem(STORAGE_KEY_JOURNAL)) || [
    {
      id: "jrn-1",
      tradeId: "hist-1",
      symbol: "TCS",
      date: new Date(Date.now() - 86400000 * 5).toLocaleDateString("en-IN"),
      setup: "EMA 20 Pullback + Volume Breakout",
      outcome: "WIN",
      pnl: 4400,
      pnlPct: 2.61,
      emotion: "Disciplined", // Options: Disciplined, FOMO, Anxious, Greedy, Patient
      followedPlan: true,
      respectedSL: true,
      riskBelow2Pct: true,
      notes: "Waited patiently for TCS to retest the 20-day EMA support on daily timeframe. Entered with tight ₹25 stop loss. Exited at predetermined 1:2.5 target."
    },
    {
      id: "jrn-2",
      tradeId: "hist-2",
      symbol: "BANKNIFTY",
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString("en-IN"),
      setup: "Macro Reaction / Support Bounce",
      outcome: "WIN",
      pnl: 13500,
      pnlPct: 0.88,
      emotion: "Patient",
      followedPlan: true,
      respectedSL: true,
      riskBelow2Pct: true,
      notes: "Bank Nifty held 50,800 major round level during RBI governor speech. Good risk-reward trade, trailing stop locked in gains."
    },
    {
      id: "jrn-3",
      tradeId: "hist-3",
      symbol: "INFY",
      date: new Date(Date.now() - 86400000 * 1).toLocaleDateString("en-IN"),
      setup: "Chasing Momentum / Short Breakdown",
      outcome: "LOSS",
      pnl: -2500,
      pnlPct: -1.30,
      emotion: "FOMO",
      followedPlan: false,
      respectedSL: true,
      riskBelow2Pct: true,
      notes: "Entered without waiting for 15-minute candle confirmation. Saw green candles flip and panicked. Fortunately respected hard stop loss."
    }
  ];

  function save() {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
  }

  window.ArthashalaServices.journal = {
    getEntries: function() {
      return entries;
    },
    addEntry: function(entryData) {
      const newEntry = {
        id: "jrn-" + Date.now(),
        date: new Date().toLocaleDateString("en-IN"),
        ...entryData
      };
      entries.unshift(newEntry);
      save();

      // Award XP for deliberate journaling
      if (window.ArthashalaServices.gamification) {
        window.ArthashalaServices.gamification.addXP(40, "Logged psychological journal entry");
      }
      return newEntry;
    },
    deleteEntry: function(id) {
      const idx = entries.findIndex(e => e.id === id);
      if (idx !== -1) {
        entries.splice(idx, 1);
        save();
        return true;
      }
      return false;
    },
    onTradeClosed: function(trade) {
      // Auto-create stub journal entry prompting trader to reflect
      const defaultEmotion = trade.pnl >= 0 ? "Disciplined" : "FOMO";
      const newEntry = {
        id: "jrn-" + Date.now(),
        tradeId: trade.id,
        symbol: trade.symbol,
        date: new Date().toLocaleDateString("en-IN"),
        setup: trade.reason || "Simulated Execution",
        outcome: trade.pnl >= 0 ? "WIN" : "LOSS",
        pnl: trade.pnl,
        pnlPct: trade.pnlPct,
        emotion: defaultEmotion,
        followedPlan: trade.pnl >= 0,
        respectedSL: true,
        riskBelow2Pct: true,
        notes: `Closed ${trade.side} position on ${trade.symbol}. Net P&L: ₹${trade.pnl.toLocaleString('en-IN')}. Reflection: Always honor predefined trade rules.`
      };
      entries.unshift(newEntry);
      save();
    },

    // Behavioral Insights Engine
    getInsights: function() {
      const total = entries.length;
      if (total === 0) {
        return {
          disciplineScore: 100,
          fomoLossRate: 0,
          planAdherence: 100,
          slRespectRate: 100,
          recommendations: ["Start logging every closed trade to uncover psychological patterns."]
        };
      }

      const planCompliant = entries.filter(e => e.followedPlan).length;
      const slCompliant = entries.filter(e => e.respectedSL).length;
      const fomoTrades = entries.filter(e => e.emotion === "FOMO");
      const fomoLosses = fomoTrades.filter(e => e.outcome === "LOSS").length;
      const fomoLossRate = fomoTrades.length > 0 ? (fomoLosses / fomoTrades.length) * 100 : 0;

      const disciplineScore = Math.round(((planCompliant + slCompliant) / (total * 2)) * 100);

      const recommendations = [];
      if (fomoTrades.length > 0 && fomoLossRate >= 50) {
        recommendations.push("⚠️ Behavioral Alert: Over 60% of your FOMO-tagged trades ended in losses. Implement a mandatory 5-minute wait rule before chasing breakout candles.");
      }
      if (slCompliant / total >= 0.8) {
        recommendations.push("✅ Strong Execution: You have respected your Stop Loss in >80% of trades, which protects your capital against black swan crashes.");
      }
      if (planCompliant / total < 0.7) {
        recommendations.push("⚠️ Trading Deviation: You are deviating from your written trade plan in over 30% of entries. Review the Technical Analysis track.");
      }
      if (recommendations.length === 0) {
        recommendations.push("🎯 Balanced Mindset: Your emotional journal exhibits steady discipline across recent market swings.");
      }

      return {
        disciplineScore: disciplineScore,
        fomoTradesCount: fomoTrades.length,
        fomoLossRate: Math.round(fomoLossRate),
        planAdherence: Math.round((planCompliant / total) * 100),
        slRespectRate: Math.round((slCompliant / total) * 100),
        recommendations: recommendations
      };
    }
  };
})();
