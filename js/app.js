// Arthashala Main Application Controller & Single Page Application Router
window.ArthashalaApp = window.ArthashalaApp || {};

(function() {
  let activeRoute = "home";
  let activeChartInstance = null;
  let activeSimulatorSymbol = "NIFTY 50";
  let activeOrderProduct = "MIS";
  let activeOrderSide = "BUY";
  let activeOrderType = "MARKET";
  let activeMarketsChartSymbol = "NIFTY 50";
  let marketsTvChartInstance = null;
  let simChartMode = "TRADINGVIEW"; // "TRADINGVIEW" or "CANVAS"
  let simTvChartInstance = null;

  // Toast notification helper
  function showToast(message, icon = "⚡") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "arthashala-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Format currency in Indian numbering system
  function formatINR(amount, decimals = 2) {
    if (isNaN(amount)) return "₹0.00";
    const isNegative = amount < 0;
    const absVal = Math.abs(amount);
    const formatted = absVal.toLocaleString("en-IN", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    });
    return `${isNegative ? '-' : ''}₹${formatted}`;
  }

  // --- Router Navigation ---
  function navigate(route) {
    activeRoute = route;
    
    // Update navigation link states
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.route === route) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Toggle view elements
    document.querySelectorAll(".route-view").forEach(view => {
      if (view.id === `view-${route}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // View-specific initializers
    if (route === "home") renderHomeView();
    else if (route === "markets") renderMarketsView();
    else if (route === "simulator") renderSimulatorView();
    else if (route === "portfolio") renderPortfolioView();
    else if (route === "journal") renderJournalView();
    else if (route === "backtesting") renderBacktestingView();
    else if (route === "education") renderEducationView();
    else if (route === "finance-ai") renderFinanceAIView();
    else if (route === "risk-tools") renderRiskToolsView();
    else if (route === "pricing") renderPricingView();
    else if (route === "profile") renderProfileView();
    else if (route === "admin") renderAdminView();
    else if (route === "auth" || route === "login") renderAuthView();
  }

  function renderAuthView() {
    if (window.ArthashalaComponents.auth) {
      window.ArthashalaComponents.auth.renderAuthView("view-auth");
    }
  }

  function renderHeaderAuth() {
    const authContainer = document.getElementById("header-auth-container");
    const navLinkAuth = document.getElementById("nav-link-auth");
    if (!authContainer || !window.ArthashalaServices.auth) return;

    const user = window.ArthashalaServices.auth.getUser();

    if (user) {
      if (navLinkAuth) navLinkAuth.innerText = "Account";
      const providerIcon = user.provider === "google" ? "🌐 Google" : (user.provider === "phone" ? "📱 Phone OTP" : "✉️ Email");
      authContainer.innerHTML = `
        <div class="nav-user-chip" id="nav-user-chip-btn" onclick="window.ArthashalaApp.toggleUserMenu(event)">
          <img src="${user.avatar || 'assets/logo.jpg'}" alt="${user.name}" class="nav-user-avatar" />
          <span class="nav-user-name">${user.name.split(" ")[0]}</span>
          <span class="nav-user-chevron">▼</span>
        </div>
        <div class="user-profile-menu" id="nav-user-dropdown-menu">
          <div class="menu-user-header">
            <div class="menu-user-name">${user.name}</div>
            <div class="menu-user-sub">${user.email || user.phone}</div>
            <div class="menu-provider-badge">✓ ${providerIcon}</div>
          </div>
          <div class="menu-items-group">
            <a class="menu-item-link" onclick="window.ArthashalaApp.navigate('profile')">
              <span>👤</span> My Profile & Badges
            </a>
            <a class="menu-item-link" onclick="window.ArthashalaApp.navigate('portfolio')">
              <span>💼</span> Portfolio Analytics
            </a>
            <a class="menu-item-link" onclick="window.ArthashalaApp.navigate('journal')">
              <span>📝</span> Trading Journal
            </a>
            <a class="menu-item-link" onclick="window.ArthashalaComponents.checkout.openModal('1Y')">
              <span>⭐</span> Upgrade to Pro
            </a>
            <a class="menu-item-link danger" onclick="window.ArthashalaApp.handleLogout()">
              <span>🚪</span> Sign Out
            </a>
          </div>
        </div>
      `;
    } else {
      if (navLinkAuth) navLinkAuth.innerText = "Sign In";
      authContainer.innerHTML = `
        <button class="nav-signin-btn" onclick="window.ArthashalaComponents.auth.openModal('phone', 'signin')">
          <span>🔑</span> Sign In
        </button>
      `;
    }
  }

  // Update top bar summary (balance, streak, XP & Auth)
  function updateGlobalHeader() {
    const simSummary = window.ArthashalaServices.simulator.getPortfolioSummary();
    const streak = window.ArthashalaServices.gamification.getStreak();
    const xp = window.ArthashalaServices.gamification.getXP();
    const tier = window.ArthashalaServices.gamification.getCurrentTier();
    const sub = window.ArthashalaComponents.checkout.getSubscription();

    const balanceEl = document.getElementById("header-virtual-balance");
    if (balanceEl) balanceEl.innerText = formatINR(simSummary.netWorth, 0);

    const streakEl = document.getElementById("header-streak-val");
    if (streakEl) streakEl.innerText = `${streak}d 🔥`;

    const xpEl = document.getElementById("header-xp-val");
    if (xpEl) xpEl.innerText = `${xp} XP`;

    const proBadge = document.getElementById("header-pro-badge");
    if (proBadge) {
      if (sub.isPro) {
        proBadge.style.display = "inline-flex";
        proBadge.innerText = "PRO ACTIVE";
      } else {
        proBadge.style.display = "none";
      }
    }

    renderHeaderAuth();
  }

  // Populate scrolling ticker tape
  function initTickerTape() {
    const tapeTrack = document.getElementById("market-ticker-track");
    if (!tapeTrack) return;

    const markets = window.ArthashalaData.markets;
    const tickerItems = [...markets, ...markets]; // Duplicate for seamless infinite loop

    tapeTrack.innerHTML = tickerItems.map((m, idx) => {
      const changeVal = m.price - m.prevClose;
      const changePct = (changeVal / m.prevClose) * 100;
      const isUp = changeVal >= 0;
      return `
        <div class="ticker-item" onclick="window.ArthashalaApp.openInSimulator('${m.symbol}')" id="ticker-item-${idx}">
          <span class="ticker-symbol">${m.symbol}</span>
          <span class="ticker-price">${formatINR(m.price)}</span>
          <span class="ticker-change ${isUp ? 'up' : 'down'}">
            ${isUp ? '▲' : '▼'} ${Math.abs(changePct).toFixed(2)}%
          </span>
        </div>
      `;
    }).join('');
  }

  // 1. HOME VIEW
  function renderHomeView() {
    const container = document.getElementById("view-home");
    if (!container) return;

    const summary = window.ArthashalaServices.simulator.getPortfolioSummary();
    const tier = window.ArthashalaServices.gamification.getCurrentTier();
    const streak = window.ArthashalaServices.gamification.getStreak();
    const markets = window.ArthashalaData.markets;

    // Top movers
    const movers = [...markets].sort((a, b) => {
      const pcta = ((a.price - a.prevClose) / a.prevClose);
      const pctb = ((b.price - b.prevClose) / b.prevClose);
      return pctb - pcta;
    });
    const topGainers = movers.slice(0, 4);
    const topLosers = [...movers].reverse().slice(0, 4);

    container.innerHTML = `
      <!-- Hero Banner -->
      <div class="hero-tagline-box">
        <div class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 4px; display: inline-block; font-size: 11px; font-weight: 700; margin-bottom: 12px;">
          INDIA'S PREMIER VIRTUAL MARKET ACADEMY
        </div>
        <h1 class="hero-tagline-title">
          Don’t just follow the market.<br />
          <span class="hero-tagline-highlight">Learn how it works.</span>
        </h1>
        <p class="hero-tagline-desc">
          Master Indian equities, F&O derivatives, commodities, and macroeconomics. Practice with ₹10,00,000 in virtual capital with zero financial risk. Anchored in SEBI and RBI investor education standards.
        </p>

        <!-- Core Loop -->
        <div class="core-loop-flow">
          <div class="loop-step" onclick="window.ArthashalaApp.navigate('education')"><span class="loop-step-icon">📚</span> 1. LEARN</div>
          <span class="loop-arrow">➔</span>
          <div class="loop-step" onclick="window.ArthashalaApp.navigate('simulator')"><span class="loop-step-icon">📊</span> 2. SIMULATE</div>
          <span class="loop-arrow">➔</span>
          <div class="loop-step" onclick="window.ArthashalaApp.navigate('portfolio')"><span class="loop-step-icon">💼</span> 3. ANALYSE</div>
          <span class="loop-arrow">➔</span>
          <div class="loop-step" onclick="window.ArthashalaApp.navigate('journal')"><span class="loop-step-icon">📝</span> 4. TRACK</div>
          <span class="loop-arrow">➔</span>
          <div class="loop-step" onclick="window.ArthashalaApp.navigate('profile')"><span class="loop-step-icon">🏆</span> 5. IMPROVE</div>
        </div>
      </div>

      <!-- User Key Performance Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="card">
          <div class="card-subtitle">Virtual Net Worth</div>
          <div style="font-size: 24px; font-weight: 800; font-family: var(--font-mono); margin: 6px 0; color: #ffffff;">
            ${formatINR(summary.netWorth)}
          </div>
          <div style="font-size: 12px; font-weight: 600;" class="${summary.totalGain >= 0 ? 'text-emerald' : 'text-rose'}">
            ${summary.totalGain >= 0 ? '▲' : '▼'} ${formatINR(summary.totalGain)} (${summary.totalReturnPct.toFixed(2)}% ROI)
          </div>
        </div>

        <div class="card">
          <div class="card-subtitle">Trader Progression Tier</div>
          <div style="font-size: 20px; font-weight: 800; margin: 6px 0; color: ${tier.color}; display: flex; align-items: center; gap: 8px;">
            <span>Level ${tier.level}</span> • <span>${tier.name}</span>
          </div>
          <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; margin-top: 8px;">
            <div style="width: ${tier.progressPct}%; height: 100%; background: ${tier.color};"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 4px;">
            <span>${tier.progressPct}% to ${tier.nextTier}</span>
            <span>${tier.xpToNext} XP needed</span>
          </div>
        </div>

        <div class="card">
          <div class="card-subtitle">Active Learning Streak</div>
          <div style="font-size: 24px; font-weight: 800; margin: 6px 0; color: var(--amber); display: flex; align-items: center; gap: 8px;">
            <span>${streak} Days</span> <span>🔥</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            Maintain 7 days to unlock the "7-Day Streak Master" badge (+100 XP).
          </div>
        </div>

        <div class="card">
          <div class="card-subtitle">Simulated Win Rate</div>
          <div style="font-size: 24px; font-weight: 800; font-family: var(--font-mono); margin: 6px 0; color: var(--cyan);">
            68.4%
          </div>
          <div style="font-size: 12px; color: var(--text-muted);">
            Benchmark: Top 10% of simulation community.
          </div>
        </div>
      </div>

      <!-- Quick Action Jump Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="card" style="border-left: 3px solid var(--emerald);">
          <div class="card-title">📊 Open Pro Trading Terminal</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 16px;">
            Submit real-time simulated Intraday and Delivery orders on NIFTY 50, Bank Nifty, and MCX commodities.
          </p>
          <button class="btn btn-primary btn-sm" onclick="window.ArthashalaApp.navigate('simulator')">Launch Simulator</button>
        </div>

        <div class="card" style="border-left: 3px solid var(--cyan);">
          <div class="card-title">🤖 Consult Finance AI Tutor</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 16px;">
            Instant authoritative answers on corporate filings, SEBI circulars, and RBI monetary policy in English or Hinglish.
          </p>
          <button class="btn btn-outline btn-sm" onclick="window.ArthashalaApp.navigate('finance-ai')">Ask AI Mentor</button>
        </div>

        <div class="card" style="border-left: 3px solid var(--amber);">
          <div class="card-title">🔬 Strategy Backtesting Lab</div>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 16px;">
            Test 9/21 EMA Golden Cross, RSI Mean Reversion, and Supertrend strategies on historical Indian market bars.
          </p>
          <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaApp.navigate('backtesting')">Run Strategy Test</button>
        </div>
      </div>

      <!-- Market Movers Section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><span class="text-emerald">▲</span> Top Indian Gainers (24h)</div>
          </div>
          <table class="fin-table">
            <thead>
              <tr><th>Symbol</th><th>LTP</th><th>Change</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${topGainers.map(m => {
                const diff = m.price - m.prevClose;
                const pct = (diff / m.prevClose) * 100;
                return `
                  <tr>
                    <td><strong>${m.symbol}</strong><br /><small class="text-muted">${m.name.slice(0, 20)}</small></td>
                    <td class="font-mono">${formatINR(m.price)}</td>
                    <td class="text-emerald font-mono">+${pct.toFixed(2)}%</td>
                    <td><button class="btn btn-secondary btn-sm" onclick="window.ArthashalaApp.openInSimulator('${m.symbol}')">Trade</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title"><span class="text-rose">▼</span> Top Indian Losers (24h)</div>
          </div>
          <table class="fin-table">
            <thead>
              <tr><th>Symbol</th><th>LTP</th><th>Change</th><th>Action</th></tr>
            </thead>
            <tbody>
              ${topLosers.map(m => {
                const diff = m.price - m.prevClose;
                const pct = (diff / m.prevClose) * 100;
                return `
                  <tr>
                    <td><strong>${m.symbol}</strong><br /><small class="text-muted">${m.name.slice(0, 20)}</small></td>
                    <td class="font-mono">${formatINR(m.price)}</td>
                    <td class="text-rose font-mono">${pct.toFixed(2)}%</td>
                    <td><button class="btn btn-secondary btn-sm" onclick="window.ArthashalaApp.openInSimulator('${m.symbol}')">Trade</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. MARKETS VIEW
  function renderMarketsView(filterCat = "all") {
    const container = document.getElementById("view-markets");
    if (!container) return;

    const markets = window.ArthashalaData.markets;
    const filtered = filterCat === "all" ? markets : markets.filter(m => m.category === filterCat);
    const activeMarket = markets.find(m => m.symbol === activeMarketsChartSymbol) || markets[0];
    const diffChart = activeMarket.price - activeMarket.prevClose;
    const pctChart = activeMarket.prevClose ? ((diffChart / activeMarket.prevClose) * 100) : 0;
    const isUpChart = diffChart >= 0;

    container.innerHTML = `
      <!-- TradingView Live Chart Station -->
      <div class="tv-chart-station">
        <div class="tv-station-header">
          <div class="tv-station-title-group">
            <div class="tv-live-badge">
              <span class="tv-live-badge-dot"></span>
              TRADINGVIEW LIVE CHART
            </div>
            <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: #fff;" id="station-symbol-title">
              ${activeMarket.symbol} — ${activeMarket.name}
            </h3>
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); font-weight: 700;">${activeMarket.exchange}</span>
            <span class="font-mono" style="font-size: 16px; font-weight: 800; color: #fff;" id="station-live-price">
              ${formatINR(activeMarket.price)}
            </span>
            <span class="font-mono ${isUpChart ? 'text-emerald' : 'text-rose'}" style="font-size: 12px; font-weight: 700;" id="station-live-pct">
              ${isUpChart ? '▲ +' : '▼ '}${pctChart.toFixed(2)}%
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaComponents.openTradingViewModal('${activeMarketsChartSymbol}')" style="display: flex; align-items: center; gap: 6px;">
              ⛶ Deep-Dive Fullscreen
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.ArthashalaApp.openInSimulator('${activeMarketsChartSymbol}')" style="display: flex; align-items: center; gap: 6px;">
              ⚡ Paper Trade
            </button>
          </div>
        </div>

        <!-- Quick Instrument Switcher Pills -->
        <div class="tv-quick-pills">
          ${markets.map(m => `
            <button class="tv-pill-item ${m.symbol === activeMarketsChartSymbol ? 'active' : ''}" onclick="window.ArthashalaApp.selectMarketsChart('${m.symbol}')">
              ${m.symbol}
            </button>
          `).join('')}
        </div>

        <!-- Live TradingView Chart Host Box -->
        <div id="markets-tv-chart-box" class="tv-chart-host-box" style="margin-top: 14px;"></div>
      </div>

      <div class="screener-bar">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; color: #fff;">Indian & Global Market Screener</h2>
          <p class="text-muted" style="font-size: 13px;">Real-time virtual price ticks across NSE, BSE, MCX and Currency markets.</p>
        </div>

        <div class="filter-pills-group">
          <button class="pill-btn ${filterCat === 'all' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('all')">All Instruments</button>
          <button class="pill-btn ${filterCat === 'indices' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('indices')">Indices (Nifty/Sensex)</button>
          <button class="pill-btn ${filterCat === 'equities' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('equities')">NSE Equities</button>
          <button class="pill-btn ${filterCat === 'commodities' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('commodities')">MCX Commodities</button>
          <button class="pill-btn ${filterCat === 'forex' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('forex')">Forex (INR Pairs)</button>
          <button class="pill-btn ${filterCat === 'crypto' ? 'active' : ''}" onclick="window.ArthashalaApp.filterMarkets('crypto')">Crypto</button>
        </div>
      </div>

      <div class="card table-container">
        <table class="fin-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Sector / Category</th>
              <th>Exchange</th>
              <th>LTP</th>
              <th>24h Change</th>
              <th>24h Range</th>
              <th>Volume</th>
              <th>Lot / P/E</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(m => {
              const diff = m.price - m.prevClose;
              const pct = (diff / m.prevClose) * 100;
              const isUp = diff >= 0;
              return `
                <tr id="screener-row-${m.symbol}">
                  <td>
                    <strong>${m.symbol}</strong>
                    <div style="font-size: 11px; color: var(--text-muted);">${m.name}</div>
                  </td>
                  <td><span class="badge-tag" style="background: rgba(255,255,255,0.05); padding: 3px 6px; border-radius: 4px; font-size: 11px;">${m.sector}</span></td>
                  <td style="font-size: 12px; font-weight: 600; color: var(--cyan);">${m.exchange}</td>
                  <td class="font-mono" style="font-weight: 700; font-size: 14px;" id="screener-price-${m.symbol}">${formatINR(m.price)}</td>
                  <td class="font-mono ${isUp ? 'text-emerald' : 'text-rose'}" id="screener-pct-${m.symbol}">
                    ${isUp ? '▲ +' : '▼ '}${pct.toFixed(2)}%
                  </td>
                  <td>
                    <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 2px;">L: ${formatINR(m.low24h)} • H: ${formatINR(m.high24h)}</div>
                    <div style="width: 90px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; position: relative;">
                      <div style="position: absolute; left: 30%; width: 40%; height: 100%; background: var(--cyan); border-radius: 2px;"></div>
                    </div>
                  </td>
                  <td style="font-size: 12px; color: var(--text-secondary);">${m.volume}</td>
                  <td style="font-size: 12px; color: var(--text-muted);">${m.pe ? `P/E ${m.pe}` : `Lot ${m.lotSize}`}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <button class="btn-row-chart" onclick="window.ArthashalaApp.selectMarketsChart('${m.symbol}')" title="View Live TradingView Chart">
                        📈 Chart
                      </button>
                      <button class="btn btn-primary btn-sm" onclick="window.ArthashalaApp.openInSimulator('${m.symbol}')">
                        Trade
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Initialize TradingView Live Chart in station
    setTimeout(() => {
      if (window.ArthashalaComponents && window.ArthashalaComponents.TradingViewChart) {
        marketsTvChartInstance = window.ArthashalaComponents.TradingViewChart("markets-tv-chart-box", {
          symbol: activeMarketsChartSymbol,
          interval: "D",
          height: 520
        });
      }
    }, 50);
  }

  // 3. SIMULATOR VIEW (Pro Terminal)
  function renderSimulatorView() {
    const container = document.getElementById("view-simulator");
    if (!container) return;

    const markets = window.ArthashalaData.markets;
    const currentMarket = markets.find(m => m.symbol === activeSimulatorSymbol) || markets[0];
    const sim = window.ArthashalaServices.simulator;
    const positions = sim.getPositions();
    const orders = sim.getOrders();
    const history = sim.getTradeHistory();
    const depth = window.ArthashalaServices.marketFeed.getMarketDepth(activeSimulatorSymbol);
    const summary = sim.getPortfolioSummary();

    container.innerHTML = `
      <div class="terminal-layout">
        <!-- Main Left: Chart & Toolbar -->
        <div class="chart-panel-card">
          <div class="chart-toolbar">
            <div class="symbol-selector-group">
              <select class="symbol-select-dropdown" id="sim-symbol-picker" onchange="window.ArthashalaApp.changeSimulatorSymbol(this.value)">
                ${markets.map(m => `
                  <option value="${m.symbol}" ${m.symbol === activeSimulatorSymbol ? 'selected' : ''}>
                    ${m.symbol} — ${m.name.slice(0, 24)}
                  </option>
                `).join('')}
              </select>

              <span style="font-size: 18px; font-weight: 800; font-family: var(--font-mono); color: #fff;" id="terminal-live-price">
                ${formatINR(currentMarket.price)}
              </span>
            </div>

            <!-- Chart Engine Mode Toggle (TradingView Live vs Virtual Canvas) -->
            <div class="chart-mode-toggle-group">
              <button class="chart-mode-btn ${simChartMode === 'TRADINGVIEW' ? 'active' : ''}" onclick="window.ArthashalaApp.toggleSimChartMode('TRADINGVIEW')">
                🔥 TradingView Live
              </button>
              <button class="chart-mode-btn ${simChartMode === 'CANVAS' ? 'active' : ''}" onclick="window.ArthashalaApp.toggleSimChartMode('CANVAS')">
                📊 Sim Canvas
              </button>
            </div>

            <!-- Controls: Canvas Mode Timeframes/Indicators or TradingView Fullscreen -->
            <div class="chart-controls-group" id="sim-canvas-controls" style="${simChartMode === 'TRADINGVIEW' ? 'display: none;' : ''}">
              <button class="pill-btn" onclick="window.ArthashalaApp.setChartTimeframe('1m')">1m</button>
              <button class="pill-btn" onclick="window.ArthashalaApp.setChartTimeframe('5m')">5m</button>
              <button class="pill-btn" onclick="window.ArthashalaApp.setChartTimeframe('15m')">15m</button>
              <button class="pill-btn active" onclick="window.ArthashalaApp.setChartTimeframe('1D')">1D</button>
              <span style="color: var(--border-subtle); margin: 0 4px;">|</span>
              <button class="pill-btn active" id="btn-toggle-ema9" onclick="window.ArthashalaApp.toggleIndicator('EMA9')">EMA 9</button>
              <button class="pill-btn active" id="btn-toggle-ema21" onclick="window.ArthashalaApp.toggleIndicator('EMA21')">EMA 21</button>
              <button class="pill-btn" id="btn-toggle-bb" onclick="window.ArthashalaApp.toggleIndicator('BOLLINGER')">Bollinger</button>
              <button class="pill-btn active" id="btn-toggle-rsi" onclick="window.ArthashalaApp.toggleIndicator('RSI')">RSI</button>
            </div>
            <div class="chart-controls-group" id="sim-tv-controls" style="${simChartMode === 'TRADINGVIEW' ? '' : 'display: none;'}">
              <button class="btn btn-sm btn-secondary" onclick="window.ArthashalaComponents.openTradingViewModal('${activeSimulatorSymbol}')" style="display: flex; align-items: center; gap: 5px;">
                ⛶ Fullscreen Live Chart
              </button>
            </div>
          </div>

          <!-- Chart Wrap -->
          <div class="chart-container-wrap" id="terminal-chart-container" style="min-height: 480px;"></div>
        </div>

        <!-- Right: Order Ticket & DOM Market Depth -->
        <div class="order-ticket-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 14px; font-weight: 700; color: #fff;">Order Ticket</div>
            <div style="font-size: 11px; color: var(--emerald); font-weight: 700;">₹10,00,000 DEMO CASH</div>
          </div>

          <!-- MIS vs CNC Tabs -->
          <div class="product-tabs">
            <div class="tab-pill ${activeOrderProduct === 'MIS' ? 'active' : ''}" onclick="window.ArthashalaApp.setOrderProduct('MIS')">
              Intraday (MIS 5x)
            </div>
            <div class="tab-pill ${activeOrderProduct === 'CNC' ? 'active' : ''}" onclick="window.ArthashalaApp.setOrderProduct('CNC')">
              Delivery (CNC 1x)
            </div>
          </div>

          <!-- Order Type Tabs -->
          <div class="order-type-tabs">
            <div class="tab-pill ${activeOrderType === 'MARKET' ? 'active' : ''}" onclick="window.ArthashalaApp.setOrderType('MARKET')">
              Market Order
            </div>
            <div class="tab-pill ${activeOrderType === 'LIMIT' ? 'active' : ''}" onclick="window.ArthashalaApp.setOrderType('LIMIT')">
              Limit Order
            </div>
          </div>

          <!-- Quantity Input -->
          <div class="form-group">
            <div class="form-label">
              <span>Quantity</span>
              <span>Lot Size: ${currentMarket.lotSize}</span>
            </div>
            <div class="form-input-box">
              <input type="number" id="order-qty-input" class="text-input" value="${currentMarket.lotSize}" min="1" oninput="window.ArthashalaApp.calculateOrderMargin()" />
              <span class="input-suffix">Shares</span>
            </div>
          </div>

          <!-- Limit Price Input (Only for Limit) -->
          <div class="form-group" id="limit-price-group" style="${activeOrderType === 'MARKET' ? 'display:none;' : ''}">
            <div class="form-label">Limit Price (₹)</div>
            <input type="number" id="order-limit-price-input" class="text-input" value="${currentMarket.price}" step="0.05" oninput="window.ArthashalaApp.calculateOrderMargin()" />
          </div>

          <!-- SL & Target Inputs with R:R -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <div class="form-label">Stop-Loss (₹)</div>
              <input type="number" id="order-sl-input" class="text-input" placeholder="Optional" step="0.05" oninput="window.ArthashalaApp.calculateRR()" />
            </div>
            <div class="form-group">
              <div class="form-label">Target (₹)</div>
              <input type="number" id="order-target-input" class="text-input" placeholder="Optional" step="0.05" oninput="window.ArthashalaApp.calculateRR()" />
            </div>
          </div>

          <!-- R:R Indicator -->
          <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;" id="order-rr-summary">
            <span>Risk-to-Reward: <strong>—</strong></span>
            <span>Est. Risk: <strong>—</strong></span>
          </div>

          <!-- Margin Requirements -->
          <div class="margin-info-box">
            <div class="margin-row">
              <span class="text-muted">Margin Required:</span>
              <strong class="font-mono text-emerald" id="order-margin-req">₹0.00</strong>
            </div>
            <div class="margin-row">
              <span class="text-muted">Available Cash:</span>
              <span class="font-mono">${formatINR(summary.availableCash)}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="order-action-buttons">
            <button class="btn btn-buy" onclick="window.ArthashalaApp.submitOrder('BUY')">
              BUY (Long)
            </button>
            <button class="btn btn-sell" onclick="window.ArthashalaApp.submitOrder('SELL')">
              SELL (Short)
            </button>
          </div>

          <!-- Market Depth Snippet -->
          <div style="margin-top: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">MARKET DEPTH (L2)</div>
            <div class="market-depth-box">
              <div>
                <div class="depth-column-header"><span>BID</span><span>QTY</span></div>
                ${depth.bids.slice(0, 3).map(b => `
                  <div class="depth-row bid"><span>${b.price.toFixed(2)}</span><span>${b.qty}</span></div>
                `).join('')}
              </div>
              <div>
                <div class="depth-column-header"><span>ASK</span><span>QTY</span></div>
                ${depth.asks.slice(0, 3).map(a => `
                  <div class="depth-row ask"><span>${a.price.toFixed(2)}</span><span>${a.qty}</span></div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Tabs: Positions, Pending Orders, Executed History -->
      <div class="card">
        <div class="terminal-tabs-header">
          <div class="terminal-tab-item active" id="tab-positions-btn" onclick="window.ArthashalaApp.switchTerminalTab('positions')">
            Open Positions <span class="tab-count-badge">${positions.length}</span>
          </div>
          <div class="terminal-tab-item" id="tab-orders-btn" onclick="window.ArthashalaApp.switchTerminalTab('orders')">
            Pending Orders <span class="tab-count-badge">${orders.filter(o => o.status === 'PENDING').length}</span>
          </div>
          <div class="terminal-tab-item" id="tab-history-btn" onclick="window.ArthashalaApp.switchTerminalTab('history')">
            Trade History <span class="tab-count-badge">${history.length}</span>
          </div>
        </div>

        <!-- Positions Table -->
        <div id="terminal-tab-positions">
          ${positions.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              No open positions. Submit an order from the ticket above to start simulated trading!
            </div>
          ` : `
            <table class="fin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Quantity</th>
                  <th>Avg Price</th>
                  <th>LTP</th>
                  <th>Current Value</th>
                  <th>Unrealized P&L</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${positions.map(p => {
                  const item = markets.find(m => m.symbol === p.symbol);
                  const ltp = item ? item.price : p.currentPrice;
                  const diff = p.side === "BUY" ? (ltp - p.avgPrice) : (p.avgPrice - ltp);
                  const pnl = diff * p.quantity;
                  const pnlPct = (diff / p.avgPrice) * 100;
                  const isUp = pnl >= 0;

                  return `
                    <tr>
                      <td><span class="badge-tag" style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${p.product}</span></td>
                      <td><strong>${p.symbol}</strong></td>
                      <td class="${p.side === 'BUY' ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">${p.side}</td>
                      <td class="font-mono">${p.quantity}</td>
                      <td class="font-mono">${formatINR(p.avgPrice)}</td>
                      <td class="font-mono" style="font-weight: 700;">${formatINR(ltp)}</td>
                      <td class="font-mono">${formatINR(ltp * p.quantity)}</td>
                      <td class="font-mono ${isUp ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                        ${isUp ? '+' : ''}${formatINR(pnl)} (${pnlPct.toFixed(2)}%)
                      </td>
                      <td>
                        <button class="btn btn-danger btn-sm" onclick="window.ArthashalaApp.closePosition('${p.id}')">
                          Square Off
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>

        <!-- Pending Orders Table -->
        <div id="terminal-tab-orders" style="display: none;">
          ${orders.filter(o => o.status === 'PENDING').length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              No pending limit orders.
            </div>
          ` : `
            <table class="fin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Symbol</th>
                  <th>Product</th>
                  <th>Side</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Trigger / Limit Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${orders.filter(o => o.status === 'PENDING').map(o => `
                  <tr>
                    <td class="font-mono" style="font-size: 11px;">${o.id}</td>
                    <td><strong>${o.symbol}</strong></td>
                    <td>${o.product}</td>
                    <td class="${o.side === 'BUY' ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">${o.side}</td>
                    <td>${o.type}</td>
                    <td class="font-mono">${o.quantity}</td>
                    <td class="font-mono" style="font-weight: 700;">${formatINR(o.price)}</td>
                    <td><span class="badge-tag" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); padding: 2px 6px; border-radius: 4px; font-size: 11px;">PENDING</span></td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaApp.cancelOrder('${o.id}')">Cancel</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <!-- Executed Trade History Table -->
        <div id="terminal-tab-history" style="display: none;">
          <table class="fin-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Product</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Buy Price</th>
                <th>Sell Price</th>
                <th>Realized P&L</th>
                <th>Closed At</th>
                <th>Trade Rationale</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(h => {
                const isUp = h.pnl >= 0;
                return `
                  <tr>
                    <td><strong>${h.symbol}</strong></td>
                    <td>${h.product}</td>
                    <td class="${h.side === 'BUY' ? 'text-emerald' : 'text-rose'}">${h.side}</td>
                    <td class="font-mono">${h.quantity}</td>
                    <td class="font-mono">${formatINR(h.buyPrice)}</td>
                    <td class="font-mono">${formatINR(h.sellPrice)}</td>
                    <td class="font-mono ${isUp ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                      ${isUp ? '+' : ''}${formatINR(h.pnl)} (${h.pnlPct.toFixed(2)}%)
                    </td>
                    <td style="font-size: 11px; color: var(--text-muted);">${new Date(h.closedAt).toLocaleDateString('en-IN')}</td>
                    <td style="font-size: 12px; color: var(--text-secondary); max-width: 250px;">${h.reason || 'Simulated trade'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Initialize Chart (TradingView Live or Custom Canvas)
    setTimeout(() => {
      if (simChartMode === "TRADINGVIEW" && window.ArthashalaComponents && window.ArthashalaComponents.TradingViewChart) {
        simTvChartInstance = window.ArthashalaComponents.TradingViewChart("terminal-chart-container", {
          symbol: activeSimulatorSymbol,
          interval: "D",
          height: 480
        });
      } else if (window.ArthashalaComponents && window.ArthashalaComponents.StockChart) {
        activeChartInstance = window.ArthashalaComponents.StockChart("terminal-chart-container", {
          symbol: activeSimulatorSymbol,
          timeframe: "1D"
        });
      }
      calculateOrderMargin();
    }, 50);
  }

  // Simulator helper functions
  function calculateOrderMargin() {
    const qtyInput = document.getElementById("order-qty-input");
    const marginReqEl = document.getElementById("order-margin-req");
    if (!qtyInput || !marginReqEl) return;

    const qty = parseInt(qtyInput.value, 10) || 1;
    const market = window.ArthashalaData.markets.find(m => m.symbol === activeSimulatorSymbol);
    if (!market) return;

    const price = (activeOrderType === "LIMIT") ? 
      (parseFloat(document.getElementById("order-limit-price-input").value) || market.price) : market.price;

    const totalVal = price * qty;
    const margin = activeOrderProduct === "MIS" ? (totalVal / 5) : totalVal;
    marginReqEl.innerText = formatINR(margin);
  }

  function calculateRR() {
    const slInput = document.getElementById("order-sl-input");
    const targetInput = document.getElementById("order-target-input");
    const rrEl = document.getElementById("order-rr-summary");
    if (!slInput || !targetInput || !rrEl) return;

    const sl = parseFloat(slInput.value);
    const target = parseFloat(targetInput.value);
    const market = window.ArthashalaData.markets.find(m => m.symbol === activeSimulatorSymbol);
    if (!market || !sl || !target) {
      rrEl.innerHTML = `<span>Risk-to-Reward: <strong>—</strong></span><span>Est. Risk: <strong>—</strong></span>`;
      return;
    }

    const price = market.price;
    const riskPerShare = Math.abs(price - sl);
    const rewardPerShare = Math.abs(target - price);
    const ratio = riskPerShare > 0 ? (rewardPerShare / riskPerShare).toFixed(2) : "—";
    
    const qty = parseInt(document.getElementById("order-qty-input").value, 10) || 1;
    const totalRisk = riskPerShare * qty;

    rrEl.innerHTML = `
      <span>Risk-to-Reward: <strong class="text-cyan">1 : ${ratio}</strong></span>
      <span>Max Loss: <strong class="text-rose">${formatINR(totalRisk)}</strong></span>
    `;
  }

  // 4. PORTFOLIO VIEW
  function renderPortfolioView() {
    const container = document.getElementById("view-portfolio");
    if (!container) return;

    const analytics = window.ArthashalaServices.portfolio.getAnalytics();
    const summary = analytics.summary;
    const positions = window.ArthashalaServices.simulator.getPositions();

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Portfolio Quantitative Analytics</h2>
        <p class="text-muted" style="font-size: 13px;">Institutional risk metrics, Sharpe ratio, and capital allocation.</p>
      </div>

      <!-- Top Summary Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="card">
          <div class="card-subtitle">Total Portfolio Value</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: #fff;">
            ${formatINR(summary.netWorth)}
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Initial: ₹10,00,000</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Sharpe Ratio (Annualized)</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--cyan);">
            ${analytics.sharpeRatio}
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Risk-free: ${analytics.riskFreeRate}</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Win Rate %</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--emerald);">
            ${analytics.winRate}%
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">${analytics.winCount} Wins / ${analytics.lossCount} Losses</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Profit Factor</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--amber);">
            ${analytics.profitFactor}x
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Gross Profits ÷ Gross Losses</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Max Drawdown</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--rose);">
            ${analytics.maxDrawdown}%
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Peak-to-trough capital dip</div>
        </div>
      </div>

      <!-- Asset Allocation & 30-Day Growth -->
      <div style="display: grid; grid-template-columns: 320px 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Allocation Breakdown -->
        <div class="card">
          <div class="card-header"><div class="card-title">Asset Allocation</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
            ${Object.entries(analytics.allocation).map(([asset, val]) => {
              const pct = summary.netWorth > 0 ? ((val / summary.netWorth) * 100).toFixed(1) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                    <span>${asset}</span>
                    <strong class="font-mono">${formatINR(val, 0)} (${pct}%)</strong>
                  </div>
                  <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: ${asset === 'Cash' ? 'var(--emerald)' : asset === 'Equities' ? 'var(--cyan)' : 'var(--amber)'};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 30-Day Portfolio vs Nifty Curve -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Portfolio Performance vs NIFTY 50 (30 Days)</div>
            <span class="badge-tag" style="background: rgba(0,229,153,0.1); color: var(--emerald); font-size: 11px; padding: 2px 8px; border-radius: 4px;">
              Outperforming by +${(summary.totalReturnPct - 2.8).toFixed(1)}%
            </span>
          </div>
          <div style="height: 220px; position: relative;" id="portfolio-benchmark-canvas-wrap">
            <canvas id="portfolio-curve-canvas" style="width: 100%; height: 100%;"></canvas>
          </div>
          <div style="display: flex; gap: 20px; font-size: 12px; color: var(--text-secondary); margin-top: 12px; justify-content: flex-end;">
            <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 10px; height: 10px; background: var(--emerald); border-radius: 2px;"></span> Wealth Signal Portfolio</span>
            <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 10px; height: 10px; background: #64748b; border-radius: 2px;"></span> NIFTY 50 Benchmark</span>
          </div>
        </div>
      </div>

      <!-- Active Holdings Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Holdings Breakdown</div>
        </div>
        <table class="fin-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Holding Type</th>
              <th>Quantity</th>
              <th>Avg Cost</th>
              <th>Current LTP</th>
              <th>Invested Value</th>
              <th>Current Value</th>
              <th>Total P&L</th>
            </tr>
          </thead>
          <tbody>
            ${positions.map(p => {
              const item = window.ArthashalaData.markets.find(m => m.symbol === p.symbol);
              const ltp = item ? item.price : p.currentPrice;
              const invested = p.avgPrice * p.quantity;
              const curVal = ltp * p.quantity;
              const pnl = curVal - invested;
              const pnlPct = (pnl / invested) * 100;
              const isUp = pnl >= 0;
              return `
                <tr>
                  <td><strong>${p.symbol}</strong></td>
                  <td>${p.product}</td>
                  <td class="font-mono">${p.quantity}</td>
                  <td class="font-mono">${formatINR(p.avgPrice)}</td>
                  <td class="font-mono">${formatINR(ltp)}</td>
                  <td class="font-mono">${formatINR(invested)}</td>
                  <td class="font-mono">${formatINR(curVal)}</td>
                  <td class="font-mono ${isUp ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                    ${isUp ? '+' : ''}${formatINR(pnl)} (${pnlPct.toFixed(2)}%)
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    setTimeout(drawPortfolioComparisonCurve, 50);
  }

  function drawPortfolioComparisonCurve() {
    const canvas = document.getElementById("portfolio-curve-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const analytics = window.ArthashalaServices.portfolio.getAnalytics();
    const portPts = analytics.equityCurve;
    const niftyPts = analytics.benchmarkCurve;
    const count = portPts.length;

    // Draw Nifty line (muted gray)
    ctx.beginPath();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * (w - 20) + 10;
      const y = h - ((niftyPts[i].pct + 5) / 15) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Portfolio curve (emerald)
    ctx.beginPath();
    ctx.strokeStyle = "#00e599";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * (w - 20) + 10;
      const y = h - ((portPts[i].pct + 5) / 15) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 5. JOURNAL VIEW
  function renderJournalView() {
    const container = document.getElementById("view-journal");
    if (!container) return;

    const jrn = window.ArthashalaServices.journal;
    const entries = jrn.getEntries();
    const insights = jrn.getInsights();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Trading & Psychological Journal</h2>
          <p class="text-muted" style="font-size: 13px;">Track your emotional discipline, eliminate FOMO, and enforce trading plan compliance.</p>
        </div>
        <button class="btn btn-primary" onclick="window.ArthashalaApp.openNewJournalEntryModal()">
          + Log New Reflection
        </button>
      </div>

      <!-- Behavioral Coaching Alerts -->
      <div class="card" style="background: rgba(15, 23, 42, 0.6); border-left: 4px solid var(--amber); margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--amber); margin-bottom: 8px;">
          🧠 AI BEHAVIORAL COACH INSIGHTS
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          ${insights.recommendations.map(r => `<div>${r}</div>`).join('')}
        </div>
        <div style="display: flex; gap: 24px; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; font-size: 12px; color: var(--text-secondary);">
          <span>Discipline Score: <strong class="text-emerald">${insights.disciplineScore}/100</strong></span>
          <span>Plan Adherence: <strong class="text-cyan">${insights.planAdherence}%</strong></span>
          <span>Stop-Loss Respect: <strong class="text-emerald">${insights.slRespectRate}%</strong></span>
        </div>
      </div>

      <!-- Journal Entries List -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${entries.map(e => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 16px; font-weight: 800; color: #fff;">${e.symbol}</span>
                <span class="badge-tag" style="background: ${e.outcome === 'WIN' ? 'var(--emerald-dim)' : 'var(--rose-dim)'}; color: ${e.outcome === 'WIN' ? 'var(--emerald)' : 'var(--rose)'}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                  ${e.outcome} (${formatINR(e.pnl)})
                </span>
                <span class="badge-tag" style="background: rgba(255,255,255,0.06); color: #cbd5e1; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                  Setup: ${e.setup}
                </span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted);">${e.date}</div>
            </div>

            <p style="font-size: 13.5px; color: #e2e8f0; line-height: 1.6; margin-bottom: 12px;">
              "${e.notes}"
            </p>

            <div style="display: flex; gap: 16px; font-size: 11.5px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 8px; color: var(--text-secondary);">
              <span>Emotion: <strong>${e.emotion}</strong></span>
              <span>Followed Plan: <strong class="${e.followedPlan ? 'text-emerald' : 'text-rose'}">${e.followedPlan ? 'YES' : 'NO'}</strong></span>
              <span>Respected SL: <strong class="${e.respectedSL ? 'text-emerald' : 'text-rose'}">${e.respectedSL ? 'YES' : 'NO'}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 6. BACKTESTING VIEW
  function renderBacktestingView() {
    const container = document.getElementById("view-backtesting");
    if (!container) return;

    // Run initial default backtest
    const initialResult = window.ArthashalaServices.backtest.run({
      strategy: "EMA_CROSSOVER",
      symbol: "NIFTY 50",
      period: "1Y",
      stopLossPct: 2.0,
      targetPct: 5.0
    });

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Quantitative Strategy Backtesting Lab</h2>
        <p class="text-muted" style="font-size: 13px;">Test rule-based strategies across historical Indian market data before risking virtual capital.</p>
      </div>

      <!-- Controls Card -->
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; align-items: flex-end;">
          <div class="form-group">
            <div class="form-label">Strategy Preset</div>
            <select id="bt-strategy-select" class="symbol-select-dropdown" style="width: 100%;">
              <option value="EMA_CROSSOVER" selected>9/21 EMA Golden Cross</option>
              <option value="RSI_MEAN_REVERSION">RSI Mean Reversion (30/70)</option>
              <option value="SUPERTREND">Supertrend Trend-Following</option>
              <option value="BREAKOUT_20D">20-Day High Breakout</option>
            </select>
          </div>

          <div class="form-group">
            <div class="form-label">Asset / Index</div>
            <select id="bt-symbol-select" class="symbol-select-dropdown" style="width: 100%;">
              <option value="NIFTY 50" selected>NIFTY 50 Index</option>
              <option value="BANKNIFTY">BANK NIFTY</option>
              <option value="RELIANCE">Reliance Industries</option>
              <option value="TCS">Tata Consultancy Services</option>
              <option value="GOLD">MCX Gold</option>
            </select>
          </div>

          <div class="form-group">
            <div class="form-label">Lookback Horizon</div>
            <select id="bt-period-select" class="symbol-select-dropdown" style="width: 100%;">
              <option value="6M">Past 6 Months</option>
              <option value="1Y" selected>Past 1 Year (252 Bars)</option>
              <option value="3Y">Past 3 Years</option>
            </select>
          </div>

          <div class="form-group">
            <div class="form-label">Stop-Loss %</div>
            <input type="number" id="bt-sl-input" class="text-input" value="2.0" step="0.5" />
          </div>

          <div class="form-group">
            <div class="form-label">Profit Target %</div>
            <input type="number" id="bt-target-input" class="text-input" value="5.0" step="0.5" />
          </div>

          <div>
            <button class="btn btn-primary" style="width: 100%;" onclick="window.ArthashalaApp.executeBacktest()">
              🔬 Run Backtest
            </button>
          </div>
        </div>
      </div>

      <!-- Results Container -->
      <div id="backtest-results-container">
        ${renderBacktestResultsHTML(initialResult)}
      </div>
    `;

    setTimeout(() => drawBacktestEquityCurve(initialResult), 50);
  }

  function renderBacktestResultsHTML(res) {
    return `
      <!-- Performance Metrics Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px;">
        <div class="card">
          <div class="card-subtitle">Strategy Return</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0;" class="${res.totalReturnPct >= 0 ? 'text-emerald' : 'text-rose'}">
            ${res.totalReturnPct >= 0 ? '+' : ''}${res.totalReturnPct}%
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Benchmark: +${res.benchmarkReturnPct}%</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Win Rate %</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--cyan);">
            ${res.winRate}%
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">${res.winCount} Wins / ${res.lossCount} Losses</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Profit Factor</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--amber);">
            ${res.profitFactor}
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Net Profit: ${formatINR(res.netProfitRupees)}</div>
        </div>

        <div class="card">
          <div class="card-subtitle">Max Drawdown</div>
          <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); margin: 4px 0; color: var(--rose);">
            ${res.maxDrawdownPct}%
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">Total Trades: ${res.totalTrades}</div>
        </div>
      </div>

      <!-- Equity Curve Graph -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <div class="card-title">Backtest Equity Curve vs Buy & Hold Benchmark</div>
        </div>
        <div style="height: 240px; position: relative;">
          <canvas id="backtest-canvas" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>

      <!-- Trade Log Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Trade-by-Trade Execution Log (${res.trades.length} Trades)</div>
        </div>
        <table class="fin-table">
          <thead>
            <tr>
              <th>Entry Date</th>
              <th>Exit Date</th>
              <th>Side</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>P&L %</th>
              <th>P&L (₹)</th>
              <th>R-Multiple</th>
              <th>Exit Reason</th>
            </tr>
          </thead>
          <tbody>
            ${res.trades.slice(0, 15).map(t => `
              <tr>
                <td>${t.entryDate}</td>
                <td>${t.exitDate}</td>
                <td class="text-emerald" style="font-weight: 700;">${t.side}</td>
                <td class="font-mono">${formatINR(t.entryPrice)}</td>
                <td class="font-mono">${formatINR(t.exitPrice)}</td>
                <td class="font-mono ${t.pnlPct >= 0 ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                  ${t.pnlPct >= 0 ? '+' : ''}${t.pnlPct}%
                </td>
                <td class="font-mono ${t.pnlRupees >= 0 ? 'text-emerald' : 'text-rose'}">
                  ${formatINR(t.pnlRupees)}
                </td>
                <td class="font-mono">${t.rMultiple}R</td>
                <td style="font-size: 12px; color: var(--text-secondary);">${t.reason}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function drawBacktestEquityCurve(res) {
    const canvas = document.getElementById("backtest-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const pts = res.equityCurve;
    if (pts.length === 0) return;

    let minVal = Infinity, maxVal = -Infinity;
    pts.forEach(p => {
      if (p.equity < minVal) minVal = p.equity;
      if (p.equity > maxVal) maxVal = p.equity;
      if (p.benchmark < minVal) minVal = p.benchmark;
      if (p.benchmark > maxVal) maxVal = p.benchmark;
    });
    const range = (maxVal - minVal) || 1;

    // Draw benchmark line
    ctx.beginPath();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * (w - 20) + 10;
      const y = h - ((pts[i].benchmark - minVal) / range) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Strategy line
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < pts.length; i++) {
      const x = (i / (pts.length - 1)) * (w - 20) + 10;
      const y = h - ((pts[i].equity - minVal) / range) * (h - 30) - 15;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 7. EDUCATION VIEW
  function renderEducationView() {
    const container = document.getElementById("view-education");
    if (!container) return;

    const tracks = window.ArthashalaData.academyTracks;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Wealth Signal Academy</h2>
        <p class="text-muted" style="font-size: 13px;">Structured curriculums spanning Indian equity markets, technical analysis, corporate filings, derivatives, and macro policy.</p>
      </div>

      <div class="tracks-grid">
        ${tracks.map(t => `
          <div class="track-card" onclick="window.ArthashalaApp.openTrackDetails('${t.id}')">
            <div>
              <div class="track-header">
                <div class="track-icon">${t.icon}</div>
                <span class="track-badge">${t.level}</span>
              </div>
              <h3 class="track-title">${t.title}</h3>
              <p class="track-desc">${t.description}</p>
            </div>
            <div class="track-footer">
              <span>${t.duration}</span>
              <span class="text-cyan font-mono" style="font-weight: 700;">+${t.modules.reduce((sum, m) => sum + m.xp, 0)} XP</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Active Module Lesson Container (populated when user clicks a track) -->
      <div id="academy-active-lesson-container"></div>
    `;
  }

  // 8. FINANCE AI TUTOR VIEW
  function renderFinanceAIView() {
    const container = document.getElementById("view-finance-ai");
    if (!container) return;

    const tutor = window.ArthashalaServices.aiTutor;
    const history = tutor.getHistory();
    const prompts = window.ArthashalaData.aiKnowledge.quickPrompts;

    container.innerHTML = `
      <div class="ai-tutor-container">
        <!-- Sidebar with Presets & Hinglish Switch -->
        <div class="ai-sidebar">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 4px;">Finance AI Tutor</div>
            <p class="text-muted" style="font-size: 11.5px;">Citing SEBI, RBI, NSE & Academic Research.</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 12px; border-radius: var(--radius-sm);">
            <div class="hinglish-toggle-group">
              <span>Hinglish Mode</span>
              <label class="toggle-switch">
                <input type="checkbox" id="hinglish-toggle" ${tutor.isHinglish() ? 'checked' : ''} onchange="window.ArthashalaApp.toggleHinglish(this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
              Explain complex financial jargon in conversational Hindi + English.
            </p>
          </div>

          <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Suggested Questions:</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${prompts.map(p => `
              <div class="quick-prompt-pill" onclick="window.ArthashalaApp.submitAiQuery('${p.query.replace(/'/g, "\\'")}')">
                <strong>${p.title}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${p.query.slice(0, 48)}...</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="ai-chat-window">
          <div class="ai-chat-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">🤖</span>
              <div>
                <strong style="font-size: 13px; color: #fff;">Wealth Signal Market Mentor</strong>
                <div style="font-size: 10px; color: var(--emerald);">● Online & Regulatory Verified</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaApp.clearAiChat()">Clear</button>
          </div>

          <div class="ai-messages-scroll" id="ai-messages-container">
            ${history.map(m => `
              <div class="chat-bubble ${m.role}">
                ${m.title ? `<div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #fff;">${m.title}</div>` : ''}
                <div style="white-space: pre-wrap;">${m.content}</div>
                ${m.citations && m.citations.length ? `
                  <div class="citation-badges-box">
                    ${m.citations.map(c => `<span class="citation-badge">📜 ${c}</span>`).join('')}
                  </div>
                ` : ''}
                ${m.simulatorAction ? `
                  <div style="margin-top: 12px;">
                    <button class="btn btn-outline btn-sm" onclick="window.ArthashalaApp.openInSimulator('${m.simulatorAction.symbol}')">
                      ⚡ ${m.simulatorAction.actionText}
                    </button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="ai-input-bar">
            <input type="text" id="ai-query-input" class="text-input" placeholder="Ask about SEBI circulars, P/E ratio, RBI repo rate, option Greeks..." onkeydown="if(event.key === 'Enter') window.ArthashalaApp.handleAiInputSubmit()" />
            <button class="btn btn-primary" onclick="window.ArthashalaApp.handleAiInputSubmit()">Ask</button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const scroll = document.getElementById("ai-messages-container");
      if (scroll) scroll.scrollTop = scroll.scrollHeight;
    }, 50);
  }

  // 9. RISK TOOLS & CALCULATORS VIEW
  function renderRiskToolsView() {
    const container = document.getElementById("view-risk-tools");
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Risk Management & Position Sizing Suite</h2>
        <p class="text-muted" style="font-size: 13px;">Professional position calculators per SEBI capital preservation best practices.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px;">
        <!-- Position Size Calculator -->
        <div class="card">
          <div class="card-header"><div class="card-title">🛡️ Position Size Calculator</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group">
              <div class="form-label">Total Capital (₹)</div>
              <input type="number" id="calc-cap" class="text-input" value="1000000" oninput="window.ArthashalaApp.calcPositionSize()" />
            </div>
            <div class="form-group">
              <div class="form-label">Max Risk Per Trade (%)</div>
              <input type="number" id="calc-risk-pct" class="text-input" value="1.5" step="0.25" oninput="window.ArthashalaApp.calcPositionSize()" />
            </div>
            <div class="form-group">
              <div class="form-label">Stock Entry Price (₹)</div>
              <input type="number" id="calc-entry" class="text-input" value="2980" oninput="window.ArthashalaApp.calcPositionSize()" />
            </div>
            <div class="form-group">
              <div class="form-label">Stop-Loss Price (₹)</div>
              <input type="number" id="calc-sl" class="text-input" value="2920" oninput="window.ArthashalaApp.calcPositionSize()" />
            </div>

            <!-- Result Box -->
            <div class="card" style="background: rgba(0, 229, 153, 0.05); border: 1px solid var(--emerald-border); padding: 14px; margin-top: 10px;">
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">Permissible Quantity:</div>
              <div style="font-size: 28px; font-weight: 800; font-family: var(--font-mono); color: var(--emerald);" id="calc-result-qty">
                250 Shares
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 8px; color: var(--text-muted);" id="calc-result-sub">
                <span>Max Rupee Risk: <strong>₹15,000 (1.5%)</strong></span>
                <span>Total Capital Needed: <strong>₹7,45,000</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- F&O Lot Size & Margin Calculator -->
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Indian F&O Contract & Lot Calculator</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group">
              <div class="form-label">Select Derivative Contract</div>
              <select id="calc-fo-symbol" class="symbol-select-dropdown" style="width: 100%;" onchange="window.ArthashalaApp.calcFO()">
                <option value="NIFTY" selected>NIFTY 50 (Lot Size: 25)</option>
                <option value="BANKNIFTY">BANK NIFTY (Lot Size: 15)</option>
                <option value="FINNIFTY">FIN NIFTY (Lot Size: 25)</option>
                <option value="RELIANCE">RELIANCE F&O (Lot Size: 250)</option>
              </select>
            </div>
            <div class="form-group">
              <div class="form-label">Number of Lots</div>
              <input type="number" id="calc-fo-lots" class="text-input" value="2" min="1" oninput="window.ArthashalaApp.calcFO()" />
            </div>

            <!-- F&O Result -->
            <div class="card" style="background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.3); padding: 14px; margin-top: 10px;" id="calc-fo-result">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Total Contract Quantity:</span>
                <strong class="font-mono text-cyan" id="fo-total-qty">50 Units</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Value per 10-Point Move:</span>
                <strong class="font-mono text-emerald" id="fo-point-val">₹500</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Estimated Margin (SPAN + Exposure):</span>
                <strong class="font-mono" id="fo-margin">₹1,25,000</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 10. PRICING VIEW
  function renderPricingView() {
    const container = document.getElementById("view-pricing");
    if (!container) return;

    const sub = window.ArthashalaComponents.checkout.getSubscription();

    container.innerHTML = `
      <div style="text-align: center; max-width: 680px; margin: 0 auto 36px;">
        <div class="badge-tag" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 12px; border-radius: var(--radius-full); display: inline-block; font-size: 11px; font-weight: 700; margin-bottom: 12px;">
          PREMIUM TRADER SUBSCRIPTION
        </div>
        <h2 style="font-size: 30px; font-weight: 800; color: #fff; margin-bottom: 10px;">
          Master the Markets with Pro Terminal Tools
        </h2>
        <p class="text-secondary" style="font-size: 14px;">
          Upgrade to unlock advanced candlestick indicators, portfolio quantitative analytics, unlimited strategy backtesting, psychological journal, and uncapped Finance AI queries.
        </p>
      </div>

      <!-- Pricing Plans Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <!-- 1 Month -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">1 Month Plan</div>
            <div class="text-muted" style="font-size: 12px;">Starter Trader</div>
            <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: #fff; margin: 16px 0;">
              ₹99
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 16px;">Standard monthly access</div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--text-secondary);">
              <li>✓ Advanced Candlestick Charts</li>
              <li>✓ Market Simulator with ₹10L</li>
              <li>✓ Basic Strategy Backtester</li>
            </ul>
          </div>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 24px;" onclick="window.ArthashalaComponents.checkout.openModal('1M')">
            Select ₹99 Plan
          </button>
        </div>

        <!-- 3 Months -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">3 Months Plan</div>
            <div class="text-muted" style="font-size: 12px;">Active Learner</div>
            <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: #fff; margin: 16px 0;">
              ₹399
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 16px;">Save 15% vs monthly</div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--text-secondary);">
              <li>✓ All 1-Month Perks</li>
              <li>✓ Portfolio Sharpe Analytics</li>
              <li>✓ Psychological Journal</li>
            </ul>
          </div>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 24px;" onclick="window.ArthashalaComponents.checkout.openModal('3M')">
            Select ₹399 Plan
          </button>
        </div>

        <!-- 6 Months -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">6 Months Plan</div>
            <div class="text-muted" style="font-size: 12px;">Semi-Pro</div>
            <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: #fff; margin: 16px 0;">
              ₹699
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 16px;">Save 25% vs monthly</div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--text-secondary);">
              <li>✓ Full Pro Access</li>
              <li>✓ Unlimited AI Queries</li>
              <li>✓ Risk Management Suite</li>
            </ul>
          </div>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 24px;" onclick="window.ArthashalaComponents.checkout.openModal('6M')">
            Select ₹699 Plan
          </button>
        </div>

        <!-- 1 Year (Best Value) -->
        <div class="card" style="border: 2px solid var(--emerald); position: relative; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, rgba(0, 229, 153, 0.06) 0%, rgba(18, 24, 38, 1) 100%);">
          <div class="best-value-ribbon">⭐ BEST VALUE</div>
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">1 Year Plan</div>
            <div class="text-emerald" style="font-size: 12px; font-weight: 700;">Complete Annual Mastery</div>
            <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--emerald); margin: 16px 0;">
              ₹1,099
            </div>
            <div style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 16px;">Just ₹3.01 / day (Save 42%)</div>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #f8fafc;">
              <li>✓ Everything in Pro Unlocked</li>
              <li>✓ Multi-Year Backtesting Data</li>
              <li>✓ SEBI Compliance Certificate</li>
              <li>✓ Priority AI Mentor Responses</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-glow" style="width: 100%; margin-top: 24px;" onclick="window.ArthashalaComponents.checkout.openModal('1Y')">
            Upgrade for ₹1,099 (Best Value)
          </button>
        </div>
      </div>
    `;
  }

  // 11. PROFILE & SETTINGS VIEW
  function renderProfileView() {
    const container = document.getElementById("view-profile");
    if (!container) return;

    const authService = window.ArthashalaServices.auth;
    const user = authService ? authService.getUser() : null;
    const tier = window.ArthashalaServices.gamification.getCurrentTier();
    const badges = window.ArthashalaServices.gamification.getBadges();
    const sub = window.ArthashalaComponents.checkout.getSubscription();

    const userName = user ? user.name : "Arjun Singhania";
    const userSubText = user ? (user.email || user.phone) : "Virtual Trader #AS-4892";
    const userProvider = user ? user.provider : "google";
    const userAvatar = user && user.avatar ? user.avatar : "assets/logo.jpg";
    const isProUser = user ? user.isPro : sub.isPro;

    const providerBadge = userProvider === "google"
      ? `<span class="badge-tag" style="background: rgba(66, 133, 244, 0.15); color: #60a5fa; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">🌐 GOOGLE VERIFIED</span>`
      : (userProvider === "phone"
        ? `<span class="badge-tag" style="background: rgba(0, 229, 153, 0.15); color: var(--emerald); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">📱 PHONE OTP VERIFIED</span>`
        : `<span class="badge-tag" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">✉️ EMAIL VERIFIED</span>`
      );

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px;">
        <!-- User Identity Card -->
        <div class="card">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
            <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px; border: 2px solid var(--cyan); display: flex; align-items: center; justify-content: center; background: #1e293b;">
              <img src="${userAvatar}" alt="${userName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/logo.jpg';" />
            </div>
            <h3 style="font-size: 18px; font-weight: 800; color: #fff;">${userName}</h3>
            <div style="font-size: 12px; color: var(--text-muted);">${userSubText}</div>
            <div style="margin-top: 10px; display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
              <span class="badge-tag" style="background: ${isProUser ? 'rgba(0,229,153,0.15)' : 'rgba(255,255,255,0.06)'}; color: ${isProUser ? 'var(--emerald)' : '#cbd5e1'}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                ${isProUser ? '⭐ WEALTH SIGNAL PRO' : 'FREE TIER'}
              </span>
              ${providerBadge}
            </div>
          </div>

          <div style="padding-top: 16px; display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between;">
              <span class="text-muted">Trader Tier:</span>
              <strong style="color: ${tier.color};">${tier.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="text-muted">Total XP:</span>
              <strong class="font-mono text-cyan">${window.ArthashalaServices.gamification.getXP()} XP</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="text-muted">Active Streak:</span>
              <strong class="text-amber">${window.ArthashalaServices.gamification.getStreak()} Days 🔥</strong>
            </div>
          </div>

          <!-- Account Actions & Logout -->
          <div style="margin-top: 24px; border-top: 1px solid var(--border-subtle); padding-top: 16px; display: flex; flex-direction: column; gap: 10px;">
            <button class="btn btn-secondary" style="width: 100%;" onclick="window.ArthashalaComponents.auth.openModal('phone', 'signin')">
              ⇄ Switch / Log In to Another Account
            </button>
            <button class="btn btn-danger" style="width: 100%;" onclick="window.ArthashalaApp.resetVirtualAccount()">
              ↺ Reset Simulator Balance (₹10,00,000)
            </button>
            <button class="btn" style="width: 100%; background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); color: var(--rose); cursor: pointer;" onclick="window.ArthashalaApp.handleLogout()">
              🚪 Log Out of Wealth Signal
            </button>
          </div>
        </div>

        <!-- Badges & Achievements -->
        <div class="card">
          <div class="card-header"><div class="card-title">Unlocked Trader Badges & Milestones</div></div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
            ${badges.map(b => `
              <div class="card" style="background: var(--bg-surface); opacity: ${b.unlocked ? '1' : '0.45'};">
                <div style="font-size: 28px; margin-bottom: 6px;">${b.icon}</div>
                <div style="font-size: 13px; font-weight: 700; color: #fff;">${b.name}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin: 4px 0 8px;">${b.description}</div>
                <div style="font-size: 10px; color: ${b.unlocked ? 'var(--emerald)' : 'var(--text-muted)'}; font-weight: 600;">
                  ${b.unlocked ? `Unlocked (${b.date})` : 'Locked'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 12. ADMIN VIEW (Market Simulation Controls & Event Injection)
  function renderAdminView() {
    const container = document.getElementById("view-admin");
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Platform Admin & Market Engine Controls</h2>
        <p class="text-muted" style="font-size: 13px;">Control market volatility, simulate macro shocks, and monitor simulated order traffic.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        <!-- Shock Simulation -->
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Inject Simulated Market Macro Event</div></div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn btn-secondary" onclick="window.ArthashalaServices.marketFeed.injectShock(2.5, 'Union Budget: Pro-growth capital expenditure surge (+2.5%)'); window.ArthashalaApp.notifyShock('Budget Rally +2.5%');">
              🚀 Bullish Union Budget Rally (+2.5%)
            </button>
            <button class="btn btn-secondary" onclick="window.ArthashalaServices.marketFeed.injectShock(-2.2, 'RBI MPC Surprise: +50 bps emergency rate hike (-2.2%)'); window.ArthashalaApp.notifyShock('Rate Hike -2.2%');">
              🔻 RBI Emergency Rate Hike (-2.2%)
            </button>
            <button class="btn btn-secondary" onclick="window.ArthashalaServices.marketFeed.injectShock(4.0, 'Global Commodity Rally: Crude Oil spikes on supply disruptions'); window.ArthashalaApp.notifyShock('Commodity Shock +4.0%');">
              🛢️ Global Energy Spike (+4.0%)
            </button>
          </div>
        </div>

        <!-- Tick Speed -->
        <div class="card">
          <div class="card-header"><div class="card-title">⏱️ Market Tick Speed</div></div>
          <p class="text-secondary" style="font-size: 13px; margin-bottom: 16px;">
            Adjust real-time price fluctuation frequency for high-density intraday practice.
          </p>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaServices.marketFeed.start(500); window.ArthashalaApp.showToast('Tick speed set to Fast (500ms)');">
              Fast (500ms)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaServices.marketFeed.start(1500); window.ArthashalaApp.showToast('Tick speed set to Normal (1.5s)');">
              Normal (1.5s)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.ArthashalaServices.marketFeed.stop(); window.ArthashalaApp.showToast('Market ticks paused');">
              Pause Ticks
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Global Event Hooks ---
  window.ArthashalaApp = {
    navigate: navigate,
    showToast: showToast,
    openInSimulator: function(symbol) {
      activeSimulatorSymbol = symbol;
      navigate("simulator");
    },
    changeSimulatorSymbol: function(symbol) {
      activeSimulatorSymbol = symbol;
      if (simChartMode === "TRADINGVIEW" && simTvChartInstance) {
        simTvChartInstance.setSymbol(symbol);
      } else if (activeChartInstance) {
        activeChartInstance.setSymbol(symbol);
      }
      const market = window.ArthashalaData.markets.find(m => m.symbol === symbol);
      if (market) {
        const pEl = document.getElementById("terminal-live-price");
        if (pEl) pEl.innerText = formatINR(market.price);
        const qEl = document.getElementById("order-qty-input");
        if (qEl) qEl.value = market.lotSize;
        calculateOrderMargin();
      }
    },
    toggleSimChartMode: function(mode) {
      simChartMode = mode;
      renderSimulatorView();
    },
    selectMarketsChart: function(symbol) {
      activeMarketsChartSymbol = symbol;
      const activeMarket = window.ArthashalaData.markets.find(m => m.symbol === symbol) || window.ArthashalaData.markets[0];
      const titleEl = document.getElementById("station-symbol-title");
      if (titleEl) titleEl.innerText = `${activeMarket.symbol} — ${activeMarket.name}`;
      const priceEl = document.getElementById("station-live-price");
      if (priceEl) priceEl.innerText = formatINR(activeMarket.price);
      const diff = activeMarket.price - activeMarket.prevClose;
      const pct = activeMarket.prevClose ? (diff / activeMarket.prevClose) * 100 : 0;
      const pctEl = document.getElementById("station-live-pct");
      if (pctEl) {
        pctEl.innerText = `${diff >= 0 ? '▲ +' : '▼ '}${pct.toFixed(2)}%`;
        pctEl.className = `font-mono ${diff >= 0 ? 'text-emerald' : 'text-rose'}`;
      }
      document.querySelectorAll(".tv-quick-pills .tv-pill-item").forEach(btn => {
        btn.classList.toggle("active", btn.innerText.trim() === symbol);
      });
      if (marketsTvChartInstance) {
        marketsTvChartInstance.setSymbol(symbol);
      } else if (window.ArthashalaComponents && window.ArthashalaComponents.TradingViewChart) {
        marketsTvChartInstance = window.ArthashalaComponents.TradingViewChart("markets-tv-chart-box", {
          symbol: symbol,
          interval: "D",
          height: 520
        });
      }
      const station = document.querySelector(".tv-chart-station");
      if (station) {
        station.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    setChartTimeframe: function(tf) {
      document.querySelectorAll(".chart-controls-group .pill-btn").forEach(b => {
        if (["1m", "5m", "15m", "1D"].includes(b.innerText)) {
          b.classList.toggle("active", b.innerText === tf);
        }
      });
      if (activeChartInstance) activeChartInstance.setTimeframe(tf);
    },
    toggleIndicator: function(ind) {
      const btnMap = {
        EMA9: "btn-toggle-ema9",
        EMA21: "btn-toggle-ema21",
        BOLLINGER: "btn-toggle-bb",
        RSI: "btn-toggle-rsi"
      };
      const btn = document.getElementById(btnMap[ind]);
      if (btn) {
        const isActive = btn.classList.toggle("active");
        if (activeChartInstance) activeChartInstance.toggleIndicator(ind, isActive);
      }
    },
    setOrderProduct: function(prod) {
      activeOrderProduct = prod;
      document.querySelectorAll(".product-tabs .tab-pill").forEach(p => {
        p.classList.toggle("active", p.innerText.includes(prod));
      });
      calculateOrderMargin();
    },
    setOrderType: function(type) {
      activeOrderType = type;
      document.querySelectorAll(".order-type-tabs .tab-pill").forEach(p => {
        p.classList.toggle("active", p.innerText.includes(type === "MARKET" ? "Market" : "Limit"));
      });
      const group = document.getElementById("limit-price-group");
      if (group) group.style.display = type === "LIMIT" ? "block" : "none";
      calculateOrderMargin();
    },
    calculateOrderMargin: calculateOrderMargin,
    calculateRR: calculateRR,
    submitOrder: function(side) {
      try {
        const qty = parseInt(document.getElementById("order-qty-input").value, 10);
        const limitPrice = document.getElementById("order-limit-price-input") ? document.getElementById("order-limit-price-input").value : null;
        const sl = document.getElementById("order-sl-input") ? document.getElementById("order-sl-input").value : null;
        const target = document.getElementById("order-target-input") ? document.getElementById("order-target-input").value : null;

        const res = window.ArthashalaServices.simulator.placeOrder({
          symbol: activeSimulatorSymbol,
          product: activeOrderProduct,
          side: side,
          type: activeOrderType,
          quantity: qty,
          price: limitPrice,
          stopLoss: sl,
          target: target
        });

        showToast(res.message, "✓");
        updateGlobalHeader();
        renderSimulatorView();
      } catch (err) {
        alert(err.message);
      }
    },
    closePosition: function(posId) {
      const res = window.ArthashalaServices.simulator.closePosition(posId);
      if (res) {
        showToast(`Squared off position on ${res.symbol}. P&L: ${formatINR(res.pnl)}`, "⚡");
        updateGlobalHeader();
        renderSimulatorView();
      }
    },
    cancelOrder: function(ordId) {
      if (window.ArthashalaServices.simulator.cancelOrder(ordId)) {
        showToast("Cancelled pending limit order", "✕");
        renderSimulatorView();
      }
    },
    switchTerminalTab: function(tabName) {
      ["positions", "orders", "history"].forEach(t => {
        document.getElementById(`terminal-tab-${t}`).style.display = (t === tabName) ? "block" : "none";
        document.getElementById(`tab-${t}-btn`).classList.toggle("active", t === tabName);
      });
    },
    filterMarkets: function(cat) {
      renderMarketsView(cat);
    },
    executeBacktest: function() {
      const strat = document.getElementById("bt-strategy-select").value;
      const sym = document.getElementById("bt-symbol-select").value;
      const per = document.getElementById("bt-period-select").value;
      const sl = parseFloat(document.getElementById("bt-sl-input").value) || 2.0;
      const tg = parseFloat(document.getElementById("bt-target-input").value) || 5.0;

      const res = window.ArthashalaServices.backtest.run({
        strategy: strat,
        symbol: sym,
        period: per,
        stopLossPct: sl,
        targetPct: tg
      });

      document.getElementById("backtest-results-container").innerHTML = renderBacktestResultsHTML(res);
      drawBacktestEquityCurve(res);
      showToast(`Backtested ${strat} on ${sym}`, "🔬");
      updateGlobalHeader();
    },
    openTrackDetails: function(trackId) {
      const track = window.ArthashalaData.academyTracks.find(t => t.id === trackId);
      if (!track) return;

      const container = document.getElementById("academy-active-lesson-container");
      if (!container) return;

      container.innerHTML = `
        <div class="card" style="margin-top: 24px; border-top: 3px solid var(--cyan);">
          <div class="card-header">
            <div class="card-title">${track.icon} ${track.title}</div>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('academy-active-lesson-container').innerHTML=''">Close</button>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${track.modules.map((m, idx) => `
              <div class="card" style="background: var(--bg-surface);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h4 style="font-size: 15px; font-weight: 700; color: #fff;">Module ${idx + 1}: ${m.title}</h4>
                  <span class="badge-tag" style="background: var(--cyan-dim); color: var(--cyan); padding: 2px 8px; border-radius: 4px; font-size: 11px;">+${m.xp} XP</span>
                </div>

                <div style="font-size: 13.5px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; margin-bottom: 16px;">
                  ${m.content}
                </div>

                <!-- Interactive Quiz -->
                <div class="quiz-box">
                  <div class="quiz-question">📝 Knowledge Check: ${m.quiz.question}</div>
                  <div id="quiz-options-${m.id}">
                    ${m.quiz.options.map((opt, oIdx) => `
                      <div class="quiz-option" onclick="window.ArthashalaApp.answerQuiz('${m.id}', ${oIdx}, ${m.quiz.correct}, '${m.quiz.explanation.replace(/'/g, "\\'")}', ${m.xp})">
                        <span>${String.fromCharCode(65 + oIdx)}.</span> <span>${opt}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div id="quiz-explanation-${m.id}" style="display: none;" class="quiz-explanation"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.scrollIntoView({ behavior: "smooth" });
    },
    answerQuiz: function(modId, selectedIdx, correctIdx, explanation, xp) {
      const parent = document.getElementById(`quiz-options-${modId}`);
      const explBox = document.getElementById(`quiz-explanation-${modId}`);
      if (!parent || !explBox) return;

      const options = parent.querySelectorAll(".quiz-option");
      options.forEach((opt, idx) => {
        opt.onclick = null; // freeze
        if (idx === correctIdx) opt.classList.add("correct");
        else if (idx === selectedIdx) opt.classList.add("wrong");
      });

      explBox.style.display = "block";
      if (selectedIdx === correctIdx) {
        explBox.innerHTML = `<strong>✅ Correct! (+${xp} XP)</strong><br />${explanation}`;
        window.ArthashalaServices.gamification.addXP(xp, "Passed Academy Quiz");
        updateGlobalHeader();
      } else {
        explBox.innerHTML = `<strong>❌ Incorrect.</strong><br />${explanation}`;
      }
    },
    submitAiQuery: function(query) {
      document.getElementById("ai-query-input").value = query;
      this.handleAiInputSubmit();
    },
    handleAiInputSubmit: function() {
      const input = document.getElementById("ai-query-input");
      if (!input || !input.value.trim()) return;

      const query = input.value.trim();
      input.value = "";
      window.ArthashalaServices.aiTutor.ask(query);
      renderFinanceAIView();
      updateGlobalHeader();
    },
    toggleHinglish: function(enabled) {
      window.ArthashalaServices.aiTutor.setHinglish(enabled);
      showToast(enabled ? "Hinglish mode enabled 🇮🇳" : "Standard English mode", "🌐");
    },
    clearAiChat: function() {
      window.ArthashalaServices.aiTutor.clearHistory();
      renderFinanceAIView();
    },
    calcPositionSize: function() {
      const cap = parseFloat(document.getElementById("calc-cap").value) || 0;
      const riskPct = parseFloat(document.getElementById("calc-risk-pct").value) || 1;
      const entry = parseFloat(document.getElementById("calc-entry").value) || 0;
      const sl = parseFloat(document.getElementById("calc-sl").value) || 0;

      const maxLoss = cap * (riskPct / 100);
      const slDistance = Math.abs(entry - sl);
      const qty = slDistance > 0 ? Math.floor(maxLoss / slDistance) : 0;
      const totalDeploy = qty * entry;

      document.getElementById("calc-result-qty").innerText = `${qty.toLocaleString('en-IN')} Shares`;
      document.getElementById("calc-result-sub").innerHTML = `
        <span>Max Rupee Risk: <strong>${formatINR(maxLoss)} (${riskPct}%)</strong></span>
        <span>Total Capital: <strong>${formatINR(totalDeploy)}</strong></span>
      `;
    },
    calcFO: function() {
      const sym = document.getElementById("calc-fo-symbol").value;
      const lots = parseInt(document.getElementById("calc-fo-lots").value, 10) || 1;
      const lotSize = sym === "NIFTY" ? 25 : sym === "BANKNIFTY" ? 15 : sym === "FINNIFTY" ? 25 : 250;
      const totalUnits = lots * lotSize;

      document.getElementById("fo-total-qty").innerText = `${totalUnits} Units (${lots} Lots)`;
      document.getElementById("fo-point-val").innerText = formatINR(totalUnits * 10);
      document.getElementById("fo-margin").innerText = formatINR(totalUnits * 2500);
    },
    openNewJournalEntryModal: function() {
      const notes = prompt("Enter your trading reflection / notes:");
      if (notes) {
        window.ArthashalaServices.journal.addEntry({
          symbol: activeSimulatorSymbol,
          setup: "Discretionary Price Action",
          outcome: "WIN",
          pnl: 2500,
          pnlPct: 1.5,
          emotion: "Disciplined",
          followedPlan: true,
          respectedSL: true,
          riskBelow2Pct: true,
          notes: notes
        });
        showToast("Logged journal reflection (+40 XP)", "📝");
        renderJournalView();
        updateGlobalHeader();
      }
    },
    resetVirtualAccount: function() {
      if (confirm("Reset simulator balance back to ₹10,00,000? All active virtual positions will be squared off.")) {
        window.ArthashalaServices.simulator.resetAccount();
        showToast("Virtual balance reset to ₹10,00,000", "↺");
        updateGlobalHeader();
        renderProfileView();
      }
    },
    notifyShock: function(eventDesc) {
      showToast(`Macro Shock Injected: ${eventDesc}`, "⚡");
      updateGlobalHeader();
      if (activeRoute === "markets") renderMarketsView();
      if (activeRoute === "simulator") renderSimulatorView();
    },
    toggleUserMenu: function(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById("nav-user-dropdown-menu");
      if (menu) menu.classList.toggle("open");
    },
    handleLogout: function() {
      if (confirm("Are you sure you want to sign out of Wealth Signal?")) {
        const menu = document.getElementById("nav-user-dropdown-menu");
        if (menu) menu.classList.remove("open");
        if (window.ArthashalaServices.auth) {
          window.ArthashalaServices.auth.logout();
        }
        showToast("Signed out successfully", "🚪");
        updateGlobalHeader();
        navigate("home");
      }
    }
  };

  // Close user dropdown menu when clicking anywhere else
  document.addEventListener("click", e => {
    const menu = document.getElementById("nav-user-dropdown-menu");
    const chipBtn = document.getElementById("nav-user-chip-btn");
    if (menu && menu.classList.contains("open")) {
      if (!menu.contains(e.target) && (!chipBtn || !chipBtn.contains(e.target))) {
        menu.classList.remove("open");
      }
    }
  });

  // Subscribe to real-time market ticks
  window.ArthashalaServices.marketFeed.subscribe(data => {
    if (data.type === "ticks") {
      // Update simulator live price if current symbol ticked
      const currentTick = data.items.find(m => m.symbol === activeSimulatorSymbol);
      if (currentTick) {
        const pEl = document.getElementById("terminal-live-price");
        if (pEl) pEl.innerText = formatINR(currentTick.price);
        if (activeChartInstance) activeChartInstance.updateLiveTick(currentTick.price);
      }
      updateGlobalHeader();
    }
  });

  // Listen to auth state changes
  if (window.ArthashalaServices.auth) {
    window.ArthashalaServices.auth.onAuthStateChanged(() => {
      updateGlobalHeader();
      if (activeRoute === "profile") renderProfileView();
    });
  }

  // Init application on load
  document.addEventListener("DOMContentLoaded", () => {
    initTickerTape();
    updateGlobalHeader();
    navigate("home");
  });
})();
