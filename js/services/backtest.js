// Arthashala Strategy Backtesting Lab - Algorithmic Simulation & Historical Metrics
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  window.ArthashalaServices.backtest = {
    run: function(params) {
      const {
        strategy = "EMA_CROSSOVER",
        symbol = "NIFTY 50",
        period = "1Y", // 6M, 1Y, 3Y
        stopLossPct = 2.0,
        targetPct = 5.0,
        initialCapital = 1000000
      } = params;

      const barCount = period === "6M" ? 130 : period === "1Y" ? 252 : 756;
      const candles = window.ArthashalaData.generateCandles(symbol, barCount, "1D");
      
      const trades = [];
      let inPosition = false;
      let currentTrade = null;
      let capital = initialCapital;
      const equityCurve = [{ date: candles[0].time.toLocaleDateString('en-IN'), equity: capital, benchmark: capital }];
      let benchmarkCapital = initialCapital;
      const startPrice = candles[0].close;

      // Calculate indicators
      // 1. Moving Averages
      const emaShort = calculateEMA(candles.map(c => c.close), 9);
      const emaLong = calculateEMA(candles.map(c => c.close), 21);
      const rsi = calculateRSI(candles.map(c => c.close), 14);

      // Loop through historical bars
      for (let i = 25; i < candles.length; i++) {
        const bar = candles[i];
        const prevBar = candles[i - 1];
        
        // Track benchmark (Buy & Hold)
        benchmarkCapital = initialCapital * (bar.close / startPrice);

        // Check exit if in position
        if (inPosition) {
          const entryPrice = currentTrade.entryPrice;
          const returnPct = ((bar.close - entryPrice) / entryPrice) * 100;
          let exitReason = null;

          if (returnPct <= -stopLossPct) {
            exitReason = "Stop Loss Hit";
          } else if (returnPct >= targetPct) {
            exitReason = "Target Reached";
          } else if (strategy === "EMA_CROSSOVER" && emaShort[i] < emaLong[i] && emaShort[i - 1] >= emaLong[i - 1]) {
            exitReason = "Bearish EMA Cross";
          } else if (strategy === "RSI_MEAN_REVERSION" && rsi[i] >= 70) {
            exitReason = "RSI Overbought (>70)";
          }

          if (exitReason || i === candles.length - 1) {
            const exitPrice = bar.close;
            const finalPnlPct = ((exitPrice - entryPrice) / entryPrice) * 100;
            const pnlRupees = (currentTrade.positionValue * (finalPnlPct / 100));
            capital += pnlRupees;

            trades.push({
              id: "bt-trade-" + trades.length,
              entryDate: currentTrade.entryDate,
              exitDate: bar.time.toLocaleDateString('en-IN'),
              symbol: symbol,
              side: "BUY",
              entryPrice: entryPrice,
              exitPrice: exitPrice,
              pnlPct: parseFloat(finalPnlPct.toFixed(2)),
              pnlRupees: Math.round(pnlRupees),
              reason: exitReason || "Period End Close",
              rMultiple: parseFloat((finalPnlPct / stopLossPct).toFixed(2))
            });

            inPosition = false;
            currentTrade = null;
          }
        }

        // Check entry conditions if not in position
        if (!inPosition && i < candles.length - 1) {
          let shouldBuy = false;
          let signalNote = "";

          if (strategy === "EMA_CROSSOVER") {
            // 9 EMA crosses above 21 EMA
            if (emaShort[i] > emaLong[i] && emaShort[i - 1] <= emaLong[i - 1]) {
              shouldBuy = true;
              signalNote = "9/21 EMA Bullish Crossover";
            }
          } else if (strategy === "RSI_MEAN_REVERSION") {
            // RSI turns up from oversold (<30)
            if (rsi[i] > 30 && rsi[i - 1] <= 30) {
              shouldBuy = true;
              signalNote = "RSI Reversal from Oversold";
            }
          } else if (strategy === "BREAKOUT_20D") {
            // 20-day high breakout
            const last20Highs = candles.slice(i - 20, i).map(c => c.high);
            const highest20 = Math.max(...last20Highs);
            if (bar.close > highest20) {
              shouldBuy = true;
              signalNote = "20-Day High Breakout";
            }
          } else if (strategy === "SUPERTREND") {
            // Supertrend proxy (Close above 21 EMA + positive momentum)
            if (bar.close > emaLong[i] && prevBar.close <= emaLong[i - 1] && rsi[i] > 50) {
              shouldBuy = true;
              signalNote = "Supertrend Trend Flip";
            }
          }

          if (shouldBuy) {
            inPosition = true;
            // Deploy 50% capital per trade
            const deployValue = capital * 0.5;
            currentTrade = {
              entryDate: bar.time.toLocaleDateString('en-IN'),
              entryPrice: bar.close,
              positionValue: deployValue,
              signalNote: signalNote
            };
          }
        }

        equityCurve.push({
          date: bar.time.toLocaleDateString('en-IN'),
          equity: Math.round(capital),
          benchmark: Math.round(benchmarkCapital)
        });
      }

      // Compute statistics
      const wins = trades.filter(t => t.pnlRupees > 0);
      const losses = trades.filter(t => t.pnlRupees <= 0);
      const totalTrades = trades.length;
      const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
      const netGain = capital - initialCapital;
      const totalReturnPct = (netGain / initialCapital) * 100;
      const benchmarkReturnPct = ((benchmarkCapital - initialCapital) / initialCapital) * 100;

      const grossWins = wins.reduce((sum, t) => sum + t.pnlRupees, 0);
      const grossLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnlRupees, 0));
      const profitFactor = grossLosses > 0 ? (grossWins / grossLosses) : 3.5;

      // Drawdown calculation
      let peak = initialCapital;
      let maxDrawdown = 0;
      equityCurve.forEach(pt => {
        if (pt.equity > peak) peak = pt.equity;
        const dd = ((pt.equity - peak) / peak) * 100;
        if (dd < maxDrawdown) maxDrawdown = dd;
      });

      // Award XP for running backtest
      if (window.ArthashalaServices.gamification) {
        window.ArthashalaServices.gamification.addXP(30, `Backtested ${strategy} on ${symbol}`);
      }

      return {
        strategyName: strategy,
        symbol: symbol,
        period: period,
        totalTrades: totalTrades,
        winRate: parseFloat(winRate.toFixed(1)),
        winCount: wins.length,
        lossCount: losses.length,
        totalReturnPct: parseFloat(totalReturnPct.toFixed(2)),
        benchmarkReturnPct: parseFloat(benchmarkReturnPct.toFixed(2)),
        netProfitRupees: Math.round(netGain),
        profitFactor: parseFloat(profitFactor.toFixed(2)),
        maxDrawdownPct: parseFloat(maxDrawdown.toFixed(2)),
        trades: trades,
        equityCurve: equityCurve
      };
    }
  };

  // Helper technical functions
  function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    const emaArray = [];
    let prevEma = prices[0];
    emaArray.push(prevEma);

    for (let i = 1; i < prices.length; i++) {
      const currentEma = (prices[i] * k) + (prevEma * (1 - k));
      emaArray.push(currentEma);
      prevEma = currentEma;
    }
    return emaArray;
  }

  function calculateRSI(prices, period = 14) {
    const rsiArray = new Array(prices.length).fill(50);
    if (prices.length <= period) return rsiArray;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      if (avgLoss === 0) {
        rsiArray[i] = 100;
      } else {
        const rs = avgGain / avgLoss;
        rsiArray[i] = 100 - (100 / (1 + rs));
      }
    }
    return rsiArray;
  }
})();
