// Arthashala Finance AI Tutor Controller - Conversational Engine & State Management
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_CHAT = "arthashala_ai_chat_history";

  let chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_CHAT)) || [
    {
      role: "assistant",
      title: "Namaste & Welcome to Wealth Signal AI Mentor",
      citations: ["SEBI Investor Education", "RBI Financial Literacy Framework"],
      content: `I am your regulatory-verified financial mentor. Ask me anything regarding **NSE/BSE stock valuation, SEBI circulars, RBI monetary policy, derivatives risk, or position sizing formulas**.\n\nToggle **Hinglish Mode** anytime if you prefer simple conversational explanations!`,
      timestamp: Date.now() - 3600000 * 12
    }
  ];

  let isHinglishMode = false;

  function save() {
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatHistory));
  }

  window.ArthashalaServices.aiTutor = {
    getHistory: function() {
      return chatHistory;
    },
    isHinglish: function() {
      return isHinglishMode;
    },
    setHinglish: function(enabled) {
      isHinglishMode = enabled;
      return isHinglishMode;
    },
    clearHistory: function() {
      chatHistory = [];
      save();
    },
    ask: function(queryText) {
      if (!queryText || !queryText.trim()) return null;

      // Add user message
      const userMsg = {
        role: "user",
        content: queryText.trim(),
        timestamp: Date.now()
      };
      chatHistory.push(userMsg);

      // Generate verified knowledge response
      const answer = window.ArthashalaData.aiKnowledge.generateAnswer(queryText, isHinglishMode);

      const assistantMsg = {
        role: "assistant",
        title: answer.title,
        citations: answer.citations,
        content: answer.text,
        simulatorAction: answer.simulatorAction,
        timestamp: Date.now()
      };
      chatHistory.push(assistantMsg);
      save();

      // Award XP for engaging with financial education
      if (window.ArthashalaServices.gamification) {
        window.ArthashalaServices.gamification.addXP(15, "Consulted Finance AI Tutor");
      }

      return assistantMsg;
    }
  };
})();
