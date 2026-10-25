// ==========================================================================
// Wealth Signal Scam Awareness Academy
// Interactive Fraud Defense Simulator & Certified Cyber-Financial Shield
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const SCAM_CASES = [
    {
      id: "scam-01",
      title: "The WhatsApp / Telegram 'SEBI VIP Elite Calls' Group",
      type: "Pump & Dump / Impersonation Scam",
      riskLevel: "Critical Danger",
      mockMessage: `[TELEGRAM - 42,800 Members]
Admin 'Prof. Sharma (SEBI Registered RA)':
"URGENT BUY CALL: Buy 50,000 shares of XYZ Micro-Cap Tech TODAY at ₹14. Target ₹65 within 12 sessions!! 100% Guaranteed Operator Circuit! Foreign FII block deal confirmed! Do not tell anyone! Send screenshot after buying to unlock VIP Portfolio Club."`,
      redFlags: [
        "Promises '100% Guaranteed' returns in stock markets (explicitly illegal under SEBI regulations).",
        "Pushes an illiquid micro-cap penny stock to create artificial buyer volume for operators to dump their shares.",
        "Uses fake credentials or forged SEBI registration numbers.",
        "Operates via anonymous Telegram/WhatsApp groups where members cannot see each other."
      ],
      correctVerdict: "SCAM",
      aiAnalysis: "Classic micro-cap operator 'Pump and Dump'. Insiders buy pennies beforehand, use viral messaging channels to lure retail investors into hitting upper circuits, and dump their shares at the top, leaving retail holders stuck in perpetual lower circuits with zero liquidity to exit.",
      actionProtocol: "Never trade on social media tips. Verify any Research Analyst (RA) directly on the official SEBI directory at sebi.gov.in. File an immediate complaint on SCORES (scores.gov.in)."
    },
    {
      id: "scam-02",
      title: "The Fake 'Pre-IPO Institutional Allotment' App",
      type: "Advance Fee / Phishing Scam",
      riskLevel: "Extremely High",
      mockMessage: `[WHATSAPP MESSAGE]
"Exclusive Opportunity: Guaranteed allotment in upcoming Mega IPO (Swiggy / Hyundai India) under Foreign Institutional Investor (FII) Quota before public listing! No lottery! Transfer ₹2,50,000 to Account No: 91823XXXXX (IFSC: SBIN000XXXX, Name: Quick Wealth Management Services) to book 1,000 shares before retail cutoff."`,
      redFlags: [
        "Retail investors CANNOT legally access institutional FII quotas.",
        "IPO applications in India are strictly processed via ASBA (Application Supported by Blocked Amount) through your own bank account/UPI mandate.",
        "Money is requested via direct NEFT/IMPS transfer to a private third-party bank account rather than your verified Demat DP.",
        "Guaranteed allotment promise violates SEBI public issue book-building norms."
      ],
      correctVerdict: "SCAM",
      aiAnalysis: "Legitimate IPO subscriptions never require transferring money to a third party or private enterprise account. Under SEBI ASBA regulations, funds never leave your own bank account until actual share allotment occurs.",
      actionProtocol: "Immediately freeze account transfers. Call National Cyber Crime Helpline 1930 and report transaction to your bank fraud division."
    },
    {
      id: "scam-03",
      title: "The 'Guaranteed 2.5% Daily' Crypto AI Bot",
      type: "Multi-Level Marketing (MLM) Ponzi Scheme",
      riskLevel: "Extreme Risk",
      mockMessage: `[INSTAGRAM REEL / AD]
"Quit your 9-to-5! Our Quantum AI High-Frequency Trading Bot generates 2.5% daily profit compounding 7 days a week from Bitcoin and Forex arbitrage. Minimum deposit: $500 (USDT). Earn 15% referral bonus for every friend you introduce!"`,
      redFlags: [
        "A 2.5% daily compounding return turns ₹1,00,000 into ₹78 Crores in just one single year (mathematically impossible).",
        "Heavy emphasis on referral commissions and recruiting tiers (classic MLM pyramid signature).",
        "Requires deposits in anonymous cryptocurrency stablecoins (USDT TRC-20) with no regulatory jurisdiction or investor redressal."
      ],
      correctVerdict: "SCAM",
      aiAnalysis: "Textbook Ponzi scheme. Early depositors are paid 'returns' using funds from newly recruited victims. As soon as recruitment slows or investors attempt large withdrawals, the website vanishes overnight.",
      actionProtocol: "Report the Instagram/YouTube account. Never transfer crypto to unverified offshore cloud platforms."
    },
    {
      id: "scam-04",
      title: "The 'Digital Arrest' Extortion Call",
      type: "Cyber Impersonation Extortion",
      riskLevel: "Emergency Danger",
      mockMessage: `[INCOMING CALL FROM UNKNOWN NUMBER]
Caller claiming to be 'DCP Crime Branch, Mumbai':
"A DHL parcel sent in your name to Taiwan containing 14 fake passports and illegal contraband was intercepted. Your Aadhaar is linked to a money laundering case. A Supreme Court warrant is issued. Stay on this Skype video call for 24 hours under 'Digital Arrest' and transfer your bank balance to the Reserve Bank of India verification escrow account for clearance."`,
      redFlags: [
        "There is NO legal concept of 'Digital Arrest' in the Indian Penal Code or Criminal Procedure Code (CrPC).",
        "Law enforcement officers, CBI, ED, and judges NEVER conduct trials over Skype or WhatsApp video.",
        "Government agencies NEVER ask citizens to transfer funds to any 'verification account' or 'RBI safe account'."
      ],
      correctVerdict: "SCAM",
      aiAnalysis: "Coercive psychological manipulation designed to induce panic, isolate the victim, and prevent them from consulting family or banks while extorting life savings.",
      actionProtocol: "Disconnect immediately. Do not panic. Dial 1930 or lodge a report at cybercrime.gov.in."
    }
  ];

  const ScamAcademy = {
    getCases() {
      return SCAM_CASES;
    },
    getCaseById(id) {
      return SCAM_CASES.find(c => c.id === id) || SCAM_CASES[0];
    }
  };

  window.ArthashalaServices.scamAcademy = ScamAcademy;
})();
