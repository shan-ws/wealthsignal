// Arthashala Market Feed Service - Real-time tick generator & Level 2 DOM order book
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const subscribers = [];
  let isRunning = true;
  let tickInterval = null;

  // Generate realistic Level 2 Market Depth for active instrument
  function generateDepth(price) {
    const bids = [];
    const asks = [];
    const step = price > 1000 ? 0.50 : price > 100 ? 0.05 : 0.01;

    for (let i = 1; i <= 5; i++) {
      const bidPrice = parseFloat((price - i * step).toFixed(2));
      const bidQty = Math.floor(50 + Math.random() * 850);
      const bidOrders = Math.floor(2 + Math.random() * 15);
      bids.push({ price: bidPrice, qty: bidQty, orders: bidOrders });

      const askPrice = parseFloat((price + i * step).toFixed(2));
      const askQty = Math.floor(50 + Math.random() * 850);
      const askOrders = Math.floor(2 + Math.random() * 15);
      asks.push({ price: askPrice, qty: askQty, orders: askOrders });
    }

    const totalBidQty = bids.reduce((sum, b) => sum + b.qty, 0);
    const totalAskQty = asks.reduce((sum, a) => sum + a.qty, 0);

    return { bids, asks, totalBidQty, totalAskQty };
  }

  // Update market prices with controlled stochastic walk
  function tick() {
    if (!isRunning) return;

    const markets = window.ArthashalaData.markets;
    const updatedSymbols = [];

    // Pick 3-5 random instruments to update per cycle
    const updateCount = Math.floor(3 + Math.random() * 3);
    for (let c = 0; c < updateCount; c++) {
      const index = Math.floor(Math.random() * markets.length);
      const item = markets[index];
      
      const volatility = item.category === "crypto" ? 0.003 : item.category === "indices" ? 0.0006 : 0.0012;
      const changePercent = (Math.random() - 0.495) * volatility;
      const oldPrice = item.price;
      let newPrice = oldPrice * (1 + changePercent);
      
      if (item.symbol === "USDINR" || item.symbol === "EURINR") {
        newPrice = parseFloat(newPrice.toFixed(4));
      } else if (item.price > 1000) {
        newPrice = parseFloat(newPrice.toFixed(2));
      } else {
        newPrice = parseFloat(newPrice.toFixed(2));
      }

      // Keep within reasonable intraday bounds
      if (newPrice > item.high24h) item.high24h = newPrice;
      if (newPrice < item.low24h) item.low24h = newPrice;

      item.price = newPrice;
      const changeValue = item.price - item.prevClose;
      const changePct = (changeValue / item.prevClose) * 100;
      item.changeValue = parseFloat(changeValue.toFixed(2));
      item.changePct = parseFloat(changePct.toFixed(2));
      item.direction = newPrice >= oldPrice ? "up" : "down";
      item.lastTickTime = Date.now();

      updatedSymbols.push(item);
    }

    // Broadcast to listeners
    subscribers.forEach(cb => {
      try {
        cb({ type: "ticks", items: updatedSymbols, allMarkets: markets });
      } catch (err) {
        console.error("Error in market feed subscriber", err);
      }
    });

    // Check stop-loss and limit triggers in simulator
    if (window.ArthashalaServices.simulator) {
      window.ArthashalaServices.simulator.onPriceUpdate(markets);
    }
  }

  window.ArthashalaServices.marketFeed = {
    start: function(speedMs = 1200) {
      if (tickInterval) clearInterval(tickInterval);
      isRunning = true;
      tickInterval = setInterval(tick, speedMs);
    },
    stop: function() {
      isRunning = false;
      if (tickInterval) clearInterval(tickInterval);
    },
    subscribe: function(callback) {
      subscribers.push(callback);
      return function unsubscribe() {
        const idx = subscribers.indexOf(callback);
        if (idx !== -1) subscribers.splice(idx, 1);
      };
    },
    getMarketDepth: function(symbol) {
      const market = window.ArthashalaData.markets.find(m => m.symbol === symbol) || window.ArthashalaData.markets[0];
      return generateDepth(market.price);
    },
    getInstrument: function(symbol) {
      return window.ArthashalaData.markets.find(m => m.symbol === symbol) || window.ArthashalaData.markets[0];
    },
    injectShock: function(percentage, description) {
      // Admin market shock simulation
      window.ArthashalaData.markets.forEach(m => {
        const factor = 1 + (percentage / 100);
        m.price = parseFloat((m.price * factor).toFixed(2));
        m.changeValue = parseFloat((m.price - m.prevClose).toFixed(2));
        m.changePct = parseFloat(((m.changeValue / m.prevClose) * 100).toFixed(2));
      });
      subscribers.forEach(cb => cb({ type: "shock", description, allMarkets: window.ArthashalaData.markets }));
    }
  };

  // Start market feed automatically
  window.ArthashalaServices.marketFeed.start();
})();
