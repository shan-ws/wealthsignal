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
    price: 23053.1,
    prevClose: 22936.75,
    high24h: 23118.1,
    low24h: 22905.1,
    volume: "—",
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
    price: 54686.95,
    prevClose: 54909.65,
    high24h: 55068.5,
    low24h: 54580.75,
    volume: "—",
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
    price: 74459.53,
    prevClose: 74151.04,
    high24h: 74742.59,
    low24h: 74082.03,
    volume: "—",
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
    price: 15.3,
    prevClose: 15.12,
    high24h: 15.7,
    low24h: 14.47,
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
    price: 1164.9,
    prevClose: 1167.4,
    high24h: 1174.6,
    low24h: 1152.5,
    volume: "14.72M",
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
    price: 2502.6,
    prevClose: 2478.0,
    high24h: 2527.7,
    low24h: 2494.2,
    volume: "3.02M",
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
    price: 692.8,
    prevClose: 683.3,
    high24h: 695.5,
    low24h: 680.85,
    volume: "21.29M",
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
    price: 1185.0,
    prevClose: 1146.5,
    high24h: 1185.0,
    low24h: 1147.9,
    volume: "13.03M",
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
    price: 265.4,
    prevClose: 266.0,
    high24h: 266.95,
    low24h: 263.1,
    volume: "5.24M",
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
    price: 1398.0,
    prevClose: 1386.6,
    high24h: 1404.9,
    low24h: 1383.3,
    volume: "10.52M",
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
    price: 265.6,
    prevClose: 265.0,
    high24h: 267.9,
    low24h: 262.7,
    volume: "16.29M",
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
    price: 3871.7,
    prevClose: 3837.1,
    high24h: 3872.7,
    low24h: 3806.2,
    volume: "1.76M",
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
    price: 126164,
    prevClose: 130451,
    high24h: 130671,
    low24h: 125529,
    volume: "230.0K Lots",
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
    price: 159451,
    prevClose: 169495,
    high24h: 169285,
    low24h: 158218,
    volume: "64.4K Lots",
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
    price: 9886.19,
    prevClose: 9684.9,
    high24h: 9968.8,
    low24h: 9725.73,
    volume: "248.7K Lots",
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
    price: 94.95,
    prevClose: 95.21,
    high24h: 94.95,
    low24h: 94.95,
    volume: "—",
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
    price: 105.9452,
    prevClose: 106.4362,
    high24h: 105.95,
    low24h: 105.95,
    volume: "—",
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
  },
  {
    symbol: "INDIA 10Y G-SEC",
    tvSymbol: "TVC:IN10Y",
    name: "India 10Y Benchmark Sovereign G-Sec",
    exchange: "RBI NDS-OM",
    category: "bonds",
    sector: "Sovereign Debt",
    price: 100.85,
    prevClose: 100.7,
    high24h: 101.1,
    low24h: 100.6,
    volume: "₹18,500 Cr",
    lotSize: 100,
    pe: 0,
    marketCap: "₹92.4 Lakh Cr",
    description: "Government of India 10-Year Benchmark Sovereign Bond (7.18% GS 2033), representing the sovereign risk-free yield curve anchor for Indian financial markets.",
    baseHistoricalPrice: 100.00
  },
  {
    symbol: "US 10Y TREASURY",
    tvSymbol: "TVC:US10Y",
    name: "US 10-Year Benchmark Treasury Note",
    exchange: "US Treasury",
    category: "bonds",
    sector: "Global Sovereign Debt",
    price: 95.07,
    prevClose: 95.01,
    high24h: 95.07,
    low24h: 95.07,
    volume: "$480B Daily",
    lotSize: 10,
    pe: 0,
    marketCap: "$27.2 Trillion",
    description: "The premier global risk-free debt benchmark issued by the United States Department of the Treasury.",
    baseHistoricalPrice: 97.50
  },
  {
    symbol: "SGB 2031",
    tvSymbol: "NSE:SGB",
    name: "Sovereign Gold Bond (RBI)",
    exchange: "RBI / NSE",
    category: "bonds",
    sector: "Gold Backed Debt",
    price: 12616,
    prevClose: 13045,
    high24h: 13067,
    low24h: 12553,
    volume: "240K Units",
    lotSize: 1,
    pe: 0,
    marketCap: "₹45,000 Cr",
    description: "Government securities denominated in grams of gold issued by the Reserve Bank of India with 2.50% annual coupon interest.",
    baseHistoricalPrice: 6600
  },
  // --- US Tech Giants ---
  {
    symbol: "AAPL",
    tvSymbol: "NASDAQ:AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    category: "equities",
    sector: "Consumer Tech & Devices",
    price: 344.63,
    prevClose: 348.91,
    high24h: 349.19,
    low24h: 342.35,
    volume: "67.84M",
    lotSize: 1,
    pe: 33.8,
    marketCap: "$3.54 Trillion",
    description: "Global technology leader designing iPhones, Macs, iPads, wearable ecosystems, and recurring services.",
    baseHistoricalPrice: 195.0
  },
  {
    symbol: "NVDA",
    tvSymbol: "NASDAQ:NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    category: "equities",
    sector: "Semiconductors & AI",
    price: 204.64,
    prevClose: 213.66,
    high24h: 209.05,
    low24h: 200.92,
    volume: "165.92M",
    lotSize: 1,
    pe: 58.2,
    marketCap: "$3.39 Trillion",
    description: "Pioneer in GPU hardware, CUDA software architecture, and generative AI data center infrastructure.",
    baseHistoricalPrice: 95.0
  },
  {
    symbol: "MSFT",
    tvSymbol: "NASDAQ:MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    category: "equities",
    sector: "Enterprise Software & Cloud",
    price: 521.91,
    prevClose: 530.14,
    high24h: 526.0,
    low24h: 514.35,
    volume: "35.59M",
    lotSize: 1,
    pe: 35.4,
    marketCap: "$3.18 Trillion",
    description: "Global cloud platform (Azure), enterprise productivity software (Office 365), and leader in AI integration.",
    baseHistoricalPrice: 380.0
  },
  {
    symbol: "TSLA",
    tvSymbol: "NASDAQ:TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    category: "equities",
    sector: "Electric Vehicles & Autonomy",
    price: 399.81,
    prevClose: 403.3,
    high24h: 404.2,
    low24h: 387.52,
    volume: "41.58M",
    lotSize: 1,
    pe: 68.4,
    marketCap: "$830 Billion",
    description: "Global electric vehicle manufacturing, Megapack energy storage, and full self-driving (FSD) robotics.",
    baseHistoricalPrice: 210.0
  },
  // --- Global Indices ---
  {
    symbol: "S&P 500",
    tvSymbol: "FOREXCOM:SPXUSD",
    name: "S&P 500 Index",
    exchange: "US",
    category: "indices",
    sector: "US Large Cap Benchmark",
    price: 7580.07,
    prevClose: 7720.39,
    high24h: 7637.48,
    low24h: 7527.56,
    volume: "4.27B",
    lotSize: 1,
    pe: 27.2,
    marketCap: "$46 Trillion",
    description: "The primary gauge of large-cap US equities representing 500 top publicly traded American corporations.",
    baseHistoricalPrice: 5100
  },
  {
    symbol: "NASDAQ 100",
    tvSymbol: "NASDAQ:NDX",
    name: "Nasdaq 100 Index",
    exchange: "US",
    category: "indices",
    sector: "Technology Benchmark",
    price: 28384.85,
    prevClose: 29402.51,
    high24h: 28713.44,
    low24h: 28093.24,
    volume: "2.21B",
    lotSize: 1,
    pe: 31.6,
    marketCap: "$22 Trillion",
    description: "Index composed of 100 of the largest non-financial innovative tech giants listed on Nasdaq.",
    baseHistoricalPrice: 18200
  },
  // --- Extra Crypto & Commodities ---
  {
    symbol: "SOLINR",
    tvSymbol: "BINANCE:SOLUSDT",
    name: "Solana / INR",
    exchange: "Crypto-Sim",
    category: "crypto",
    sector: "High-Throughput L1",
    price: 14200.00,
    prevClose: 13750.00,
    high24h: 14500.00,
    low24h: 13600.00,
    volume: "48K SOL",
    lotSize: 0.1,
    pe: 0,
    marketCap: "₹6.6 Lakh Cr",
    description: "Ultra-fast Layer-1 blockchain supporting high-frequency DeFi trading and microtransactions.",
    baseHistoricalPrice: 11000
  },
  {
    symbol: "NATGAS",
    tvSymbol: "MCX:NATURALGAS1!",
    name: "MCX Natural Gas (1250 mmBtu)",
    exchange: "MCX",
    category: "commodities",
    sector: "Clean Energy",
    price: 275.17,
    prevClose: 280.29,
    high24h: 278.01,
    low24h: 268.71,
    volume: "154.0K Lots",
    lotSize: 1250,
    pe: 0,
    marketCap: "—",
    description: "Natural Gas futures contract traded on MCX per mmBtu.",
    baseHistoricalPrice: 215
  },
  {
    symbol: "COPPER",
    tvSymbol: "MCX:COPPER1!",
    name: "MCX Copper 2.5 MT (1kg)",
    exchange: "MCX",
    category: "commodities",
    sector: "Industrial Metals",
    price: 1356.87,
    prevClose: 1382.09,
    high24h: 1381.15,
    low24h: 1350.28,
    volume: "51.0K Lots",
    lotSize: 2500,
    pe: 0,
    marketCap: "—",
    description: "Doctor Copper: benchmark industrial metal gauge for global economic growth and electrification.",
    baseHistoricalPrice: 780
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
  if (clean === "INDIA 10Y G-SEC" || clean === "IN10Y" || clean === "G-SEC") return "TVC:IN10Y";
  if (clean === "US 10Y TREASURY" || clean === "US10Y" || clean === "TREASURY") return "TVC:US10Y";
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
