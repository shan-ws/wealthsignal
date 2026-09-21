// Arthashala Pro Interactive Canvas Chart Engine - Multi-timeframe Candlesticks, Overlays & Sub-charts
window.ArthashalaComponents = window.ArthashalaComponents || {};

window.ArthashalaComponents.StockChart = function(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.className = "arthashala-chart-canvas";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let currentSymbol = options.symbol || "NIFTY 50";
  let currentTimeframe = options.timeframe || "1D";
  let chartType = options.type || "CANDLES"; // CANDLES or LINE
  let showEMA9 = true;
  let showEMA21 = true;
  let showBollinger = false;
  let showRSI = true;
  let showVolume = true;

  let candles = [];
  let mousePos = null;

  function initData() {
    candles = window.ArthashalaData.generateCandles(currentSymbol, 70, currentTimeframe);
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 800;
    const height = rect.height || 440;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
    render();
  }

  function calculateSMA(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += data[i - j];
        result.push(sum / period);
      }
    }
    return result;
  }

  function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const result = [];
    let prev = data[0];
    result.push(prev);
    for (let i = 1; i < data.length; i++) {
      const val = (data[i] * k) + (prev * (1 - k));
      result.push(val);
      prev = val;
    }
    return result;
  }

  function calculateBollingerBands(data, period = 20, multiplier = 2) {
    const sma = calculateSMA(data, period);
    const upper = [];
    const lower = [];
    for (let i = 0; i < data.length; i++) {
      if (sma[i] === null) {
        upper.push(null);
        lower.push(null);
      } else {
        let variance = 0;
        for (let j = 0; j < period; j++) variance += Math.pow(data[i - j] - sma[i], 2);
        const stdDev = Math.sqrt(variance / period);
        upper.push(sma[i] + multiplier * stdDev);
        lower.push(sma[i] - multiplier * stdDev);
      }
    }
    return { sma, upper, lower };
  }

  function calculateRSI(data, period = 14) {
    const rsi = new Array(data.length).fill(null);
    if (data.length <= period) return rsi;

    let gain = 0, loss = 0;
    for (let i = 1; i <= period; i++) {
      const diff = data[i] - data[i - 1];
      if (diff >= 0) gain += diff; else loss += Math.abs(diff);
    }
    let avgGain = gain / period;
    let avgLoss = loss / period;

    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i] - data[i - 1];
      const g = diff > 0 ? diff : 0;
      const l = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * (period - 1) + g) / period;
      avgLoss = (avgLoss * (period - 1) + l) / period;
      if (avgLoss === 0) rsi[i] = 100;
      else rsi[i] = 100 - (100 / (1 + (avgGain / avgLoss)));
    }
    return rsi;
  }

  function render() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    // Layout partitioning
    const rsiHeight = showRSI ? 85 : 0;
    const mainHeight = height - rsiHeight - 25; // 25px for bottom time axis
    const mainWidth = width - 65; // 65px for price axis on right

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#0a0e17");
    bgGrad.addColorStop(1, "#070a10");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    if (candles.length === 0) return;

    // Price scaling
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    // Add 3% buffer
    const range = (maxPrice - minPrice) || 1;
    minPrice -= range * 0.03;
    maxPrice += range * 0.03;

    function priceToY(price) {
      return mainHeight - ((price - minPrice) / (maxPrice - minPrice)) * (mainHeight - 20) - 10;
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    const gridSteps = 5;
    for (let g = 0; g <= gridSteps; g++) {
      const y = 10 + (mainHeight - 20) * (g / gridSteps);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mainWidth, y);
      ctx.stroke();

      const priceVal = maxPrice - (g / gridSteps) * (maxPrice - minPrice);
      ctx.fillStyle = "#64748b";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(priceVal > 500 ? priceVal.toFixed(1) : priceVal.toFixed(2), mainWidth + 6, y + 3);
    }

    const candleCount = candles.length;
    const barSpacing = mainWidth / candleCount;
    const candleWidth = Math.max(2, barSpacing * 0.65);

    // Max volume for volume bars
    const maxVol = Math.max(...candles.map(c => c.volume));

    // Bollinger Bands
    const closes = candles.map(c => c.close);
    if (showBollinger) {
      const bb = calculateBollingerBands(closes);
      ctx.beginPath();
      ctx.fillStyle = "rgba(56, 189, 248, 0.05)";
      for (let i = 0; i < candleCount; i++) {
        if (bb.upper[i] !== null) {
          const x = i * barSpacing + barSpacing / 2;
          const yUpper = priceToY(bb.upper[i]);
          if (i === 0) ctx.moveTo(x, yUpper); else ctx.lineTo(x, yUpper);
        }
      }
      for (let i = candleCount - 1; i >= 0; i--) {
        if (bb.lower[i] !== null) {
          const x = i * barSpacing + barSpacing / 2;
          const yLower = priceToY(bb.lower[i]);
          ctx.lineTo(x, yLower);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Draw middle band (20 SMA)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.setLineDash([3, 3]);
      for (let i = 0; i < candleCount; i++) {
        if (bb.sma[i] !== null) {
          const x = i * barSpacing + barSpacing / 2;
          const y = priceToY(bb.sma[i]);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Render Candlesticks or Line
    for (let i = 0; i < candleCount; i++) {
      const c = candles[i];
      const x = i * barSpacing + barSpacing / 2;
      const isUp = c.close >= c.open;
      const bullColor = "#00e599";
      const bearColor = "#f43f5e";
      const barColor = isUp ? bullColor : bearColor;

      // Volume bars at bottom of main chart
      if (showVolume) {
        const volHeight = (c.volume / maxVol) * 45;
        ctx.fillStyle = isUp ? "rgba(0, 229, 153, 0.16)" : "rgba(244, 63, 94, 0.16)";
        ctx.fillRect(x - candleWidth / 2, mainHeight - volHeight, candleWidth, volHeight);
      }

      if (chartType === "CANDLES") {
        // Wick
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, priceToY(c.high));
        ctx.lineTo(x, priceToY(c.low));
        ctx.stroke();

        // Body
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));

        ctx.fillStyle = barColor;
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }
    }

    if (chartType === "LINE") {
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      for (let i = 0; i < candleCount; i++) {
        const x = i * barSpacing + barSpacing / 2;
        const y = priceToY(candles[i].close);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Render EMA 9
    if (showEMA9) {
      const ema9 = calculateEMA(closes, 9);
      ctx.beginPath();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < candleCount; i++) {
        const x = i * barSpacing + barSpacing / 2;
        const y = priceToY(ema9[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Render EMA 21
    if (showEMA21) {
      const ema21 = calculateEMA(closes, 21);
      ctx.beginPath();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < candleCount; i++) {
        const x = i * barSpacing + barSpacing / 2;
        const y = priceToY(ema21[i]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Sub-Chart: RSI (14)
    if (showRSI) {
      const rsiTop = mainHeight + 18;
      const rsiPlotHeight = rsiHeight - 20;

      // Divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, mainHeight + 10);
      ctx.lineTo(width, mainHeight + 10);
      ctx.stroke();

      // RSI labels
      ctx.fillStyle = "#a855f7";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("RSI (14)", 8, rsiTop + 10);

      // Overbought 70 and Oversold 30 levels
      const y70 = rsiTop + rsiPlotHeight * 0.30;
      const y30 = rsiTop + rsiPlotHeight * 0.70;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, y70); ctx.lineTo(mainWidth, y70);
      ctx.moveTo(0, y30); ctx.lineTo(mainWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#64748b";
      ctx.fillText("70", mainWidth + 6, y70 + 3);
      ctx.fillText("30", mainWidth + 6, y30 + 3);

      const rsiValues = calculateRSI(closes, 14);
      ctx.beginPath();
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 1.5;
      let started = false;
      for (let i = 0; i < candleCount; i++) {
        const val = rsiValues[i];
        if (val !== null) {
          const x = i * barSpacing + barSpacing / 2;
          const y = rsiTop + rsiPlotHeight - (val / 100) * rsiPlotHeight;
          if (!started) { ctx.moveTo(x, y); started = true; }
          else { ctx.lineTo(x, y); }
        }
      }
      ctx.stroke();
    }

    // Crosshair & Inspection Tooltip
    if (mousePos && mousePos.x >= 0 && mousePos.x <= mainWidth && mousePos.y >= 0 && mousePos.y <= height) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(mainWidth, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const hoveredIndex = Math.floor(mousePos.x / barSpacing);
      if (hoveredIndex >= 0 && hoveredIndex < candleCount) {
        const c = candles[hoveredIndex];
        const dateStr = c.time.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

        // Tooltip box
        const tipText = `${dateStr} | O: ₹${c.open.toFixed(1)} H: ₹${c.high.toFixed(1)} L: ₹${c.low.toFixed(1)} C: ₹${c.close.toFixed(1)} (Vol: ${c.volume.toLocaleString()})`;
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.fillRect(8, 8, ctx.measureText(tipText).width + 16, 22);
        ctx.strokeRect(8, 8, ctx.measureText(tipText).width + 16, 22);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(tipText, 16, 23);
      }
    }
  }

  // Interactive mouse tracking
  canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    render();
  });

  canvas.addEventListener("mouseleave", function() {
    mousePos = null;
    render();
  });

  window.addEventListener("resize", resize);
  initData();
  setTimeout(resize, 50);

  return {
    setSymbol: function(symbol) {
      currentSymbol = symbol;
      initData();
      render();
    },
    setTimeframe: function(tf) {
      currentTimeframe = tf;
      initData();
      render();
    },
    setChartType: function(type) {
      chartType = type;
      render();
    },
    toggleIndicator: function(indicator, enabled) {
      if (indicator === "EMA9") showEMA9 = enabled;
      if (indicator === "EMA21") showEMA21 = enabled;
      if (indicator === "BOLLINGER") showBollinger = enabled;
      if (indicator === "RSI") { showRSI = enabled; resize(); }
      if (indicator === "VOLUME") showVolume = enabled;
      render();
    },
    updateLiveTick: function(newPrice) {
      if (candles.length > 0) {
        const last = candles[candles.length - 1];
        last.close = newPrice;
        if (newPrice > last.high) last.high = newPrice;
        if (newPrice < last.low) last.low = newPrice;
        render();
      }
    },
    destroy: function() {
      window.removeEventListener("resize", resize);
    }
  };
};
