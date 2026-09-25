# Wealth Signal | Financial Education & Market Simulation Platform

<div align="center">
  <img src="assets/logo.jpg" alt="Wealth Signal Logo" width="120" style="border-radius: 12px; margin-bottom: 16px;" />
  <p><em>“Don’t just follow the market. Learn how it works.”</em></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Platform](https://img.shields.io/badge/Platform-Web-emerald.svg)](https://shan-ws.github.io/wealthsignal/)
  [![Demo Capital](https://img.shields.io/badge/Virtual%20Capital-₹10%2C00%2C000-brightgreen.svg)]()
  [![Compliance](https://img.shields.io/badge/Notice-SEBI%20%2F%20RBI%20Educational-orange.svg)]()

  ### 🌐 **[Live Demo — Open Platform](https://shan-ws.github.io/wealthsignal/)**
</div>

---

## 📌 About Wealth Signal

**Wealth Signal** (Arthashala) is India's premier dark-mode financial education and real-time market simulation platform. It equips Indian retail investors, students, and aspiring traders with quantitative risk management, technical charting patterns, and fundamental analysis skills using **₹10,00,000 in risk-free virtual demo capital** before risking real money in the markets.

---

## ✨ Key Features

### 1. 📈 Virtual Trading Simulator
- **₹10,00,000 Demo Money:** Practice trading NSE/BSE equities, derivatives, and commodities without financial risk.
- **Order Types:** Execute Market Orders, Limit Orders, and configure Stop-Loss (SL) & Target (TP) brackets.
- **Product Types:** Support for Intraday (MIS) with automatic square-off tracking and Delivery (CNC).

### 2. 📊 TradingView Interactive Charting
- Integrated official TradingView technical charts (`tv.js`).
- Complete technical analysis suite: Candlesticks, Heikin Ashi, Volume, RSI, MACD, Bollinger Bands, and custom indicators.

### 3. 💼 Comprehensive Portfolio Analytics
- Real-time P&L (Unrealized & Realized), capital utilization, and margin meters.
- Quantitative metrics: **Sharpe Ratio**, Win/Loss ratio, maximum drawdown, and sector distribution.

### 4. 🤖 Finance AI Tutor
- Context-aware financial assistant answering queries about Indian markets, corporate actions, and taxation (STCG/LTCG).
- Directly references and cites official regulatory frameworks from **SEBI** and **RBI**.

### 5. 📓 Psychological Trading Journal
- Record emotional state (Confident, FOMO, Revenge Trading, Disciplined) for every executed order.
- Track post-trade reviews, error analysis, and adherence to trading rules.

### 6. 🧪 Algorithmic Backtester
- Test and optimize popular trading strategies (e.g., EMA Crossovers, Supertrend, Breakout) against historical Indian stock data.
- Generates detailed trade logs, equity curves, and performance summaries.

### 7. 🎓 6 Structured Academy Tracks
- Curated educational paths ranging from **Stock Market Fundamentals**, **Technical Analysis**, **F&O Derivatives**, to **Risk & Money Management**.
- Interactive quizzes and milestone certifications.

### 8. 🛡️ Quantitative Risk & Position Sizing Tools
- 1% Risk Rule Calculator, Options Breakeven & Greeks visualizer, and Margin requirements estimator.

### 9. 🎮 Gamification & Community
- Daily login streaks, XP rewards, level progression, and trading achievement badges.

### 10. 🔐 Cloud Sync with Firebase
- User authentication (Google Sign-In & Email/Password) powered by Firebase Auth.
- Real-time cloud persistence for trades, portfolio balance, and journal notes via Firebase Firestore.

---

## 🛠️ Tech Stack

- **Frontend Core:** Semantic HTML5, Modular Modern JavaScript (ES6+)
- **Styling:** Custom Vanilla CSS (Design system with custom properties, glassmorphism, responsive grid layouts)
- **Charts & Feeds:** TradingView Widget Library (`tv.js`) & simulated real-time market data feed
- **Backend & Persistence:** Google Firebase Auth & Cloud Firestore
- **Local Dev Server:** Built-in Perl HTTP Server (`server.pl`) or any static web server

---

## 📁 Repository Structure

```text
wealthsignal/
├── assets/                  # Logos, icons, and illustrations
│   └── logo.jpg
├── css/                     # Design system & styles
│   ├── components.css       # Modals, charts, buttons, badges
│   └── style.css            # Base styles, variables, typography, layout
├── js/                      # Modular application architecture
│   ├── app.js               # Main application router and view controller
│   ├── components/          # Reusable UI components (TradingView, Auth, Checkout)
│   ├── data/                # Market instruments, academy tracks, AI knowledge base
│   └── services/            # Simulator engine, Portfolio, Journal, Auth, Backtester
├── index.html               # Main single-page application entry point
├── server.pl                # Lightweight local development server script
└── README.md                # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

No heavy build steps or `node_modules` required!

### 1. Clone the repository
```bash
git clone https://github.com/shan-ws/wealthsignal.git
cd wealthsignal
```

### 2. Run locally
You can use any static server of your choice:

**Using Python:**
```bash
python3 -m http.server 8080
```

**Using the included Perl server:**
```bash
perl server.pl
```

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

### 3. Open in Browser
Navigate to `http://localhost:8080` in your web browser.

---

## 🌐 Deploying to GitHub Pages

1. Navigate to **Settings** → **Pages** in this repository.
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Click **Save**. Your site will be deployed at `https://<username>.github.io/wealthsignal/`.

---

## ⚖️ Regulatory Disclaimer

> **SEBI / RBI EDUCATIONAL NOTICE**  
> Wealth Signal is strictly an educational and simulated paper-trading platform. It does not provide personalized investment advice, guaranteed returns, stock tips, or execute real-money transactions in Indian or global securities markets. Simulated demo profits do not represent or guarantee real-world trading performance. For official guidelines and circulars, visit [SEBI](https://www.sebi.gov.in) and [RBI](https://www.rbi.org.in).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
