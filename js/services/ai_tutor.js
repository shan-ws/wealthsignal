// =========================================================================================
// Wealth Signal Omni-Market Financial AI Tutor & Universal Intelligence Controller
// Conversational Engine, Multi-Market State Management & Verified Citations
// =========================================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
 const STORAGE_KEY_CHAT = "arthashala_ai_chat_history";
 const STORAGE_KEY_CAT = "arthashala_ai_selected_cat";

 const DEFAULT_WELCOME = {
 role: "assistant",
 title: "Namaste & Welcome to Wealth Signal Omni-Market Financial AI Tool",
 category: "all",
 citations: [
 "SEBI Master Circulars (Equities & F&O)",
 "RBI Monetary & Forex Guidelines",
 "CBOE Options Institute & OCC Standards",
 "US Treasury & Fabozzi Fixed Income Math",
 "BIS Triennial Central Bank Survey",
 "World Gold Council & MCX By-Laws",
 "Satoshi Nakamoto Bitcoin Whitepaper (2008)"
 ],
 content: `I am your verified **Omni-Market Financial AI Tool & Tutor**. I provide mathematically rigorous, regulatory-grounded guidance across all major asset classes:

- **Stock Market / Equities**: NSE/BSE fundamentals, Damodaran DCF, ASM/GSM surveillance, P/E vs PEG, corporate governance red flags.
- **Options & Derivatives**: The Greeks ($\\Delta, \\Gamma, \\Theta, \\nu$), Black-Scholes pricing, defined-risk spreads, SEBI 93% retail loss study.
- **Crypto & Digital Assets**: Bitcoin Halving cycles, Proof-of-Work vs Proof-of-Stake, on-chain MVRV-Z metrics, Indian 30% tax (Sec 115BBH) & 1% TDS.
- **Forex & Currencies**: Pips, lots, USD/INR mechanics, RBI forex intervention ($690B+ reserves), carry trades, FEMA 1999 boundaries.
- ️ **Commodities & Energy**: MCX Gold & Silver delivery, Contango vs Backwardation, Brent vs WTI crude, OPEC+ quotas, Doctor Copper.
- ️ **Bond Market & Fixed Income**: The inverse law of bond prices & yields, Macaulay duration, 10Y Indian G-Sec benchmark, inverted yield curve recession signals.
- **Macroeconomics & Capital Risk**: RBI Repo rate transmission, CPI vs WPI inflation, and the universal 1.5% position sizing formula.

Ask any question below, filter by asset class above, or click **"Verified Sources"** to inspect over 30+ official institutional registries!`,
 timestamp: Date.now() - 3600000 * 4,
 followUps: [
 "Explain P/E ratio vs PEG ratio with TCS vs Tata Motors",
 "Why do 93% retail traders lose money in options according to SEBI?",
 "How does an inverted yield curve predict economic recessions?",
 "Explain how Bitcoin halving affects miners and stock-to-flow"
 ]
 };

 let chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_CHAT)) || [DEFAULT_WELCOME];
 let isHinglishMode = false;
 let activeCategory = localStorage.getItem(STORAGE_KEY_CAT) || "all";

 function save() {
 try {
 localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatHistory));
 localStorage.setItem(STORAGE_KEY_CAT, activeCategory);
 } catch(e) {
 console.warn("Could not save AI tutor history to localStorage:", e);
 }
 }

 // Generate dynamic follow-up prompt suggestions based on domain/title
 function generateFollowUps(domain, query) {
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
 timestamp: Date.now()
 };
 chatHistory.push(userMsg);

 // Generate verified knowledge response via our Omni-Engine
 const knowledgeEngine = window.ArthashalaData.aiKnowledge;
 const answer = knowledgeEngine.generateAnswer(trimmed, isHinglishMode, activeCategory);

 const followUps = generateFollowUps(answer.category || "stocks", trimmed);

 const assistantMsg = {
 role: "assistant",
 title: answer.title,
 category: answer.category,
 citations: answer.citations,
 content: answer.text,
 simulatorAction: answer.simulatorAction,
 followUps: followUps,
 timestamp: Date.now()
 };

 chatHistory.push(assistantMsg);
 save();

 // Award XP for engaging with multi-market financial education
 if (window.ArthashalaServices.gamification) {
 window.ArthashalaServices.gamification.addXP(20, `Consulted AI on ${answer.category ? answer.category.toUpperCase() : 'Markets'}`);
 }

 return assistantMsg;
 }
 };
})();
