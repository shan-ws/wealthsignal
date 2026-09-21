// Arthashala Market Universe - Indian & Global Assets with realistic market parameters
window.ArthashalaData = window.ArthashalaData || {};

window.ArthashalaData.markets = [
  // --- Indian Indices ---
  {
    symbol: "NIFTY 50",
    tvSymbol: "NSE:NIFTY",
    name: "Nifty 50 Index",
    exchange: "NSE",
    category: "indices",
    sector: "Benchmark",
    price: 24850.40,
    prevClose: 24710.20,
    high24h: 24895.00,
    low24h: 24690.50,
    volume: "18.4M",
    lotSize: 25,
    pe: 22.4,
    marketCap: "₹185.2 Lakh Cr",
    description: "Benchmark Indian stock market index representing the weighted average of 50 of the largest Indian companies listed on the National Stock Exchange.",
    baseHistoricalPrice: 23200
  },
  {
    symbol: "BANKNIFTY",
    tvSymbol: "NSE:BANKNIFTY",
    name: "Nifty Bank Index",
    exchange: "NSE",
    category: "indices",
    sector: "Banking",
    price: 51280.75,
    prevClose: 50940.30,
    high24h: 51420.00,
    low24h: 50890.10,
    volume: "12.8M",
    lotSize: 15,
    pe: 16.8,
    marketCap: "₹48.5 Lakh Cr",
    description: "Index composed of the most liquid and large capitalized Indian banking stocks.",
    baseHistoricalPrice: 48000
  },
  {
    symbol: "SENSEX",
    tvSymbol: "BSE:SENSEX",
    name: "BSE S&P Sensex",
    exchange: "BSE",
    category: "indices",
    sector: "Benchmark",
    price: 81450.60,
    prevClose: 81020.15,
    high24h: 81620.00,
    low24h: 80950.00,
    volume: "9.2M",
    lotSize: 10,
    pe: 23.1,
    marketCap: "₹160.8 Lakh Cr",
    description: "The bellwether index of 30 well-established and financially sound companies listed on BSE.",
    baseHistoricalPrice: 77000
  },
  {
    symbol: "INDIA VIX",
    tvSymbol: "NSE:INDIAVIX",
    name: "India Volatility Index",
    exchange: "NSE",
    category: "indices",
    sector: "Volatility",
    price: 13.82,
    prevClose: 14.25,
    high24h: 14.60,
    low24h: 13.45,
    volume: "—",
    lotSize: 1,
    pe: 0,
    marketCap: "—",
    description: "Measures the market's expectation of 30-day forward looking volatility based on Nifty option prices.",
    baseHistoricalPrice: 14.0
  },

  // --- Large Cap Equities (NSE) ---
  {
    symbol: "RELIANCE",
    tvSymbol: "NSE:RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Energy & Conglomerate",
    price: 2980.50,
    prevClose: 2945.00,
    high24h: 2998.00,
    low24h: 2932.00,
    volume: "5.6M",
    lotSize: 250,
    pe: 28.5,
    marketCap: "₹20.1 Lakh Cr",
    description: "India's largest private sector enterprise spanning oil-to-chemicals, retail, and digital telecommunications (Jio).",
    baseHistoricalPrice: 2650
  },
  {
    symbol: "TCS",
    tvSymbol: "NSE:TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    category: "equities",
    sector: "Information Technology",
    price: 4320.10,
    prevClose: 4290.40,
    high24h: 4350.00,
    low24h: 4275.00,
    volume: "2.1M",
    lotSize: 175,
    pe: 31.2,
    marketCap: "₹15.6 Lakh Cr",
    description: "A global leader in IT services, consulting, and business solutions with industry-leading margins.",
    baseHistoricalPrice: 3800
  },
  {
    symbol: "HDFCBANK",
    tvSymbol: "NSE:HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Banking & Financials",
    price: 1640.25,
    prevClose: 1658.00,
    high24h: 1662.00,
    low24h: 1632.50,
    volume: "14.2M",
    lotSize: 550,
    pe: 18.9,
    marketCap: "₹12.4 Lakh Cr",
    description: "India's largest private sector bank following its historic merger with housing financier HDFC.",
    baseHistoricalPrice: 1510
  },
  {
    symbol: "INFY",
    tvSymbol: "NSE:INFY",
    name: "Infosys Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Information Technology",
    price: 1890.75,
    prevClose: 1865.20,
    high24h: 1905.00,
    low24h: 1858.00,
    volume: "6.8M",
    lotSize: 400,
    pe: 27.4,
    marketCap: "₹7.8 Lakh Cr",
    description: "Digital services and next-generation consulting company operating in over 56 countries.",
    baseHistoricalPrice: 1620
  },
  {
    symbol: "TATAMOTORS",
    tvSymbol: "NSE:TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Automobile",
    price: 1045.60,
    prevClose: 1002.30,
    high24h: 1054.00,
    low24h: 998.00,
    volume: "11.4M",
    lotSize: 1425,
    pe: 17.6,
    marketCap: "₹3.8 Lakh Cr",
    description: "Pioneer in Indian commercial and passenger electric vehicles, alongside luxury subsidiary Jaguar Land Rover.",
    baseHistoricalPrice: 820
  },
  {
    symbol: "ICICIBANK",
    tvSymbol: "NSE:ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Banking & Financials",
    price: 1220.30,
    prevClose: 1210.00,
    high24h: 1228.00,
    low24h: 1205.50,
    volume: "9.7M",
    lotSize: 700,
    pe: 19.4,
    marketCap: "₹8.5 Lakh Cr",
    description: "Leading private sector bank recognized for superior return on assets (RoA) and digital leadership.",
    baseHistoricalPrice: 1080
  },
  {
    symbol: "ITC",
    tvSymbol: "NSE:ITC",
    name: "ITC Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "FMCG",
    price: 495.80,
    prevClose: 498.20,
    high24h: 501.50,
    low24h: 492.00,
    volume: "10.3M",
    lotSize: 1600,
    pe: 29.1,
    marketCap: "₹6.1 Lakh Cr",
    description: "Diversified FMCG powerhouse with businesses in branded packaged foods, hospitality, paperboards, and agri-business.",
    baseHistoricalPrice: 420
  },
  {
    symbol: "LT",
    tvSymbol: "NSE:LT",
    name: "Larsen & Toubro Ltd",
    exchange: "NSE",
    category: "equities",
    sector: "Infrastructure & Capital Goods",
    price: 3680.00,
    prevClose: 3640.50,
    high24h: 3710.00,
    low24h: 3625.00,
    volume: "1.9M",
    lotSize: 150,
    pe: 34.8,
    marketCap: "₹5.0 Lakh Cr",
    description: "India's premier engineering, procurement, and construction conglomerate, central to nation-building infrastructure.",
    baseHistoricalPrice: 3200
  },

  // --- Commodities (MCX) ---
  {
    symbol: "GOLD",
    tvSymbol: "MCX:GOLD1!",
    name: "MCX Gold 1kg (10g)",
    exchange: "MCX",
    category: "commodities",
    sector: "Precious Metals",
    price: 72450.00,
    prevClose: 72120.00,
    high24h: 72680.00,
    low24h: 72050.00,
    volume: "8.4K Lots",
    lotSize: 1,
    pe: 0,
    marketCap: "—",
    description: "Gold futures traded on Multi Commodity Exchange of India (MCX) in INR per 10 grams.",
    baseHistoricalPrice: 65000
  },
  {
    symbol: "SILVER",
    tvSymbol: "MCX:SILVER1!",
    name: "MCX Silver 30kg (1kg)",
    exchange: "MCX",
    category: "commodities",
    sector: "Precious Metals",
    price: 84200.00,
    prevClose: 83500.00,
    high24h: 84800.00,
    low24h: 83100.00,
    volume: "14.2K Lots",
    lotSize: 1,
    pe: 0,
    marketCap: "—",
    description: "Silver futures traded on MCX per 1 kilogram.",
    baseHistoricalPrice: 74000
  },
  {
    symbol: "CRUDEOIL",
    tvSymbol: "MCX:CRUDEOIL1!",
    name: "MCX Crude Oil (100 bbl)",
    exchange: "MCX",
    category: "commodities",
    sector: "Energy",
    price: 6420.00,
    prevClose: 6510.00,
    high24h: 6540.00,
    low24h: 6385.00,
    volume: "45.1K Lots",
    lotSize: 100,
    pe: 0,
    marketCap: "—",
    description: "WTI Crude Oil futures contract settled in INR per barrel.",
    baseHistoricalPrice: 6100
  },

  // --- Forex (INR Pairs) ---
  {
    symbol: "USDINR",
    tvSymbol: "FX_IDC:USDINR",
    name: "US Dollar / Indian Rupee",
    exchange: "NSE-CDS",
    category: "forex",
    sector: "Currencies",
    price: 83.94,
    prevClose: 83.91,
    high24h: 83.98,
    low24h: 83.89,
    volume: "1.2M",
    lotSize: 1000,
    pe: 0,
    marketCap: "—",
    description: "USD to INR exchange rate reflecting macro bilateral trade and RBI foreign exchange intervention.",
    baseHistoricalPrice: 83.1
  },
  {
    symbol: "EURINR",
    tvSymbol: "FX_IDC:EURINR",
    name: "Euro / Indian Rupee",
    exchange: "NSE-CDS",
    category: "forex",
    sector: "Currencies",
    price: 92.45,
    prevClose: 92.15,
    high24h: 92.65,
    low24h: 92.05,
    volume: "480K",
    lotSize: 1000,
    pe: 0,
    marketCap: "—",
    description: "EUR to INR currency cross traded on NSE Currency Derivatives segment.",
    baseHistoricalPrice: 90.5
  },

  // --- Crypto (INR pairs) ---
  {
    symbol: "BTCINR",
    tvSymbol: "BINANCE:BTCUSDT",
    name: "Bitcoin / INR",
    exchange: "Crypto-Sim",
    category: "crypto",
    sector: "Digital Assets",
    price: 5240000.00,
    prevClose: 5120000.00,
    high24h: 5310000.00,
    low24h: 5080000.00,
    volume: "1.8K BTC",
    lotSize: 0.001,
    pe: 0,
    marketCap: "₹102 Lakh Cr",
    description: "Decentralized digital store of value and premier cryptocurrency paired against Indian Rupee.",
    baseHistoricalPrice: 4600000
  },
  {
    symbol: "ETHINR",
    tvSymbol: "BINANCE:ETHUSDT",
    name: "Ethereum / INR",
    exchange: "Crypto-Sim",
    category: "crypto",
    sector: "Smart Contracts",
    price: 265000.00,
    prevClose: 258000.00,
    high24h: 268500.00,
    low24h: 254000.00,
    volume: "12.4K ETH",
    lotSize: 0.01,
    pe: 0,
    marketCap: "₹31.5 Lakh Cr",
    description: "Leading decentralized smart contract platform paired against INR.",
    baseHistoricalPrice: 235000
  }
];

