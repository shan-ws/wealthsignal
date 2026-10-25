// ==========================================================================
// Wealth Signal Personal Finance & Business Simulators Engine
// Features: Rent vs Buy, Snowball/Avalanche Debt, FIRE Engine,
// Startup Runway, Unit Economics (CAC/LTV), and Break-Even Analyzer
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const Simulators = {
    // 1. Rent vs Buy 30-Year Real Estate Comparison
    simulateRentVsBuy({
      propertyPrice = 7500000,
      downPaymentPercent = 20,
      loanTenureYears = 20,
      homeLoanRate = 8.5,
      propertyAppreciation = 5.0,
      propertyTaxMaintenanceYearly = 1.0,
      monthlyRent = 25000,
      rentInflation = 5.0,
      equityInvestmentReturn = 12.0
    }) {
      const downPayment = propertyPrice * (downPaymentPercent / 100);
      const loanAmount = propertyPrice - downPayment;
      const monthlyLoanRate = (homeLoanRate / 100) / 12;
      const totalLoanMonths = loanTenureYears * 12;
      const emi = (loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalLoanMonths)) / (Math.pow(1 + monthlyLoanRate, totalLoanMonths) - 1);

      // Simulation over 30 years (360 months)
      let propertyValue = propertyPrice;
      let buyerTotalSpent = downPayment;
      let buyerMaintenance = 0;

      // Renter scenario: Invests down payment in equity index (12% CAGR) and also invests the difference between (EMI + maintenance) and Rent every month
      let renterPortfolio = downPayment;
      let currentRent = monthlyRent;
      let renterTotalSpent = 0;

      const monthlyEquityRate = (equityInvestmentReturn / 100) / 12;

      for (let m = 1; m <= 360; m++) {
        // Rent updates annually
        if (m > 1 && m % 12 === 1) {
          currentRent += currentRent * (rentInflation / 100);
        }

        const monthlyMaintenance = (propertyValue * (propertyTaxMaintenanceYearly / 100)) / 12;
        const buyerOutflow = (m <= totalLoanMonths ? emi : 0) + monthlyMaintenance;
        buyerTotalSpent += buyerOutflow;

        renterTotalSpent += currentRent;
        renterPortfolio *= (1 + monthlyEquityRate);

        // If buyer outflow is higher than rent, renter invests the difference!
        if (buyerOutflow > currentRent) {
          const savingsDifference = buyerOutflow - currentRent;
          renterPortfolio += savingsDifference;
        }

        // Property appreciation monthly
        propertyValue *= Math.pow(1 + (propertyAppreciation / 100), 1 / 12);
      }

      const buyerNetWorth = propertyValue;
      const renterNetWorth = renterPortfolio;
      const winner = renterNetWorth > buyerNetWorth ? "Renting & Investing the Difference" : "Buying the Property";
      const difference = Math.abs(renterNetWorth - buyerNetWorth);

      return {
        propertyValueAt30Y: Math.round(propertyValue),
        buyerNetWorth: Math.round(buyerNetWorth),
        renterNetWorth: Math.round(renterNetWorth),
        buyerTotalSpent: Math.round(buyerTotalSpent),
        renterTotalSpent: Math.round(renterTotalSpent),
        winner,
        netAdvantage: Math.round(difference),
        monthlyEMI: Math.round(emi)
      };
    },

    // 2. Debt Snowball vs Avalanche Payoff Battle
    simulateDebtPayoff({ debts = [], extraMonthlyPayment = 5000 }) {
      // Default sample debts if empty: Credit Card, Personal Loan, Car Loan
      const debtList = debts.length ? debts : [
        { name: "Credit Card", balance: 65000, rate: 42.0, minPayment: 3500 },
        { name: "Personal Loan", balance: 180000, rate: 16.5, minPayment: 5200 },
        { name: "Auto Loan", balance: 350000, rate: 9.8, minPayment: 8500 }
      ];

      function runMethod(method) {
        let items = debtList.map(d => ({ ...d }));
        let totalInterestPaid = 0;
        let months = 0;

        while (items.some(d => d.balance > 1) && months < 300) {
          months++;
          let extraAvailable = extraMonthlyPayment;

          // 1. Accrue monthly interest and pay minimums
          items.forEach(d => {
            if (d.balance > 0) {
              const monthlyRate = (d.rate / 100) / 12;
              const interest = d.balance * monthlyRate;
              totalInterestPaid += interest;
              d.balance += interest;

              const payment = Math.min(d.balance, d.minPayment);
              d.balance -= payment;
            }
          });

          // 2. Sort debts for payoff priority
          if (method === "AVALANCHE") {
            // Highest interest rate first
            items.sort((a, b) => b.rate - a.rate);
          } else {
            // Lowest balance first (Snowball)
            items.sort((a, b) => a.balance - b.balance);
          }

          // 3. Apply extra payment to top prioritized active debt
          for (let d of items) {
            if (d.balance > 0 && extraAvailable > 0) {
              const extraPay = Math.min(d.balance, extraAvailable);
              d.balance -= extraPay;
              extraAvailable -= extraPay;
            }
          }
        }

        return { months, totalInterestPaid: Math.round(totalInterestPaid) };
      }

      const snowball = runMethod("SNOWBALL");
      const avalanche = runMethod("AVALANCHE");
      const interestSavedByAvalanche = Math.max(0, snowball.totalInterestPaid - avalanche.totalInterestPaid);

      return {
        snowball,
        avalanche,
        interestSavedByAvalanche,
        recommendation: avalanche.totalInterestPaid < snowball.totalInterestPaid
          ? "Mathematically, the Avalanche method saves you more money on high-interest charges."
          : "The Snowball method gives quick psychological wins by knocking out smaller balances first."
      };
    },

    // 3. FIRE (Financial Independence, Retire Early) Calculator
    simulateFIRE({
      currentAge = 28,
      targetRetirementAge = 45,
      monthlyExpenses = 60000,
      currentNetWorth = 1500000,
      monthlySavings = 45000,
      expectedReturn = 12.0,
      inflationRate = 6.0,
      safeWithdrawalRate = 4.0 // 25x annual expenses rule of thumb
    }) {
      const yearsToFIRE = Math.max(1, targetRetirementAge - currentAge);
      const monthsToFIRE = yearsToFIRE * 12;
      const monthlyRate = (expectedReturn / 100) / 12;

      // Project future annual expenses at retirement age with inflation
      const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + (inflationRate / 100), yearsToFIRE);
      const futureAnnualExpenses = futureMonthlyExpenses * 12;

      // Standard FIRE Number = Annual Expenses / (Safe Withdrawal Rate %)
      const standardFIRENumber = futureAnnualExpenses / (safeWithdrawalRate / 100);
      const leanFIRENumber = standardFIRENumber * 0.75;
      const fatFIRENumber = standardFIRENumber * 1.50;

      // Growth of current net worth + regular monthly savings
      let projectedNestEgg = currentNetWorth * Math.pow(1 + monthlyRate, monthsToFIRE);
      for (let m = 1; m <= monthsToFIRE; m++) {
        projectedNestEgg += monthlySavings * Math.pow(1 + monthlyRate, monthsToFIRE - m);
      }

      const isFIREAchieved = projectedNestEgg >= standardFIRENumber;
      const progressPercent = Math.min(100, Math.round((projectedNestEgg / standardFIRENumber) * 100));

      return {
        yearsToFIRE,
        futureAnnualExpenses: Math.round(futureAnnualExpenses),
        leanFIRENumber: Math.round(leanFIRENumber),
        standardFIRENumber: Math.round(standardFIRENumber),
        fatFIRENumber: Math.round(fatFIRENumber),
        projectedNestEgg: Math.round(projectedNestEgg),
        isFIREAchieved,
        progressPercent
      };
    },

    // 4. Startup / Business Cash Runway & Unit Economics (CAC vs LTV)
    simulateBusinessMetrics({
      startingCash = 2500000,
      monthlyRevenue = 350000,
      monthlyBurn = 600000,
      revenueGrowthRate = 5.0, // monthly %
      cac = 1200,
      arpu = 350, // monthly revenue per user
      churnRate = 4.0 // monthly %
    }) {
      const netMonthlyBurn = monthlyBurn - monthlyRevenue;
      let cash = startingCash;
      let currentRev = monthlyRevenue;
      let monthsRunway = 0;

      if (netMonthlyBurn <= 0) {
        monthsRunway = 999; // Profitable / Infinite runway
      } else {
        while (cash > 0 && monthsRunway < 60) {
          monthsRunway++;
          currentRev += currentRev * (revenueGrowthRate / 100);
          const currentBurn = monthlyBurn - currentRev;
          if (currentBurn <= 0) {
            monthsRunway = 999; // Reached default profitability
            break;
          }
          cash -= currentBurn;
        }
      }

      // Unit Economics: LTV = (ARPU * Gross Margin) / Churn Rate
      const grossMargin = 0.75;
      const ltv = (arpu * grossMargin) / (churnRate / 100);
      const ltvCacRatio = (ltv / cac).toFixed(2);
      const cacPaybackMonths = (cac / (arpu * grossMargin)).toFixed(1);

      let healthRating = "Healthy";
      if (ltvCacRatio < 1.0) healthRating = "Critical: Losing money on every user acquired";
      else if (ltvCacRatio < 3.0) healthRating = "Fair: Unit economics need optimization";
      else if (ltvCacRatio > 5.0) healthRating = "Exceptional: Accelerate acquisition marketing";

      return {
        runwayMonths: monthsRunway === 999 ? "Cash-Flow Positive" : monthsRunway,
        ltv: Math.round(ltv),
        cac: Math.round(cac),
        ltvCacRatio,
        cacPaybackMonths,
        healthRating
      };
    },

    // 5. Business Break-Even Analyzer
    simulateBreakEven({ fixedCosts = 150000, pricePerUnit = 500, variableCostPerUnit = 200 }) {
      const contributionMargin = pricePerUnit - variableCostPerUnit;
      const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
      const breakEvenRevenue = breakEvenUnits * pricePerUnit;
      const marginPercentage = pricePerUnit > 0 ? ((contributionMargin / pricePerUnit) * 100).toFixed(1) : 0;

      return {
        contributionMargin: Math.round(contributionMargin),
        marginPercentage,
        breakEvenUnits,
        breakEvenRevenue: Math.round(breakEvenRevenue)
      };
    }
  };

  window.ArthashalaServices.lifeSimulators = Simulators;
})();
