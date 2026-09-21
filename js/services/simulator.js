// Arthashala Virtual Market Simulator - Order Matching, Position Tracking & P&L Engine
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_BALANCE = "arthashala_sim_balance";
  const STORAGE_KEY_POSITIONS = "arthashala_sim_positions";
  const STORAGE_KEY_ORDERS = "arthashala_sim_orders";
  const STORAGE_KEY_HISTORY = "arthashala_sim_history";
  const INITIAL_BALANCE = 1000000; // ₹10,00,000 virtual money

  let balance = parseFloat(localStorage.getItem(STORAGE_KEY_BALANCE)) || INITIAL_BALANCE;
  let positions = JSON.parse(localStorage.getItem(STORAGE_KEY_POSITIONS)) || [
    // Realistic default demo positions for rich first-time experience
    {
      id: "pos-demo-1",
      symbol: "RELIANCE",
      product: "CNC", // Delivery
      side: "BUY",
      quantity: 50,
      avgPrice: 2920.00,
      currentPrice: 2980.50,
      target: 3100.00,
      stopLoss: 2850.00,
      timestamp: Date.now() - 86400000 * 3
    },
    {
      id: "pos-demo-2",
      symbol: "TATAMOTORS",
      product: "MIS", // Intraday
      side: "BUY",
      quantity: 100,
      avgPrice: 1015.00,
      currentPrice: 1045.60,
      target: 1080.00,
      stopLoss: 990.00,
      timestamp: Date.now() - 3600000 * 2
    },
    {
      id: "pos-demo-3",
      symbol: "GOLD",
      product: "MIS",
      side: "BUY",
      quantity: 2,
      avgPrice: 72100.00,
      currentPrice: 72450.00,
      target: 73000.00,
      stopLoss: 71800.00,
      timestamp: Date.now() - 3600000 * 4
    }
  ];

  let orders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || [
    {
      id: "ord-demo-1",
      symbol: "HDFCBANK",
      product: "CNC",
      side: "BUY",
      type: "LIMIT",
      quantity: 100,
      price: 1610.00,
      status: "PENDING",
      timestamp: Date.now() - 3600000
    }
  ];

  let tradeHistory = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [
    {
      id: "hist-1",
      symbol: "TCS",
      product: "CNC",
      side: "BUY",
      quantity: 40,
      buyPrice: 4210.00,
      sellPrice: 4320.00,
      pnl: 4400.00,
      pnlPct: 2.61,
      closedAt: Date.now() - 86400000 * 5,
      reason: "Post-earnings breakout above 20 EMA resistance"
    },
    {
      id: "hist-2",
      symbol: "BANKNIFTY",
      product: "MIS",
      side: "BUY",
      quantity: 30,
      buyPrice: 50800.00,
      sellPrice: 51250.00,
      pnl: 13500.00,
      pnlPct: 0.88,
      closedAt: Date.now() - 86400000 * 2,
      reason: "RBI MPC dovish commentary reaction"
    },
    {
      id: "hist-3",
      symbol: "INFY",
      product: "MIS",
      side: "SELL", // Short
      quantity: 100,
      buyPrice: 1910.00,
      sellPrice: 1935.00,
      pnl: -2500.00,
      pnlPct: -1.30,
      closedAt: Date.now() - 86400000 * 1,
      reason: "Hit Stop Loss after false breakdown"
    }
  ];

  function saveState() {
    localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(tradeHistory));
  }

  window.ArthashalaServices.simulator = {
    getBalance: function() {
      return balance;
    },
    getPositions: function() {
      return positions;
    },
    getOrders: function() {
      return orders;
    },
    getTradeHistory: function() {
      return tradeHistory;
    },

    // Calculate total portfolio value including unrealized P&L
    getPortfolioSummary: function() {
      let investedMargin = 0;
      let unrealizedPnl = 0;
      let totalCurrentValue = 0;

      positions.forEach(pos => {
        const item = window.ArthashalaData.markets.find(m => m.symbol === pos.symbol);
        const ltp = item ? item.price : pos.currentPrice;
        pos.currentPrice = ltp;
        
        const priceDiff = pos.side === "BUY" ? (ltp - pos.avgPrice) : (pos.avgPrice - ltp);
        const pnl = priceDiff * pos.quantity;
        pos.unrealizedPnl = pnl;
        pos.pnlPct = (priceDiff / pos.avgPrice) * 100;

        const positionValue = pos.avgPrice * pos.quantity;
        const marginRequired = pos.product === "MIS" ? positionValue / 5 : positionValue;
        investedMargin += marginRequired;
        unrealizedPnl += pnl;
        totalCurrentValue += positionValue + pnl;
      });

      const netWorth = balance + investedMargin + unrealizedPnl;
      const totalGain = netWorth - INITIAL_BALANCE;
      const totalReturnPct = (totalGain / INITIAL_BALANCE) * 100;

      return {
        initialCapital: INITIAL_BALANCE,
        availableCash: balance,
        investedMargin: investedMargin,
        unrealizedPnl: unrealizedPnl,
        netWorth: netWorth,
        totalGain: totalGain,
        totalReturnPct: totalReturnPct,
        activePositionsCount: positions.length,
        pendingOrdersCount: orders.filter(o => o.status === "PENDING").length
      };
    },

    // Place new order
    placeOrder: function(orderParams) {
      const { symbol, product, side, type, quantity, price, stopLoss, target } = orderParams;
      const market = window.ArthashalaData.markets.find(m => m.symbol === symbol);
      if (!market) throw new Error("Instrument not found");

      const executionPrice = (type === "MARKET") ? market.price : parseFloat(price);
      const totalCost = executionPrice * quantity;
      const marginRequired = (product === "MIS") ? totalCost / 5 : totalCost;

      if (marginRequired > balance) {
        throw new Error(`Insufficient virtual balance. Required: ₹${marginRequired.toLocaleString('en-IN', {maximumFractionDigits: 2})}, Available: ₹${balance.toLocaleString('en-IN', {maximumFractionDigits: 2})}`);
      }

      if (type === "MARKET") {
        // Instant fill
        balance -= marginRequired;
        
        // Check if position already exists in same symbol and product
        const existingPos = positions.find(p => p.symbol === symbol && p.product === product && p.side === side);
        if (existingPos) {
          const totalQty = existingPos.quantity + quantity;
          const weightedPrice = ((existingPos.avgPrice * existingPos.quantity) + (executionPrice * quantity)) / totalQty;
          existingPos.quantity = totalQty;
          existingPos.avgPrice = parseFloat(weightedPrice.toFixed(2));
          if (target) existingPos.target = target;
          if (stopLoss) existingPos.stopLoss = stopLoss;
        } else {
          positions.push({
            id: "pos-" + Date.now(),
            symbol: symbol,
            product: product,
            side: side,
            quantity: quantity,
            avgPrice: executionPrice,
            currentPrice: executionPrice,
            target: target ? parseFloat(target) : null,
            stopLoss: stopLoss ? parseFloat(stopLoss) : null,
            timestamp: Date.now()
          });
        }

        saveState();

        // Award XP for trade execution
        if (window.ArthashalaServices.gamification) {
          window.ArthashalaServices.gamification.addXP(25, `Simulated ${side} order on ${symbol}`);
        }

        return {
          status: "FILLED",
          message: `Executed ${side} ${quantity} ${symbol} at ₹${executionPrice.toFixed(2)}`
        };
      } else {
        // Pending Limit / Stop-Loss Order
        const newOrder = {
          id: "ord-" + Date.now(),
          symbol: symbol,
          product: product,
          side: side,
          type: type,
          quantity: quantity,
          price: parseFloat(price),
          target: target ? parseFloat(target) : null,
          stopLoss: stopLoss ? parseFloat(stopLoss) : null,
          status: "PENDING",
          timestamp: Date.now()
        };
        orders.unshift(newOrder);
        saveState();

        return {
          status: "PENDING",
          message: `Limit Order placed for ${side} ${quantity} ${symbol} @ ₹${price}`
        };
      }
    },

    // Square off / Close Position
    closePosition: function(positionId, reason = "Manual Exit") {
      const posIndex = positions.findIndex(p => p.id === positionId);
      if (posIndex === -1) return false;

      const pos = positions[posIndex];
      const market = window.ArthashalaData.markets.find(m => m.symbol === pos.symbol);
      const exitPrice = market ? market.price : pos.currentPrice;
      
      const priceDiff = pos.side === "BUY" ? (exitPrice - pos.avgPrice) : (pos.avgPrice - exitPrice);
      const pnl = priceDiff * pos.quantity;
      const pnlPct = (priceDiff / pos.avgPrice) * 100;
      const initialMargin = pos.product === "MIS" ? (pos.avgPrice * pos.quantity) / 5 : (pos.avgPrice * pos.quantity);

      // Return margin + P&L to cash balance
      balance += (initialMargin + pnl);

      // Record to history
      const historyEntry = {
        id: "hist-" + Date.now(),
        symbol: pos.symbol,
        product: pos.product,
        side: pos.side,
        quantity: pos.quantity,
        buyPrice: pos.avgPrice,
        sellPrice: exitPrice,
        pnl: parseFloat(pnl.toFixed(2)),
        pnlPct: parseFloat(pnlPct.toFixed(2)),
        closedAt: Date.now(),
        reason: reason
      };
      tradeHistory.unshift(historyEntry);

      // Remove from positions
      positions.splice(posIndex, 1);
      saveState();

      // Check auto-journal addition
      if (window.ArthashalaServices.journal) {
        window.ArthashalaServices.journal.onTradeClosed(historyEntry);
      }

      // Check XP
      if (window.ArthashalaServices.gamification) {
        const bonus = pnl > 0 ? 50 : 20;
        window.ArthashalaServices.gamification.addXP(bonus, `Closed position on ${pos.symbol} (${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(0)})`);
      }

      return historyEntry;
    },

    // Cancel pending order
    cancelOrder: function(orderId) {
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = "CANCELLED";
        orders.splice(idx, 1);
        saveState();
        return true;
      }
      return false;
    },

    // Monitor limit orders and SL/Target triggers on incoming tick
    onPriceUpdate: function(marketList) {
      // 1. Check pending limit orders
      orders.forEach((order, idx) => {
        if (order.status !== "PENDING") return;
        const item = marketList.find(m => m.symbol === order.symbol);
        if (!item) return;

        let shouldFill = false;
        if (order.side === "BUY" && item.price <= order.price) {
          shouldFill = true;
        } else if (order.side === "SELL" && item.price >= order.price) {
          shouldFill = true;
        }

        if (shouldFill) {
          order.status = "FILLED";
          const margin = order.product === "MIS" ? (item.price * order.quantity) / 5 : (item.price * order.quantity);
          if (balance >= margin) {
            balance -= margin;
            positions.push({
              id: "pos-" + Date.now(),
              symbol: order.symbol,
              product: order.product,
              side: order.side,
              quantity: order.quantity,
              avgPrice: item.price,
              currentPrice: item.price,
              target: order.target,
              stopLoss: order.stopLoss,
              timestamp: Date.now()
            });
            orders.splice(idx, 1);
            saveState();
          }
        }
      });

      // 2. Check Stop Loss / Target triggers on open positions
      positions.forEach(pos => {
        const item = marketList.find(m => m.symbol === pos.symbol);
        if (!item) return;

        if (pos.side === "BUY") {
          if (pos.stopLoss && item.price <= pos.stopLoss) {
            this.closePosition(pos.id, "Stop Loss Triggered");
          } else if (pos.target && item.price >= pos.target) {
            this.closePosition(pos.id, "Target Achieved");
          }
        } else if (pos.side === "SELL") {
          if (pos.stopLoss && item.price >= pos.stopLoss) {
            this.closePosition(pos.id, "Stop Loss Triggered");
          } else if (pos.target && item.price <= pos.target) {
            this.closePosition(pos.id, "Target Achieved");
          }
        }
      });
    },

    // Reset account to initial ₹10,00,000
    resetAccount: function(amount = INITIAL_BALANCE) {
      balance = amount;
      positions = [];
      orders = [];
      tradeHistory = [];
      saveState();
      return true;
    }
  };
})();
