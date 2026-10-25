// ==========================================================================
// Wealth Signal Financial Calculators Suite Engine
// High-precision calculations for SIP, EMI, Compound Interest, Inflation,
// FD/RD, Bonds (YTM/Duration), Savings Goals, and Income Tax / Capital Gains.
// ==========================================================================

window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const Calculators = {
    // 1. SIP Calculator with Step-up & Inflation Adjustment
    calculateSIP({ monthlyInvestment, annualRate, tenureYears, stepUpPercent = 0, inflationRate = 0 }) {
      const months = tenureYears * 12;
      const monthlyRate = (annualRate / 100) / 12;
      let totalInvested = 0;
      let futureValue = 0;
      let currentMonthly = monthlyInvestment;
      const yearlyBreakdown = [];

      for (let y = 1; y <= tenureYears; y++) {
        for (let m = 1; m <= 12; m++) {
          totalInvested += currentMonthly;
          futureValue = (futureValue + currentMonthly) * (1 + monthlyRate);
        }
        yearlyBreakdown.push({
          year: y,
          invested: Math.round(totalInvested),
          value: Math.round(futureValue)
        });
        if (stepUpPercent > 0) {
          currentMonthly += currentMonthly * (stepUpPercent / 100);
        }
      }

      const totalWealthGain = futureValue - totalInvested;
      // Real (inflation adjusted) purchasing power
      const inflationFactor = Math.pow(1 + (inflationRate / 100), tenureYears);
      const realValue = futureValue / inflationFactor;

      return {
        totalInvested: Math.round(totalInvested),
        futureValue: Math.round(futureValue),
        totalWealthGain: Math.round(totalWealthGain),
        realValue: Math.round(realValue),
        yearlyBreakdown
      };
    },

    // 2. EMI & Prepayment Loan Amortization Calculator
    calculateEMI({ principal, annualRate, tenureYears, extraMonthly = 0, lumpSumPrepayment = 0, prepaymentYear = 1 }) {
      const totalMonths = tenureYears * 12;
      const monthlyRate = (annualRate / 100) / 12;
      const standardEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

      let balance = principal;
      let totalInterest = 0;
      let monthsCount = 0;
      const schedule = [];

      while (balance > 1 && monthsCount < totalMonths * 2) {
        monthsCount++;
        const interestForMonth = balance * monthlyRate;
        let principalPaid = (standardEMI - interestForMonth) + extraMonthly;

        if (monthsCount === prepaymentYear * 12 && lumpSumPrepayment > 0) {
          principalPaid += lumpSumPrepayment;
        }

        if (principalPaid > balance) {
          principalPaid = balance;
        }

        balance -= principalPaid;
        totalInterest += interestForMonth;

        if (monthsCount % 12 === 0 || balance <= 1) {
          schedule.push({
            year: Math.ceil(monthsCount / 12),
            month: monthsCount,
            balance: Math.max(0, Math.round(balance)),
            totalInterestPaid: Math.round(totalInterest)
          });
        }
      }

      // Standard without prepayment comparison
      const standardTotalPayment = standardEMI * totalMonths;
      const standardTotalInterest = standardTotalPayment - principal;
      const interestSaved = Math.max(0, standardTotalInterest - totalInterest);
      const monthsSaved = Math.max(0, totalMonths - monthsCount);

      return {
        emi: Math.round(standardEMI),
        actualTenureMonths: monthsCount,
        actualTenureYears: (monthsCount / 12).toFixed(1),
        monthsSaved,
        totalInterest: Math.round(totalInterest),
        interestSaved: Math.round(interestSaved),
        totalPayment: Math.round(principal + totalInterest),
        schedule
      };
    },

    // 3. Compound Interest Calculator with Custom Compounding Frequency
    calculateCompoundInterest({ principal, annualRate, years, compoundFrequency = 12, additionalMonthly = 0 }) {
      const r = annualRate / 100;
      const n = compoundFrequency; // 1: Annual, 4: Quarterly, 12: Monthly, 365: Daily
      const periods = n * years;
      const ratePerPeriod = r / n;

      // Base lump sum compound
      let balance = principal * Math.pow(1 + ratePerPeriod, periods);
      let totalInvested = principal;

      // Add regular monthly contributions if applicable
      if (additionalMonthly > 0) {
        const monthlyRate = r / 12;
        const totalMonths = years * 12;
        for (let m = 1; m <= totalMonths; m++) {
          totalInvested += additionalMonthly;
          balance += additionalMonthly * Math.pow(1 + monthlyRate, totalMonths - m);
        }
      }

      const totalInterest = balance - totalInvested;

      return {
        principal: Math.round(totalInvested),
        futureValue: Math.round(balance),
        totalInterest: Math.round(totalInterest)
      };
    },

    // 4. Inflation & Rupee Purchasing Power Calculator
    calculateInflation({ currentCost, inflationRate, years }) {
      const futureCost = currentCost * Math.pow(1 + (inflationRate / 100), years);
      const purchasingPowerLossPercent = ((futureCost - currentCost) / futureCost) * 100;
      const rupeeWorthInFuture = currentCost / Math.pow(1 + (inflationRate / 100), years);

      return {
        futureCost: Math.round(futureCost),
        purchasingPowerLossPercent: purchasingPowerLossPercent.toFixed(1),
        rupeeWorthInFuture: (rupeeWorthInFuture / (currentCost / 100)).toFixed(1) // Worth of ₹100
      };
    },

    // 5. Fixed Deposit (FD) & Recurring Deposit (RD) Calculator
    calculateFDRD({ type = "FD", amount, annualRate, tenureYears, isSeniorCitizen = false }) {
      const effectiveRate = annualRate + (isSeniorCitizen ? 0.50 : 0.0);
      const r = effectiveRate / 100;

      if (type === "FD") {
        // Indian Banks compound FD quarterly: n = 4
        const n = 4;
        const maturityAmount = amount * Math.pow(1 + r / n, n * tenureYears);
        const interestEarned = maturityAmount - amount;
        return {
          type: "FD",
          invested: Math.round(amount),
          maturityAmount: Math.round(maturityAmount),
          interestEarned: Math.round(interestEarned),
          effectiveRate
        };
      } else {
        // RD (Monthly deposit with quarterly compounding)
        const totalMonths = tenureYears * 12;
        const totalInvested = amount * totalMonths;
        let maturityAmount = 0;
        for (let m = 1; m <= totalMonths; m++) {
          const remainingMonths = totalMonths - m + 1;
          const quarters = remainingMonths / 3;
          maturityAmount += amount * Math.pow(1 + r / 4, quarters);
        }
        return {
          type: "RD",
          invested: Math.round(totalInvested),
          maturityAmount: Math.round(maturityAmount),
          interestEarned: Math.round(maturityAmount - totalInvested),
          effectiveRate
        };
      }
    },

    // 6. Bond Yield to Maturity (YTM) & Macaulay Duration Calculator
    calculateBond({ faceValue = 1000, marketPrice = 980, couponRate = 7.5, yearsToMaturity = 5 }) {
      const annualCoupon = faceValue * (couponRate / 100);
      const currentYield = (annualCoupon / marketPrice) * 100;

      // Approximate YTM Formula: [C + (F - P)/n] / [(F + P)/2]
      const ytmApprox = ((annualCoupon + (faceValue - marketPrice) / yearsToMaturity) / ((faceValue + marketPrice) / 2)) * 100;
      const y = ytmApprox / 100;

      // Macaulay Duration approximation
      let pvWeightedSum = 0;
      let pvSum = 0;
      for (let t = 1; t <= yearsToMaturity; t++) {
        const cashFlow = (t === yearsToMaturity) ? (annualCoupon + faceValue) : annualCoupon;
        const pv = cashFlow / Math.pow(1 + y, t);
        pvSum += pv;
        pvWeightedSum += t * pv;
      }
      const macaulayDuration = (pvWeightedSum / pvSum).toFixed(2);
      const modifiedDuration = (macaulayDuration / (1 + y)).toFixed(2);
      const priceSensitivityPer100bps = (parseFloat(modifiedDuration) * 1.0).toFixed(2);

      return {
        annualCoupon: Math.round(annualCoupon),
        currentYield: currentYield.toFixed(2),
        ytm: ytmApprox.toFixed(2),
        macaulayDuration,
        modifiedDuration,
        priceSensitivityPer100bps
      };
    },

    // 7. Savings Goal & Emergency Fund Buffer Calculator
    calculateSavingsGoal({ targetAmount, currentSavings = 0, monthsToGoal = 24, expectedReturn = 6 }) {
      const remainingTarget = Math.max(0, targetAmount - currentSavings);
      const monthlyRate = (expectedReturn / 100) / 12;

      let monthlySavingNeeded = remainingTarget / monthsToGoal;
      if (monthlyRate > 0) {
        // Sinking fund formula: PMT = FV * r / [(1 + r)^n - 1]
        monthlySavingNeeded = (remainingTarget * monthlyRate) / (Math.pow(1 + monthlyRate, monthsToGoal) - 1);
      }

      return {
        targetAmount: Math.round(targetAmount),
        remainingTarget: Math.round(remainingTarget),
        monthlySavingNeeded: Math.round(monthlySavingNeeded),
        totalSelfContribution: Math.round(monthlySavingNeeded * monthsToGoal),
        returnsContributed: Math.round(remainingTarget - (monthlySavingNeeded * monthsToGoal))
      };
    },

    // 8. Income Tax & Capital Gains Calculator (Old vs New Regime + STCG / LTCG)
    calculateTaxes({ annualIncome = 1200000, deductions80C = 150000, stcgEquity = 0, ltcgEquity = 0 }) {
      // 1. New Regime (FY 2024-25 / 2025-26 Budget Slabs)
      // Standard deduction of ₹75,000 in New Regime
      const stdDeductionNew = 75000;
      const taxableNew = Math.max(0, annualIncome - stdDeductionNew);
      let taxNew = 0;

      if (taxableNew <= 300000) taxNew = 0;
      else if (taxableNew <= 700000) taxNew = (taxableNew - 300000) * 0.05;
      else if (taxableNew <= 1000000) taxNew = 20000 + (taxableNew - 700000) * 0.10;
      else if (taxableNew <= 1200000) taxNew = 50000 + (taxableNew - 1000000) * 0.15;
      else if (taxableNew <= 1500000) taxNew = 80000 + (taxableNew - 1200000) * 0.20;
      else taxNew = 140000 + (taxableNew - 1500000) * 0.30;

      // Sec 87A rebate for New Regime (taxable <= 7 Lakh is zero tax)
      if (taxableNew <= 700000) taxNew = 0;
      const cessNew = taxNew * 0.04;
      const totalTaxNew = taxNew + cessNew;

      // 2. Old Regime
      const stdDeductionOld = 50000;
      const totalDeductionsOld = stdDeductionOld + Math.min(150000, deductions80C);
      const taxableOld = Math.max(0, annualIncome - totalDeductionsOld);
      let taxOld = 0;

      if (taxableOld <= 250000) taxOld = 0;
      else if (taxableOld <= 500000) taxOld = (taxableOld - 250000) * 0.05;
      else if (taxableOld <= 1000000) taxOld = 12500 + (taxableOld - 500000) * 0.20;
      else taxOld = 112500 + (taxableOld - 1000000) * 0.30;

      if (taxableOld <= 500000) taxOld = 0;
      const cessOld = taxOld * 0.04;
      const totalTaxOld = taxOld + cessOld;

      // 3. Capital Gains (Post-July 2024 Budget)
      // STCG Equity @ 20%
      const stcgTax = stcgEquity * 0.20;
      // LTCG Equity: ₹1.25 Lakh exemption, rest taxed @ 12.5%
      const ltcgExempt = 125000;
      const taxableLTCG = Math.max(0, ltcgEquity - ltcgExempt);
      const ltcgTax = taxableLTCG * 0.125;
      const totalCapitalGainsTax = (stcgTax + ltcgTax) * 1.04;

      const betterRegime = totalTaxNew <= totalTaxOld ? "New Regime" : "Old Regime";
      const savings = Math.abs(totalTaxOld - totalTaxNew);

      return {
        taxableNew: Math.round(taxableNew),
        totalTaxNew: Math.round(totalTaxNew),
        taxableOld: Math.round(taxableOld),
        totalTaxOld: Math.round(totalTaxOld),
        betterRegime,
        regimeSavings: Math.round(savings),
        stcgTax: Math.round(stcgTax * 1.04),
        ltcgTax: Math.round(ltcgTax * 1.04),
        totalCapitalGainsTax: Math.round(totalCapitalGainsTax)
      };
    }
  };

  window.ArthashalaServices.calculators = Calculators;
})();