// Helper to look up TradingView symbol for any platform symbol
window.ArthashalaData.getTradingViewSymbol = function(symbol) {
  if (!symbol) return "NSE:NIFTY";
  const clean = symbol.trim().toUpperCase();
  const m = window.ArthashalaData.markets.find(item => item.symbol.toUpperCase() === clean);
  if (m && m.tvSymbol) return m.tvSymbol;
  if (clean === "NIFTY" || clean === "NIFTY 50") return "NSE:NIFTY";
  if (clean === "BANKNIFTY") return "NSE:BANKNIFTY";
  if (clean === "SENSEX") return "BSE:SENSEX";
  if (clean === "INDIA VIX" || clean === "INDIAVIX") return "NSE:INDIAVIX";
  if (clean === "GOLD") return "MCX:GOLD1!";
  if (clean === "SILVER") return "MCX:SILVER1!";
  if (clean === "CRUDEOIL") return "MCX:CRUDEOIL1!";
  if (clean === "USDINR") return "FX_IDC:USDINR";
  if (clean === "EURINR") return "FX_IDC:EURINR";
  if (clean === "BTCINR" || clean === "BTC") return "BINANCE:BTCUSDT";
  if (clean === "ETHINR" || clean === "ETH") return "BINANCE:ETHUSDT";
  return `NSE:${clean}`;
};

