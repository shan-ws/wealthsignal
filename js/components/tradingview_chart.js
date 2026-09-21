// Wealth Signal TradingView Live Chart Engine
// Integrates official real-time TradingView technical analysis charts for all markets
window.ArthashalaComponents = window.ArthashalaComponents || {};

(function() {
  /**
   * Helper to build TradingView iframe URL directly if tv.js script is delayed or blocked
   */
  function buildTradingViewIframeUrl(tvSymbol, interval = "D") {
    const params = new URLSearchParams({
      symbol: tvSymbol,
      interval: interval,
      theme: "dark",
      style: "1",
      timezone: "Asia/Kolkata",
      locale: "en",
      toolbar_bg: "#0b0f19",
      enable_publishing: "0",
      hide_side_toolbar: "0",
      allow_symbol_change: "1",
      save_image: "1",
      container_id: "tv_widget",
      studies: "[]"
    });
    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }

  /**
   * Creates an interactive live TradingView chart in the specified container
   * @param {string} containerId - Target HTML element ID
   * @param {Object} options - Configuration options
   */
  window.ArthashalaComponents.TradingViewChart = function(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    let rawSymbol = options.symbol || "NIFTY 50";
    let tvSymbol = window.ArthashalaData.getTradingViewSymbol(rawSymbol);
    let interval = options.interval || "D";
    let height = options.height || "100%";
    let width = options.width || "100%";
    let chartInstance = null;

    function renderWidget() {
      container.innerHTML = "";
      
      const widgetWrapId = `${containerId}-tv-inner-${Math.floor(Math.random() * 100000)}`;
      const widgetWrap = document.createElement("div");
      widgetWrap.id = widgetWrapId;
      widgetWrap.style.width = width;
      widgetWrap.style.height = typeof height === "number" ? `${height}px` : height;
      widgetWrap.style.minHeight = "400px";
      widgetWrap.style.position = "relative";
      widgetWrap.style.borderRadius = "8px";
      widgetWrap.style.overflow = "hidden";
      widgetWrap.style.background = "#0b0f19";
      container.appendChild(widgetWrap);

      // 1. If official TradingView JS library is available on window
      if (window.TradingView && typeof window.TradingView.widget === "function") {
        try {
          chartInstance = new window.TradingView.widget({
            autosize: true,
            symbol: tvSymbol,
            interval: interval,
            timezone: "Asia/Kolkata",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#0b0f19",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: widgetWrapId,
            hide_side_toolbar: false,
            studies: [
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies"
            ],
            withdateranges: true,
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650"
          });
          return;
        } catch (err) {
          console.warn("[TradingView] TV.widget constructor error, falling back to direct embed:", err);
        }
      }

      // 2. Fallback: Direct Responsive Embed iframe
      const iframe = document.createElement("iframe");
      iframe.src = buildTradingViewIframeUrl(tvSymbol, interval);
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.allow = "transparency; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      widgetWrap.appendChild(iframe);
    }

    renderWidget();

    return {
      getSymbol: function() {
        return rawSymbol;
      },
      getTvSymbol: function() {
        return tvSymbol;
      },
      setSymbol: function(newSymbol, newInterval) {
        rawSymbol = newSymbol;
        tvSymbol = window.ArthashalaData.getTradingViewSymbol(newSymbol);
        if (newInterval) interval = newInterval;
        renderWidget();
      },
      setInterval: function(newInterval) {
        interval = newInterval;
        renderWidget();
      },
      destroy: function() {
        if (chartInstance && typeof chartInstance.remove === "function") {
          try { chartInstance.remove(); } catch(e) {}
        }
        container.innerHTML = "";
      }
    };
  };

  /**
   * Opens a sleek fullscreen/modal TradingView Live Chart for deep-dive technical analysis
   */
  window.ArthashalaComponents.openTradingViewModal = function(symbol) {
    let modal = document.getElementById("tradingview-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "tradingview-modal";
      modal.className = "tradingview-modal-backdrop";
      modal.innerHTML = `
        <div class="tradingview-modal-content">
          <div class="tradingview-modal-header">
            <div class="tv-modal-title-group">
              <span class="tv-badge">LIVE TRADINGVIEW</span>
              <h3 id="tv-modal-symbol-name" style="margin: 0; font-size: 18px; font-weight: 800; color: #fff;">NIFTY 50</h3>
              <span class="badge-exchange" id="tv-modal-exchange">NSE</span>
              <span class="tv-modal-price" id="tv-modal-price">₹0.00</span>
              <span class="tv-modal-pct" id="tv-modal-pct">+0.00%</span>
            </div>
            <div class="tv-modal-actions">
              <button class="btn btn-sm btn-primary" id="tv-modal-trade-btn" style="display: flex; align-items: center; gap: 6px;">
                ⚡ Paper Trade in Simulator
              </button>
              <button class="btn-close-modal" id="tv-modal-close-btn" title="Close Chart (Esc)">✕</button>
            </div>
          </div>
          <div class="tradingview-modal-body" id="tv-modal-chart-host">
            <!-- Injected by TradingViewChart -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close handlers
      document.getElementById("tv-modal-close-btn").addEventListener("click", () => {
        window.ArthashalaComponents.closeTradingViewModal();
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          window.ArthashalaComponents.closeTradingViewModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          window.ArthashalaComponents.closeTradingViewModal();
        }
      });
    }

    const market = window.ArthashalaData.markets.find(m => m.symbol === symbol) || 
      { symbol, name: symbol, exchange: "NSE", price: 0, prevClose: 0, category: "indices" };

    const diff = market.price - market.prevClose;
    const pct = market.prevClose ? ((diff / market.prevClose) * 100) : 0;
    const isUp = diff >= 0;

    document.getElementById("tv-modal-symbol-name").innerText = `${market.symbol} — ${market.name || market.symbol}`;
    document.getElementById("tv-modal-exchange").innerText = market.exchange;
    document.getElementById("tv-modal-price").innerText = formatCurrency(market.price);
    
    const pctEl = document.getElementById("tv-modal-pct");
    pctEl.innerText = `${isUp ? '▲ +' : '▼ '}${pct.toFixed(2)}%`;
    pctEl.className = `tv-modal-pct ${isUp ? 'text-emerald' : 'text-rose'}`;

    const tradeBtn = document.getElementById("tv-modal-trade-btn");
    tradeBtn.onclick = function() {
      window.ArthashalaComponents.closeTradingViewModal();
      if (window.ArthashalaApp && typeof window.ArthashalaApp.openInSimulator === "function") {
        window.ArthashalaApp.openInSimulator(market.symbol);
      }
    };

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Initialize chart inside modal
    setTimeout(() => {
      window.ArthashalaComponents.TradingViewChart("tv-modal-chart-host", {
        symbol: market.symbol,
        interval: "D",
        height: "100%"
      });
    }, 50);
  };

  window.ArthashalaComponents.closeTradingViewModal = function() {
    const modal = document.getElementById("tradingview-modal");
    if (modal) {
      modal.classList.remove("active");
      const host = document.getElementById("tv-modal-chart-host");
      if (host) host.innerHTML = "";
    }
    document.body.style.overflow = "";
  };

  function formatCurrency(val) {
    if (typeof val !== "number") return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(val);
  }
})();
