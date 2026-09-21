// Arthashala Academy - 6 Structured Educational Tracks with Modules, Lessons & Quizzes
window.ArthashalaData = window.ArthashalaData || {};

window.ArthashalaData.academyTracks = [
  {
    id: "track-1",
    title: "Indian Financial Ecosystem & Market Structure",
    category: "Foundation",
    duration: "4 Hours",
    level: "Beginner",
    icon: "🏛️",
    description: "Understand the regulatory architecture of SEBI, the mechanics of NSE & BSE exchanges, Depositories (NSDL/CDSL), and order execution lifecycle.",
    modules: [
      {
        id: "mod-1-1",
        title: "Market Regulators & Primary vs Secondary Markets",
        xp: 50,
        completed: true,
        content: `
### The Indian Financial Architecture
The Indian capital market is regulated primarily by the **Securities and Exchange Board of India (SEBI)**, established under the SEBI Act, 1992. SEBI's tripartite mandate includes protecting investor interests, promoting market development, and regulating intermediaries.

#### Key Market Participants:
1. **Regulators**: SEBI (Securities), Reserve Bank of India / RBI (Monetary & Banking), IRDAI (Insurance), PFRDA (Pensions).
2. **Exchanges**:
   - **NSE (National Stock Exchange)**: Founded in 1992, pioneer in electronic screen-based trading, operates NIFTY indices.
   - **BSE (Bombay Stock Exchange)**: Asia's oldest stock exchange (est. 1875), operates the 30-stock SENSEX.
3. **Depositories**: **NSDL** and **CDSL** maintain securities in electronic dematerialized (Demat) form, eliminating counterparty bad delivery risks.
4. **Clearing Corporations**: NSCCL and ICCL guarantee settlement of trades through the T+1 settlement cycle (and evolving instant T+0 optional cycle).

> **Regulatory Rule (SEBI Circular 2023)**: Client funds must be segregated strictly; brokers cannot pledge client shares or utilize client unencumbered funds for proprietary activities.
        `,
        quiz: {
          question: "What is the primary role of Depositories (NSDL & CDSL) in Indian stock markets?",
          options: [
            "To determine daily stock opening and closing prices",
            "To hold securities in electronic (demat) format and facilitate seamless transfers",
            "To lend money directly to retail investors for day trading",
            "To guarantee guaranteed annual returns on bluechip stocks"
          ],
          correct: 1,
          explanation: "NSDL and CDSL act as electronic bank vaults for your shares, bonds, and mutual fund units, eliminating physical certificates and risk of theft or forgery."
        }
      },
      {
        id: "mod-1-2",
        title: "Order Types: Market, Limit, Stop-Loss & MIS vs CNC",
        xp: 75,
        completed: false,
        content: `
### Execution Mechanics in Indian Brokerages

When submitting an order through an Indian stockbroker (Zerodha, Groww, AngelOne, Upstox), you specify product and execution parameters:

#### Product Types:
- **CNC (Cash and Carry)**: Delivery trades. 100% upfront capital required. Shares are credited to your Demat account on T+1 day.
- **MIS (Margin Intraday Square-off)**: Intraday speculation. Brokers provide leverage (up to 5x under SEBI peak margin rules). Positions are automatically squared off at 3:15 PM - 3:20 PM IST.

#### Order Execution Types:
1. **Market Order**: Executes immediately at the best available ask (if buying) or bid (if selling). Carries slippage risk in volatile or illiquid counters.
2. **Limit Order**: Specifies the maximum price you are willing to pay, or minimum price you accept. Only executes at your price or better.
3. **Stop-Loss Limit (SL-L)**: Triggers when market crosses trigger price, placing a limit order. Protects downside.
4. **Stop-Loss Market (SL-M)**: Triggers at threshold and executes at whatever market price prevails.
        `,
        quiz: {
          question: "If you purchase shares under the MIS product code on NSE and do not close the position by 3:15 PM, what happens?",
          options: [
            "The shares are automatically transferred to your Demat account for free",
            "Your broker's RMS (Risk Management System) automatically squares off the position at market price",
            "SEBI freezes your trading account for 30 days",
            "The position automatically doubles into a delivery contract"
          ],
          correct: 1,
          explanation: "MIS is strictly an intraday product. Automated RMS systems square off all open intraday positions before market close (3:15 PM - 3:20 PM) to adhere to SEBI margin limits."
        }
      }
    ]
  },
  {
    id: "track-2",
    title: "Technical Analysis & Price Action Masterclass",
    category: "Analysis",
    duration: "6 Hours",
    level: "Intermediate",
    icon: "📈",
    description: "Master candlestick anatomy, multi-timeframe Support & Resistance, Exponential Moving Averages (EMA), RSI divergence, and chart pattern breakouts.",
    modules: [
      {
        id: "mod-2-1",
        title: "Japanese Candlestick Anatomy & Key Reversal Formations",
        xp: 60,
        completed: false,
        content: `
### The Language of the Price Chart
A candlestick captures the psychological struggle between bulls and bears over a discrete timeframe (1m, 5m, 15m, Daily).

#### Anatomy:
- **Body**: The distance between Open and Close. Green/Cyan signifies buyers dominated; Red indicates sellers ruled.
- **Upper Wick / Shadow**: Bullish rejection from higher prices (sellers pushed price back down).
- **Lower Wick / Shadow**: Bearish rejection from lower prices (buyers absorbed selling pressure).

#### High-Probability Reversals:
1. **Hammer / Pin Bar**: Small body at the top, long lower wick (>2x body length). Found at the end of a downtrend, signaling strong demand absorption.
2. **Bullish Engulfing**: A green candle completely encloses the body of the previous red candle, signaling an aggressive shift in control.
3. **Doji**: Open and close are virtually identical. Reflects indecision; when occurring at major support or resistance, often precedes a trend reversal.
        `,
        quiz: {
          question: "A daily candle with a tiny body at the top and a lower wick that is three times the body size forms at a key 200 EMA support. What does this suggest?",
          options: [
            "Extreme selling pressure with guaranteed further collapse",
            "A Hammer pattern indicating buyer absorption and a potential bullish reversal",
            "Market manipulation by institutional operators requiring an immediate short",
            "No information can be derived from candlestick shadows"
          ],
          correct: 1,
          explanation: "The long lower wick demonstrates that sellers tried to push prices lower, but institutional buyers stepped in forcefully to push the price all the way back up."
        }
      },
      {
        id: "mod-2-2",
        title: "Momentum Indicators: RSI Divergence & Moving Averages",
        xp: 80,
        completed: false,
        content: `
### Quantifying Momentum & Trend Direction

#### Relative Strength Index (RSI - 14 Period):
- Measures the speed and change of price movements on a scale of 0 to 100.
- **Overbought (>70)**: Does NOT mean immediate short; in strong bull trends, RSI can stay overbought for weeks.
- **Oversold (<30)**: Indicates exhaustion of aggressive selling.
- **Bullish Divergence**: Price makes a **Lower Low**, but RSI makes a **Higher Low**. This reveals that underlying selling momentum is decaying, setting up a sharp mean reversion.

#### Trend Filters (9 EMA & 21 EMA):
- The 9-period Exponential Moving Average gives high weight to recent ticks.
- The 21-period EMA represents intermediate trend momentum.
- A **Golden Cross** (9 EMA crossing above 21 EMA) with expansion in volume serves as a high-probability trend continuation signal.
        `,
        quiz: {
          question: "When price forms a Lower Low on the chart but the RSI indicator forms a Higher Low, what technical phenomenon is taking place?",
          options: [
            "Bearish Continuation",
            "Bullish Divergence",
            "Dead Cat Bounce Confirmation",
            "Overnight Gap Risk"
          ],
          correct: 1,
          explanation: "Bullish divergence occurs when downward price momentum weakens despite price breaking lower, frequently heralding an upward reversal."
        }
      }
    ]
  },
  {
    id: "track-3",
    title: "Fundamental Analysis & Valuation of Indian Equities",
    category: "Investing",
    duration: "5 Hours",
    level: "Intermediate",
    icon: "📑",
    description: "Learn to deconstruct corporate Balance Sheets, Profit & Loss statements, Cash Flow from Operations, ROCE, ROE, and intrinsic DCF valuation.",
    modules: [
      {
        id: "mod-3-1",
        title: "Deconstructing P&L, Balance Sheet & Cash Flow",
        xp: 70,
        completed: false,
        content: `
### Reading Indian Annual Reports (BSE/NSE Filings)

A company's financial statements provide the audit trail of its economic engine:

1. **Profit & Loss (P&L)**:
   - **Revenue / Topline**: Net sales generated.
   - **EBITDA Margin**: Operating profitability before financing decisions and tax.
   - **PAT (Profit After Tax)**: Bottomline earnings belonging to equity shareholders.

2. **The Balance Sheet**:
   - **Assets = Liabilities + Shareholder Equity**.
   - Check **Debt-to-Equity**: High debt in cyclical industries (e.g. Real Estate, Infra) increases bankruptcy risk during rising interest rates.

3. **Cash Flow Statement (The Ultimate Truth Test)**:
   - **Cash Flow from Operations (CFO)** must closely track or exceed PAT.
   - If PAT is high but CFO is negative for consecutive years, the company may be recognizing aggressive uncollected revenue (bloated Trade Receivables).
        `,
        quiz: {
          question: "If an Indian manufacturing company reports ₹500 Cr in Profit After Tax (PAT) but has negative ₹80 Cr in Cash Flow from Operations (CFO), what should an analyst investigate?",
          options: [
            "Whether the company is giving away free products to charity",
            "Whether profits are trapped in uncollected receivables or unsold inventory rather than liquid cash",
            "Whether SEBI has forced the company to transfer money to the RBI",
            "There is no difference between PAT and CFO in accounting"
          ],
          correct: 1,
          explanation: "Accrual accounting can show accounting profit without actual cash entering the bank. If CFO is persistently lower than PAT, earnings quality is questionable."
        }
      },
      {
        id: "mod-3-2",
        title: "Key Ratios: P/E, ROCE, ROE & Debt-to-Equity",
        xp: 85,
        completed: false,
        content: `
### Valuing Indian Companies

- **Price-to-Earnings (P/E)**: Market Price ÷ Earnings Per Share (EPS). Compare against historical median and industry peers (e.g. IT sector P/E vs Banking P/E).
- **ROCE (Return on Capital Employed)**: EBIT ÷ (Total Assets - Current Liabilities). Measures how efficiently total capital (debt + equity) generates operating profits. Companies with ROCE > 20% over 10 years possess enduring economic moats.
- **ROE (Return on Equity)**: Net Profit ÷ Shareholder Equity. Caution: High debt artificially boosts ROE; always cross-verify DuPont analysis.
        `,
        quiz: {
          question: "Why is ROCE generally considered a cleaner measure of capital efficiency than ROE for capital-intensive companies?",
          options: [
            "Because ROCE ignores taxes completely",
            "Because ROCE evaluates returns generated by both equity and debt capital, avoiding artificial inflation through leverage",
            "Because ROCE is mandated by RBI while ROE is not",
            "Because ROCE is only calculated in US Dollars"
          ],
          correct: 1,
          explanation: "A heavily indebted company can boast an artificially high ROE simply because its equity base is small, whereas ROCE measures operating returns against all capital employed."
        }
      }
    ]
  },
  {
    id: "track-4",
    title: "Derivatives & F&O Risk Management",
    category: "Derivatives",
    duration: "7 Hours",
    level: "Advanced",
    icon: "⚡",
    description: "Understand Nifty & Bank Nifty Futures, Call/Put Options, Option Chain Open Interest (OI), Option Greeks (Delta, Theta, Gamma), and SEBI risk statistics.",
    modules: [
      {
        id: "mod-4-1",
        title: "Futures & Options Mechanics & SEBI Risk Realities",
        xp: 90,
        completed: false,
        content: `
### Understanding Derivatives on NSE

> **Critical SEBI Study Notice (2023 & 2024)**: SEBI published empirical data showing that **93% of individual F&O retail traders incurred net losses**, with average loss exceeding ₹1.25 Lakhs per trader. Derivatives are zero-sum hedging instruments, NOT get-rich-quick lottery tickets.

#### What is a Derivative?
A contract that derives its value from an underlying asset (e.g. NIFTY 50 index).

#### Call Option (CE):
- Gives the buyer the right, but NOT the obligation, to BUY the underlying at Strike Price before expiry.
- Buyer pays Premium (maximum loss is premium paid).

#### Put Option (PE):
- Gives the buyer the right to SELL the underlying at Strike Price.
- Used for hedging portfolios against market crashes.
        `,
        quiz: {
          question: "According to empirical research published by SEBI, approximately what percentage of individual retail traders lose money in the Indian Equity F&O segment?",
          options: [
            "Approximately 10%",
            "Approximately 50%",
            "Over 90% (around 93%)",
            "Zero percent, because derivatives guarantee fixed returns"
          ],
          correct: 2,
          explanation: "SEBI's landmark study revealed that ~93% of retail derivative traders lose money, largely due to lack of risk management, paying excessive transaction costs, and naked out-of-the-money option buying."
        }
      },
      {
        id: "mod-4-2",
        title: "Option Greeks: Theta Decay & The Hidden Cost of Time",
        xp: 100,
        completed: false,
        content: `
### The 4 Greeks Every Trader Must Know

1. **Delta**: The rate of change of option premium per ₹1 move in the underlying. ATM options have a Delta of ~0.50.
2. **Theta (Time Decay)**: Options are wasting assets. Every passing day erodes option premium, accelerating drastically during expiry week.
   - Option buyers fight Theta decay every minute.
   - Option sellers (writers) collect Theta as income, but take on tail-risk if unhedged.
3. **Vega**: Sensitivity of premium to changes in Implied Volatility (India VIX).
4. **Gamma**: The acceleration of Delta. Explains explosive moves in zero-to-hero expiry options.
        `,
        quiz: {
          question: "If you purchase an Out-Of-The-Money (OTM) Call option on NIFTY and the market remains completely flat for 4 consecutive days, what happens to your option premium?",
          options: [
            "It increases because the exchange pays you holding interest",
            "It decays and loses value due to Theta (time decay)",
            "It stays exactly unchanged down to the rupee",
            "It converts automatically into an In-The-Money option"
          ],
          correct: 1,
          explanation: "Theta decay continuously reduces an option's extrinsic time value as expiration approaches, even if the underlying index does not move."
        }
      }
    ]
  },
  {
    id: "track-5",
    title: "Macroeconomics, RBI Policy & Global Markets",
    category: "Macro",
    duration: "4 Hours",
    level: "Intermediate",
    icon: "🌐",
    description: "Explore how the Reserve Bank of India's Monetary Policy Committee (MPC), Repo Rate, CPI Inflation, and US 10-Year Yields drive Indian stock cycles.",
    modules: [
      {
        id: "mod-5-1",
        title: "RBI Monetary Policy, Repo Rate & Banking Liquidity",
        xp: 75,
        completed: false,
        content: `
### How the Reserve Bank of India (RBI) Steers the Economy

The Monetary Policy Committee (MPC) meets bi-monthly to fix the policy **Repo Rate** (the interest rate at which RBI lends short-term funds to commercial banks).

#### The Transmission Mechanism:
1. **Repo Rate Hike**:
   - Aim: Curb high CPI inflation by draining liquidity.
   - Impact: Banks raise lending rates (MCLR / Repo-linked loan rates). Borrowing costs increase for corporates and home buyers.
   - Market Impact: Equity valuations contract as the discount rate rises; high-PE growth stocks often face price corrections.
2. **Repo Rate Cut**:
   - Aim: Stimulate economic growth during slowdowns.
   - Impact: Cheap credit spurs corporate capex and consumer spending. Bullish catalyst for Bank Nifty and auto sectors.
        `,
        quiz: {
          question: "When the RBI unexpectedly hikes the Repo Rate by 50 basis points, what is the immediate expected effect on commercial bank loan interest rates?",
          options: [
            "Loan interest rates drop to zero percent",
            "Commercial banks raise their lending rates, increasing borrowing costs for businesses and home loans",
            "Banks are required to dissolve all deposit accounts",
            "The Indian Rupee is immediately devalued by 50%"
          ],
          correct: 1,
          explanation: "Higher borrowing costs from the central bank are passed on to end borrowers via higher interest rates on floating home loans, auto loans, and corporate credit."
        }
      }
    ]
  },
  {
    id: "track-6",
    title: "Commodities (MCX) & Currency Dynamics",
    category: "Commodities",
    duration: "3.5 Hours",
    level: "Beginner",
    icon: "🪙",
    description: "Learn how MCX Gold & Crude Oil respond to geopolitical tensions, supply shocks, OPEC decisions, and USD/INR foreign exchange swings.",
    modules: [
      {
        id: "mod-6-1",
        title: "MCX Gold & Crude Oil: Drivers of Inflation & Hedging",
        xp: 65,
        completed: false,
        content: `
### Multi Commodity Exchange of India (MCX)

India is one of the world's largest consumers and importers of both **Gold** and **Crude Oil**.

#### Gold (Precious Metals):
- Acts as a safe haven during geopolitical uncertainty, currency debasement, and wars.
- Priced in INR per 10 grams on MCX, influenced by international spot price (XAU/USD) multiplied by the USD/INR currency exchange rate + import customs duty.

#### Crude Oil (Energy):
- India imports >85% of its crude oil requirements.
- When Brent Crude surpasses $90-$100/barrel:
  - India's Current Account Deficit (CAD) widens.
  - Domestic fuel inflation increases, pressurizing the Indian Rupee (INR).
  - Paints, tyres, and aviation sectors suffer margin compression.
        `,
        quiz: {
          question: "Why does a sharp rise in international crude oil prices typically exert downward pressure on the Indian Rupee (USD/INR depreciation)?",
          options: [
            "Because crude oil is produced inside India and exported for free",
            "Because India must spend more US Dollars to import oil, creating heavy demand for USD and selling pressure on INR",
            "Because the RBI bans the trade of all currencies during oil spikes",
            "Because gold prices automatically become zero"
          ],
          correct: 1,
          explanation: "As an oil-importing country, higher oil prices require Indian oil marketing companies (OMCs) to buy billions more US dollars in the FX market, driving dollar demand up and weakening the Rupee."
        }
      }
    ]
  }
];