// Generate dynamic historical candlestick series for any instrument
window.ArthashalaData.generateCandles = function(symbol, count = 60, interval = "1D") {
  const item = window.ArthashalaData.markets.find(m => m.symbol === symbol) || window.ArthashalaData.markets[0];
  const candles = [];
  let currentPrice = item.price * 0.88;
  const now = Date.now();
  const stepMs = interval === "1m" ? 60000 : interval === "5m" ? 300000 : interval === "15m" ? 900000 : interval === "1h" ? 3600000 : 86400000;
  
  // Seed predictable pseudo-random series based on symbol characters
  let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 42);
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = count; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    const volatility = (item.category === "crypto" ? 0.035 : item.category === "indices" ? 0.008 : 0.015);
    const deltaPercent = (pseudoRandom() - 0.48) * volatility;
    
    const open = currentPrice;
    const close = Math.max(1, open * (1 + deltaPercent));
    const highSpread = Math.abs(pseudoRandom() * volatility * 0.8 * open);
    const lowSpread = Math.abs(pseudoRandom() * volatility * 0.8 * open);
    
    const high = Math.max(open, close) + highSpread;
    const low = Math.min(open, close) - lowSpread;
    const volume = Math.floor(1000 + pseudoRandom() * 50000);

    candles.push({
      time: time,
      timestamp: time.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });

    currentPrice = close;
  }

  // Ensure last candle close matches current live price
  if (candles.length > 0) {
    candles[candles.length - 1].close = item.price;
  }
  return candles;
};
