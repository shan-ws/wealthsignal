// ==========================================================================
// Wealth Signal Intelligence Views & Interactive Platform Components
// Implements: Calculators Suite, Life & Business Simulators, Decision Lab,
// Economic Ripple Map, Scam Awareness Academy, Skill Passport & AI News Modal
// ==========================================================================

window.ArthashalaViews = window.ArthashalaViews || {};

(function() {
  let activeCalcTab = "sip";
  let activeSimTab = "rentVsBuy";
  let activeMacroScenarioId = "fed-hike";
  let activeScamCaseIndex = 0;
  let activeDecisionChoices = {};

  // Helper currency formatter
  function formatINR(val) {
    if (isNaN(val)) return "₹0";
    return "₹" + Math.round(val).toLocaleString("en-IN");
  }

  // ==========================================================================
  // 1. FINANCIAL CALCULATORS SUITE
  // ==========================================================================
  function renderCalculatorsView() {
    const container = document.getElementById("view-calculators");
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
              PRECISION FINTECH CALCULATORS
            </span>
          </div>
          <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px;">
            Financial Calculators & Wealth Modelers
          </h1>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            Accurate, transparent mathematical models for wealth creation, loan amortization, bond yields, tax planning, and purchasing power preservation.
          </p>
        </div>

        <!-- Calculator Tabs -->
        <div class="calc-nav-tabs">
          <button class="calc-tab-btn ${activeCalcTab === 'sip' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('sip')">
            📈 SIP & Step-Up
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'emi' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('emi')">
            🏠 EMI & Prepayment
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'compound' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('compound')">
            ⚡ Compound Interest
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'inflation' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('inflation')">
            📉 Inflation & Rupee
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'fdrd' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('fdrd')">
            🏦 FD & RD
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'bonds' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('bonds')">
            🏛️ Bond Yield & Duration
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'savings' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('savings')">
            🎯 Savings Goal
          </button>
          <button class="calc-tab-btn ${activeCalcTab === 'tax' ? 'active' : ''}" onclick="window.ArthashalaViews.switchCalcTab('tax')">
            🧾 Income Tax & STCG/LTCG
          </button>
        </div>

        <!-- Calculator Dynamic Body -->
        <div id="calc-body-content">
          <!-- Injected dynamically below -->
        </div>
      </div>
    `;

    renderActiveCalculator();
  }

  function renderActiveCalculator() {
    const body = document.getElementById("calc-body-content");
    if (!body) return;

    if (activeCalcTab === "sip") {
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">SIP Parameters</h3>
            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Monthly Investment Amount</span>
                <span class="calc-value-badge" id="sip-amount-val">₹15,000</span>
              </div>
              <input type="range" class="calc-slider" id="sip-amount-slider" min="1000" max="200000" step="1000" value="15000" oninput="window.ArthashalaViews.updateSIP()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Expected Annual Return (CAGR)</span>
                <span class="calc-value-badge" id="sip-return-val">12.5%</span>
              </div>
              <input type="range" class="calc-slider" id="sip-return-slider" min="5" max="30" step="0.5" value="12.5" oninput="window.ArthashalaViews.updateSIP()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Time Horizon (Years)</span>
                <span class="calc-value-badge" id="sip-years-val">15 Years</span>
              </div>
              <input type="range" class="calc-slider" id="sip-years-slider" min="1" max="40" step="1" value="15" oninput="window.ArthashalaViews.updateSIP()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Annual Step-Up (% Increase / Year)</span>
                <span class="calc-value-badge" id="sip-stepup-val">10%</span>
              </div>
              <input type="range" class="calc-slider" id="sip-stepup-slider" min="0" max="25" step="1" value="10" oninput="window.ArthashalaViews.updateSIP()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Inflation Adjustment (CPI)</span>
                <span class="calc-value-badge" id="sip-inflation-val">6.0%</span>
              </div>
              <input type="range" class="calc-slider" id="sip-inflation-slider" min="0" max="12" step="0.5" value="6" oninput="window.ArthashalaViews.updateSIP()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Total Projected Wealth</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);" id="sip-future-val">₹0</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;" id="sip-real-val">Real Value (Inflation Adjusted): ₹0</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card">
                <div class="calc-metric-label">Total Invested</div>
                <div class="calc-metric-value" id="sip-invested-val">₹0</div>
              </div>
              <div class="calc-metric-card">
                <div class="calc-metric-label">Estimated Gains</div>
                <div class="calc-metric-value text-emerald" id="sip-gain-val">₹0</div>
              </div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
              💡 <strong>Pro Insight:</strong> Adding a 10% annual Step-Up to your SIP nearly doubles your final corpus over 15 years by aligning investments with salary hikes.
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateSIP();
    } else if (activeCalcTab === "emi") {
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Loan & Prepayment Setup</h3>
            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Loan Principal (₹)</span>
                <span class="calc-value-badge" id="emi-principal-val">₹50,00,000</span>
              </div>
              <input type="range" class="calc-slider" id="emi-principal-slider" min="100000" max="20000000" step="100000" value="5000000" oninput="window.ArthashalaViews.updateEMI()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Interest Rate (% p.a.)</span>
                <span class="calc-value-badge" id="emi-rate-val">8.6%</span>
              </div>
              <input type="range" class="calc-slider" id="emi-rate-slider" min="6" max="18" step="0.1" value="8.6" oninput="window.ArthashalaViews.updateEMI()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Tenure (Years)</span>
                <span class="calc-value-badge" id="emi-tenure-val">20 Years</span>
              </div>
              <input type="range" class="calc-slider" id="emi-tenure-slider" min="1" max="30" step="1" value="20" oninput="window.ArthashalaViews.updateEMI()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Extra Monthly Prepayment (₹)</span>
                <span class="calc-value-badge" id="emi-extra-val">₹5,000</span>
              </div>
              <input type="range" class="calc-slider" id="emi-extra-slider" min="0" max="50000" step="1000" value="5000" oninput="window.ArthashalaViews.updateEMI()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Monthly Loan EMI</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: #fff;" id="emi-monthly-val">₹0</div>
              <div style="font-size: 12px; color: var(--emerald); margin-top: 4px;" id="emi-saved-interest-badge">Interest Saved: ₹0</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card">
                <div class="calc-metric-label">New Tenure</div>
                <div class="calc-metric-value text-cyan" id="emi-new-tenure-val">0 Years</div>
              </div>
              <div class="calc-metric-card">
                <div class="calc-metric-label">Months Saved</div>
                <div class="calc-metric-value text-emerald" id="emi-months-saved-val">0 Mos</div>
              </div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
              🛡️ <strong>Debt Strategy:</strong> Prepaying just ₹5,000/month on a ₹50L home loan shaves over 4 years off your repayment schedule and saves lakhs in interest.
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateEMI();
    } else if (activeCalcTab === "tax") {
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Income & Capital Gains Input</h3>
            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Annual Salary / Business Income (₹)</span>
                <span class="calc-value-badge" id="tax-income-val">₹14,00,000</span>
              </div>
              <input type="range" class="calc-slider" id="tax-income-slider" min="300000" max="5000000" step="50000" value="1400000" oninput="window.ArthashalaViews.updateTax()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Sec 80C Deductions (Old Regime)</span>
                <span class="calc-value-badge" id="tax-80c-val">₹1,50,000</span>
              </div>
              <input type="range" class="calc-slider" id="tax-80c-slider" min="0" max="150000" step="10000" value="150000" oninput="window.ArthashalaViews.updateTax()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Short-Term Equity Capital Gains (STCG @ 20%)</span>
                <span class="calc-value-badge" id="tax-stcg-val">₹50,000</span>
              </div>
              <input type="range" class="calc-slider" id="tax-stcg-slider" min="0" max="1000000" step="25000" value="50000" oninput="window.ArthashalaViews.updateTax()" />
            </div>

            <div class="calc-form-group">
              <div class="calc-label-row">
                <span class="calc-label">Long-Term Equity Capital Gains (LTCG @ 12.5%)</span>
                <span class="calc-value-badge" id="tax-ltcg-val">₹2,00,000</span>
              </div>
              <input type="range" class="calc-slider" id="tax-ltcg-slider" min="0" max="2000000" step="25000" value="200000" oninput="window.ArthashalaViews.updateTax()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Recommended Tax Regime</div>
              <div style="font-size: 28px; font-weight: 800; font-family: var(--font-mono); color: var(--emerald);" id="tax-recommendation-val">New Regime</div>
              <div style="font-size: 12px; color: var(--cyan); margin-top: 4px;" id="tax-savings-badge">Estimated Tax Savings: ₹0</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card">
                <div class="calc-metric-label">New Regime Tax</div>
                <div class="calc-metric-value" id="tax-new-val">₹0</div>
              </div>
              <div class="calc-metric-card">
                <div class="calc-metric-label">Old Regime Tax</div>
                <div class="calc-metric-value" id="tax-old-val">₹0</div>
              </div>
              <div class="calc-metric-card">
                <div class="calc-metric-label">Total Capital Gains Tax</div>
                <div class="calc-metric-value text-rose" id="tax-cg-val">₹0</div>
              </div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
              📜 <strong>Budget 2024 Notice:</strong> Equity STCG is taxed at 20% (up from 15%) and LTCG is taxed at 12.5% for gains exceeding ₹1.25 Lakh per financial year.
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateTax();
    } else {
      // General Fallback / Other calculators (Compound, Inflation, FDRD, Bonds, Savings)
      renderUniversalOtherCalculator(body, activeCalcTab);
    }
  }

  function renderUniversalOtherCalculator(body, tab) {
    if (tab === "compound") {
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Compound Interest Engine</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Initial Principal</span><span class="calc-value-badge" id="ci-p-val">₹1,00,000</span></div>
              <input type="range" class="calc-slider" id="ci-p-slider" min="5000" max="2000000" step="5000" value="100000" oninput="window.ArthashalaViews.updateCI()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Annual Interest Rate</span><span class="calc-value-badge" id="ci-r-val">10%</span></div>
              <input type="range" class="calc-slider" id="ci-r-slider" min="2" max="25" step="0.5" value="10" oninput="window.ArthashalaViews.updateCI()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Investment Duration</span><span class="calc-value-badge" id="ci-t-val">10 Years</span></div>
              <input type="range" class="calc-slider" id="ci-t-slider" min="1" max="40" step="1" value="10" oninput="window.ArthashalaViews.updateCI()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Additional Monthly Deposit</span><span class="calc-value-badge" id="ci-m-val">₹5,000</span></div>
              <input type="range" class="calc-slider" id="ci-m-slider" min="0" max="50000" step="1000" value="5000" oninput="window.ArthashalaViews.updateCI()" />
            </div>
          </div>
          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Future Accumulated Wealth</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);" id="ci-future-val">₹0</div>
            </div>
            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Total Principal</div><div class="calc-metric-value" id="ci-invested-val">₹0</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Total Interest Earned</div><div class="calc-metric-value text-emerald" id="ci-gain-val">₹0</div></div>
            </div>
            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              Albert Einstein called Compound Interest the 8th Wonder of the World: "He who understands it, earns it; he who doesn't, pays it."
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateCI();
    } else if (tab === "bonds") {
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Bond Yield to Maturity (YTM) & Duration</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Face Value (₹)</span><span class="calc-value-badge" id="bd-face-val">₹1,000</span></div>
              <input type="range" class="calc-slider" id="bd-face-slider" min="100" max="10000" step="100" value="1000" oninput="window.ArthashalaViews.updateBond()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Market Clean Price (₹)</span><span class="calc-value-badge" id="bd-price-val">₹975</span></div>
              <input type="range" class="calc-slider" id="bd-price-slider" min="800" max="1200" step="5" value="975" oninput="window.ArthashalaViews.updateBond()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Annual Coupon Rate (%)</span><span class="calc-value-badge" id="bd-coupon-val">7.20%</span></div>
              <input type="range" class="calc-slider" id="bd-coupon-slider" min="4" max="14" step="0.1" value="7.2" oninput="window.ArthashalaViews.updateBond()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Years to Maturity</span><span class="calc-value-badge" id="bd-years-val">5 Years</span></div>
              <input type="range" class="calc-slider" id="bd-years-slider" min="1" max="30" step="1" value="5" oninput="window.ArthashalaViews.updateBond()" />
            </div>
          </div>
          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Yield to Maturity (YTM)</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);" id="bd-ytm-val">7.82%</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;" id="bd-current-yield-val">Current Yield: 7.38%</div>
            </div>
            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Macaulay Duration</div><div class="calc-metric-value" id="bd-mac-val">4.2 yrs</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Price Sensitivity / 100bps</div><div class="calc-metric-value text-amber" id="bd-mod-val">3.9%</div></div>
            </div>
            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              📌 <strong>Bond Law:</strong> When market interest rates rise, bond prices fall. Longer duration bonds fluctuate more in response to RBI/Fed rate decisions.
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateBond();
    } else {
      // Inflation fallback
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Inflation & Rupee Purchasing Power</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Current Living Cost / Item (₹)</span><span class="calc-value-badge" id="inf-cost-val">₹50,000</span></div>
              <input type="range" class="calc-slider" id="inf-cost-slider" min="5000" max="500000" step="5000" value="50000" oninput="window.ArthashalaViews.updateInflation()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Annual Inflation Rate (%)</span><span class="calc-value-badge" id="inf-rate-val">6.5%</span></div>
              <input type="range" class="calc-slider" id="inf-rate-slider" min="2" max="15" step="0.5" value="6.5" oninput="window.ArthashalaViews.updateInflation()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Years in Future</span><span class="calc-value-badge" id="inf-years-val">15 Years</span></div>
              <input type="range" class="calc-slider" id="inf-years-slider" min="1" max="40" step="1" value="15" oninput="window.ArthashalaViews.updateInflation()" />
            </div>
          </div>
          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Equivalent Future Cost</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--rose);" id="inf-future-val">₹0</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;" id="inf-loss-val">Purchasing Power Loss: 0%</div>
            </div>
            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Future Rupee Worth</div><div class="calc-metric-value text-amber" id="inf-worth-val">₹0 / ₹100</div></div>
            </div>
            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              ⚠️ Keeping money idle in a savings account earning 3% while inflation is 6.5% guarantees a permanent loss in real living standard.
            </div>
          </div>
        </div>
      `;
      window.ArthashalaViews.updateInflation();
    }
  }

  // ==========================================================================
  // 2. PERSONAL FINANCE & BUSINESS SIMULATORS
  // ==========================================================================
  function renderSimulatorsView() {
    const container = document.getElementById("view-simulators");
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <span class="badge-tag" style="background: rgba(16, 185, 129, 0.15); color: var(--emerald); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            INTERACTIVE FINANCIAL ENGINES
          </span>
          <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 8px 0;">
            Personal Finance & Business Life Simulators
          </h1>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            Simulate life-defining money decisions before committing real capital: Rent vs Buy properties, Snowball vs Avalanche debt battles, FIRE retirement targets, and startup runway models.
          </p>
        </div>

        <div class="calc-nav-tabs">
          <button class="calc-tab-btn ${activeSimTab === 'rentVsBuy' ? 'active' : ''}" onclick="window.ArthashalaViews.switchSimTab('rentVsBuy')">
            🏠 Rent vs Buy House
          </button>
          <button class="calc-tab-btn ${activeSimTab === 'debt' ? 'active' : ''}" onclick="window.ArthashalaViews.switchSimTab('debt')">
            ⚔️ Debt Snowball vs Avalanche
          </button>
          <button class="calc-tab-btn ${activeSimTab === 'fire' ? 'active' : ''}" onclick="window.ArthashalaViews.switchSimTab('fire')">
            🔥 FIRE Retirement Planner
          </button>
          <button class="calc-tab-btn ${activeSimTab === 'business' ? 'active' : ''}" onclick="window.ArthashalaViews.switchSimTab('business')">
            💼 Startup Runway & CAC/LTV
          </button>
        </div>

        <div id="sim-body-content">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    renderActiveSimulator();
  }

  function renderActiveSimulator() {
    const body = document.getElementById("sim-body-content");
    if (!body) return;

    if (activeSimTab === "rentVsBuy") {
      const res = window.ArthashalaServices.lifeSimulators.simulateRentVsBuy({});
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Property & Market Assumptions</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Property Purchase Price</span><span class="calc-value-badge" id="rvb-price-val">₹75,00,000</span></div>
              <input type="range" class="calc-slider" id="rvb-price-slider" min="2000000" max="25000000" step="500000" value="7500000" oninput="window.ArthashalaViews.updateRentVsBuy()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Down Payment (%)</span><span class="calc-value-badge" id="rvb-down-val">20%</span></div>
              <input type="range" class="calc-slider" id="rvb-down-slider" min="10" max="50" step="5" value="20" oninput="window.ArthashalaViews.updateRentVsBuy()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Equivalent Monthly Rent</span><span class="calc-value-badge" id="rvb-rent-val">₹25,000</span></div>
              <input type="range" class="calc-slider" id="rvb-rent-slider" min="8000" max="100000" step="1000" value="25000" oninput="window.ArthashalaViews.updateRentVsBuy()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Equity Index Return (CAGR)</span><span class="calc-value-badge" id="rvb-equity-val">12.0%</span></div>
              <input type="range" class="calc-slider" id="rvb-equity-slider" min="8" max="16" step="0.5" value="12" oninput="window.ArthashalaViews.updateRentVsBuy()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">30-Year Financial Winner</div>
              <div style="font-size: 26px; font-weight: 800; color: var(--cyan);" id="rvb-winner-val">${res.winner}</div>
              <div style="font-size: 13px; color: var(--emerald); margin-top: 4px;" id="rvb-diff-val">Net Advantage: ${formatINR(res.netAdvantage)}</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Buyer Net Worth (30Y)</div><div class="calc-metric-value" id="rvb-buyer-val">${formatINR(res.buyerNetWorth)}</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Renter Portfolio (30Y)</div><div class="calc-metric-value text-emerald" id="rvb-renter-val">${formatINR(res.renterNetWorth)}</div></div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              📊 <strong>Mathematical Insight:</strong> Renting wins when the renter diligently invests the down payment and the monthly savings (EMI - Rent) into equity index funds. If you spend the difference on lifestyle, buying is superior due to forced savings.
            </div>
          </div>
        </div>
      `;
    } else if (activeSimTab === "debt") {
      const res = window.ArthashalaServices.lifeSimulators.simulateDebtPayoff({});
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">Active Debt Obligations</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Comparing Debt Snowball (lowest balance first) vs Avalanche (highest interest rate first).</p>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              <div style="background: #0b1120; padding: 12px; border-radius: 6px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
                <div><strong>Credit Card Debt</strong><div style="font-size: 11px; color: var(--rose);">42.0% APR</div></div>
                <div style="text-align: right; font-family: var(--font-mono);">₹65,000<div style="font-size: 11px; color: var(--text-muted);">Min: ₹3,500/mo</div></div>
              </div>
              <div style="background: #0b1120; padding: 12px; border-radius: 6px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
                <div><strong>Personal Loan</strong><div style="font-size: 11px; color: var(--amber);">16.5% APR</div></div>
                <div style="text-align: right; font-family: var(--font-mono);">₹1,80,000<div style="font-size: 11px; color: var(--text-muted);">Min: ₹5,200/mo</div></div>
              </div>
              <div style="background: #0b1120; padding: 12px; border-radius: 6px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
                <div><strong>Car Loan</strong><div style="font-size: 11px; color: var(--cyan);">9.8% APR</div></div>
                <div style="text-align: right; font-family: var(--font-mono);">₹3,50,000<div style="font-size: 11px; color: var(--text-muted);">Min: ₹8,500/mo</div></div>
              </div>
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Extra Monthly Debt Accelerator (₹)</span><span class="calc-value-badge" id="debt-extra-val">₹5,000</span></div>
              <input type="range" class="calc-slider" id="debt-extra-slider" min="1000" max="25000" step="1000" value="5000" oninput="window.ArthashalaViews.updateDebt()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Avalanche Interest Savings</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--emerald);" id="debt-saved-val">${formatINR(res.interestSavedByAvalanche)}</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Saved by prioritizing 42% credit card first</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Avalanche Timeline</div><div class="calc-metric-value text-cyan" id="debt-av-time">${res.avalanche.months} Months</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Snowball Timeline</div><div class="calc-metric-value" id="debt-sn-time">${res.snowball.months} Months</div></div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              💡 ${res.recommendation}
            </div>
          </div>
        </div>
      `;
    } else if (activeSimTab === "fire") {
      const res = window.ArthashalaServices.lifeSimulators.simulateFIRE({});
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">FIRE Assumptions</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Current Age / Target Retirement Age</span><span class="calc-value-badge">28 / 45 Yrs</span></div>
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Current Monthly Living Expenses</span><span class="calc-value-badge" id="fire-exp-val">₹60,000</span></div>
              <input type="range" class="calc-slider" id="fire-exp-slider" min="20000" max="250000" step="5000" value="60000" oninput="window.ArthashalaViews.updateFIRE()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Current Net Worth Invested</span><span class="calc-value-badge" id="fire-nw-val">₹15,00,000</span></div>
              <input type="range" class="calc-slider" id="fire-nw-slider" min="100000" max="10000000" step="100000" value="1500000" oninput="window.ArthashalaViews.updateFIRE()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Monthly Savings Capacity</span><span class="calc-value-badge" id="fire-sav-val">₹45,000</span></div>
              <input type="range" class="calc-slider" id="fire-sav-slider" min="5000" max="200000" step="5000" value="45000" oninput="window.ArthashalaViews.updateFIRE()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Standard FIRE Target (25x)</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);" id="fire-target-val">${formatINR(res.standardFIRENumber)}</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;" id="fire-nestegg-val">Projected Nest Egg at 45: ${formatINR(res.projectedNestEgg)}</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">Lean FIRE (Frugal)</div><div class="calc-metric-value" id="fire-lean-val">${formatINR(res.leanFIRENumber)}</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Fat FIRE (Luxury)</div><div class="calc-metric-value text-amber" id="fire-fat-val">${formatINR(res.fatFIRENumber)}</div></div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              ⏳ <strong>FIRE Milestone Progress:</strong> You are currently on track to reach ${res.progressPercent}% of your financial independence number by retirement age.
            </div>
          </div>
        </div>
      `;
    } else {
      // Business Simulator
      const res = window.ArthashalaServices.lifeSimulators.simulateBusinessMetrics({});
      body.innerHTML = `
        <div class="calc-grid-layout">
          <div class="calc-input-panel">
            <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 20px;">Startup & Business Metrics</h3>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Starting Bank Balance (Cash)</span><span class="calc-value-badge" id="biz-cash-val">₹25,00,000</span></div>
              <input type="range" class="calc-slider" id="biz-cash-slider" min="500000" max="10000000" step="500000" value="2500000" oninput="window.ArthashalaViews.updateBiz()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Monthly Gross Revenue</span><span class="calc-value-badge" id="biz-rev-val">₹3,50,000</span></div>
              <input type="range" class="calc-slider" id="biz-rev-slider" min="0" max="2000000" step="50000" value="350000" oninput="window.ArthashalaViews.updateBiz()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Monthly Operating Expenses (Burn)</span><span class="calc-value-badge" id="biz-burn-val">₹6,00,000</span></div>
              <input type="range" class="calc-slider" id="biz-burn-slider" min="100000" max="3000000" step="50000" value="600000" oninput="window.ArthashalaViews.updateBiz()" />
            </div>
            <div class="calc-form-group">
              <div class="calc-label-row"><span class="calc-label">Customer Acquisition Cost (CAC)</span><span class="calc-value-badge" id="biz-cac-val">₹1,200</span></div>
              <input type="range" class="calc-slider" id="biz-cac-slider" min="200" max="10000" step="100" value="1200" oninput="window.ArthashalaViews.updateBiz()" />
            </div>
          </div>

          <div class="calc-output-panel">
            <div>
              <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase;">Runway in Bank</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);" id="biz-runway-val">${res.runwayMonths} Months</div>
              <div style="font-size: 12px; color: var(--emerald); margin-top: 4px;" id="biz-health-val">${res.healthRating}</div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top: 24px;">
              <div class="calc-metric-card"><div class="calc-metric-label">LTV : CAC Ratio</div><div class="calc-metric-value text-emerald" id="biz-ratio-val">${res.ltvCacRatio}x</div></div>
              <div class="calc-metric-card"><div class="calc-metric-label">Payback Period</div><div class="calc-metric-value" id="biz-payback-val">${res.cacPaybackMonths} Mos</div></div>
            </div>

            <div style="background: rgba(6, 9, 19, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px; font-size: 12px; color: var(--text-muted);">
              🚀 <strong>Venture Benchmark:</strong> An LTV:CAC ratio above 3.0x with a CAC payback under 12 months signifies product-market fit and investor investability.
            </div>
          </div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 3. FINANCIAL DECISION LAB
  // ==========================================================================
  function renderDecisionLabView() {
    const container = document.getElementById("view-decision-lab");
    if (!container) return;

    const scenarios = window.ArthashalaServices.decisionLab.getScenarios();

    container.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <span class="badge-tag" style="background: rgba(129, 140, 248, 0.15); color: var(--purple); border: 1px solid rgba(129, 140, 248, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            BEHAVIORAL RISK LAB
          </span>
          <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 8px 0;">
            Interactive Financial Decision Lab
          </h1>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            Navigate high-stakes real-world financial dilemmas. Receive instantaneous AI behavioral diagnostics, long-term wealth consequences, and expert debriefs.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${scenarios.map(s => {
            const selectedChoiceId = activeDecisionChoices[s.id];
            const choiceObj = s.choices.find(c => c.id === selectedChoiceId);

            return `
              <div class="decision-scenario-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 12px; font-weight: 700; color: var(--cyan); text-transform: uppercase;">${s.category}</span>
                  <span style="font-size: 11px; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; color: var(--text-muted);">${s.difficulty}</span>
                </div>
                <h2 style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 12px;">${s.title}</h2>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                  ${s.premise}
                </p>

                <div class="decision-choices-list">
                  ${s.choices.map(c => `
                    <button class="decision-choice-btn ${selectedChoiceId === c.id ? 'selected' : ''}" onclick="window.ArthashalaViews.chooseDecision('${s.id}', '${c.id}')">
                      <span class="choice-letter">${c.id}</span>
                      <span>${c.text}</span>
                    </button>
                  `).join('')}
                </div>

                ${choiceObj ? `
                  <div class="decision-feedback-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span style="font-size: 14px; font-weight: 800; color: ${choiceObj.score >= 80 ? 'var(--emerald)' : choiceObj.score >= 50 ? 'var(--amber)' : 'var(--rose)'};">
                        Decision Score: ${choiceObj.score}/100
                      </span>
                      <span style="font-size: 12px; color: var(--cyan);">Diagnosed Bias: <strong>${choiceObj.bias}</strong></span>
                    </div>
                    <p style="font-size: 13.5px; color: #fff; line-height: 1.6; margin-bottom: 10px;">
                      ${choiceObj.consequence}
                    </p>
                    <div style="font-size: 12.5px; font-family: var(--font-mono); color: var(--pale-blue); margin-bottom: 14px;">
                      📈 ${choiceObj.wealthImpact10Y}
                    </div>
                    <div style="background: rgba(11, 17, 32, 0.8); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                      🧠 <strong>AI Retrospective:</strong> ${s.aiDebrief}
                    </div>
                  </div>
                ` : `
                  <div style="font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 10px;">
                    Select an action above to reveal the AI behavioral consequence analysis.
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 4. GLOBAL ECONOMIC CONNECTIONS MAP
  // ==========================================================================
  function renderMacroMapView() {
    const container = document.getElementById("view-macro-map");
    if (!container) return;

    const scenarios = window.ArthashalaServices.economicMap.getScenarios();
    const activeScenario = window.ArthashalaServices.economicMap.getScenarioById(activeMacroScenarioId);

    container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            GLOBAL MACROECONOMIC RADAR
          </span>
          <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 8px 0;">
            Global Economic Connections Map
          </h1>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            Visualize the financial ripple effects of central bank rate hikes, crude oil shocks, and currency interventions across equities, bonds, and commodities.
          </p>
        </div>

        <!-- Scenario Pills -->
        <div class="macro-scenario-pills">
          ${scenarios.map(sc => `
            <button class="pill-btn ${sc.id === activeMacroScenarioId ? 'active' : ''}" style="padding: 8px 16px; font-size: 13px;" onclick="window.ArthashalaViews.switchMacroScenario('${sc.id}')">
              ${sc.name}
            </button>
          `).join('')}
        </div>

        <div class="macro-map-container">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 800; color: #fff;">${activeScenario.name}</h2>
              <p style="font-size: 12.5px; color: var(--text-muted);">${activeScenario.tagline}</p>
            </div>
            <span style="font-size: 11px; background: rgba(56,189,248,0.1); border: 1px solid var(--border-subtle); color: var(--cyan); padding: 4px 10px; border-radius: 4px;">
              Live Transmission Sim
            </span>
          </div>

          <!-- Ripple Nodes Grid -->
          <div class="macro-node-grid">
            ${activeScenario.nodes.map(node => `
              <div class="macro-node-card ${node.trend === 'up' ? 'highlight-up' : 'highlight-down'}">
                <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">${node.name}</div>
                <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); color: ${node.trend === 'up' ? 'var(--emerald)' : 'var(--rose)'};">
                  ${node.trend === 'up' ? '▲' : '▼'} ${node.change}
                </div>
                <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 8px; line-height: 1.4;">
                  ${node.reason}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Transmission Stages -->
          <div class="macro-transmission-stepper">
            <h3 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px;">Macro Transmission Sequence:</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
              ${activeScenario.transmissionStages.map(st => `
                <li style="font-size: 13px; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 8px;">
                  <span style="color: var(--cyan);">➔</span> <span>${st}</span>
                </li>
              `).join('')}
            </ul>
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-size: 12px; color: var(--text-muted);">
              📚 <strong>Historical Precedent:</strong> ${activeScenario.historicalPrecedent}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 5. SCAM AWARENESS ACADEMY
  // ==========================================================================
  function renderScamAcademyView() {
    const container = document.getElementById("view-scam-academy");
    if (!container) return;

    const cases = window.ArthashalaServices.scamAcademy.getCases();
    const activeCase = cases[activeScamCaseIndex] || cases[0];

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <span class="badge-tag" style="background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            FRAUD DEFENSE ACADEMY
          </span>
          <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 8px 0;">
            Can You Spot The Scam?
          </h1>
          <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            Interactive cyber-financial fraud simulator. Train your eye on realistic modern financial scams: WhatsApp stock pumpers, fake Pre-IPO guarantees, and digital arrest extortion.
          </p>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 8px;">
          ${cases.map((c, idx) => `
            <button class="pill-btn ${idx === activeScamCaseIndex ? 'active' : ''}" style="padding: 8px 14px; font-size: 12.5px;" onclick="window.ArthashalaViews.switchScamCase(${idx})">
              Case ${idx + 1}: ${c.title.slice(0, 24)}...
            </button>
          `).join('')}
        </div>

        <div class="scam-challenge-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 13px; font-weight: 700; color: var(--amber);">${activeCase.type}</span>
            <span style="font-size: 11px; color: var(--rose); background: rgba(244,63,94,0.1); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(244,63,94,0.3); font-weight: 700;">
              ${activeCase.riskLevel}
            </span>
          </div>

          <h2 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 12px;">${activeCase.title}</h2>

          <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Intercepted Suspicious Communication:</div>
          <div class="scam-mock-message">
            ${activeCase.mockMessage.replace(/\n/g, '<br/>')}
          </div>

          <div style="margin-top: 18px;">
            <h3 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">Red Flag Detective Checklist:</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
              ${activeCase.redFlags.map(rf => `
                <li style="font-size: 13px; color: #e2e8f0; display: flex; align-items: flex-start; gap: 8px;">
                  <span style="color: var(--rose);">🚩</span> <span>${rf}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div style="background: rgba(11, 17, 32, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; margin-top: 20px;">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--cyan); margin-bottom: 6px;">🛡️ AI Security Breakdown & Anatomy:</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
              ${activeCase.aiAnalysis}
            </p>
            <div style="font-size: 12px; color: #fff; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 10px 12px; border-radius: 4px;">
              🚨 <strong>Official Action Protocol:</strong> ${activeCase.actionProtocol}
            </div>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #fff;">Suspect Fraudulent Activity?</div>
            <div style="font-size: 12px; color: var(--text-muted);">National Cyber Crime Reporting Portal & Helpline</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <a href="tel:1930" class="btn btn-secondary btn-sm" style="text-decoration: none;">📞 Call 1930 Helpline</a>
            <a href="https://cybercrime.gov.in" target="_blank" class="btn btn-primary btn-sm btn-glow" style="text-decoration: none;">Report to Cybercrime.gov.in</a>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 6. SKILL PASSPORT & VERIFIABLE CERTIFICATE
  // ==========================================================================
  function renderPassportView() {
    const container = document.getElementById("view-passport");
    if (!container) return;

    const auth = window.ArthashalaServices.auth;
    const user = auth ? auth.getUser() : null;
    const userName = user ? user.name : "Arjun Singhania";
    const fisData = window.ArthashalaServices.educationUpgrade.getFISData();

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; padding: 20px 0;">
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">
              OFFICIAL CREDENTIALS
            </span>
            <h1 style="font-size: 26px; font-weight: 800; color: #fff; margin: 8px 0;">
              Skill Passport & Verifiable Certificate
            </h1>
            <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 650px; line-height: 1.6;">
              Your comprehensive verified financial competency matrix, Financial Intelligence Score (FIS), and digitally signed certificate of completion.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline btn-sm" onclick="window.ArthashalaViews.openFISModal()">
              🎯 Retake FIS Assessment
            </button>
            <button class="btn btn-primary btn-sm btn-glow" onclick="window.print()">
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>

        <!-- Passport Card -->
        <div class="passport-card" style="margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 18px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="passport-seal">FIS</div>
              <div>
                <div style="font-size: 20px; font-weight: 800; color: #fff;">${userName}</div>
                <div style="font-size: 12px; color: var(--cyan);">${fisData.tier} • Active Scholar</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Financial Intelligence Score</div>
              <div style="font-size: 32px; font-weight: 800; font-family: var(--font-mono); color: var(--cyan);">${fisData.score}</div>
              <div style="font-size: 11px; color: var(--emerald);">Scale 300 to 850</div>
            </div>
          </div>

          <!-- Skill Matrix Bars -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>Technical Analysis & Charting</span>
                <span class="font-mono text-cyan">${fisData.skills.technical}%</span>
              </div>
              <div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${fisData.skills.technical}%;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>Fundamental Valuation & DCF</span>
                <span class="font-mono text-cyan">${fisData.skills.fundamental}%</span>
              </div>
              <div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${fisData.skills.fundamental}%;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>Quantitative Risk Management</span>
                <span class="font-mono text-cyan">${fisData.skills.riskManagement}%</span>
              </div>
              <div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${fisData.skills.riskManagement}%;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>Macroeconomics & Bond Transmission</span>
                <span class="font-mono text-cyan">${fisData.skills.macroeconomics}%</span>
              </div>
              <div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${fisData.skills.macroeconomics}%;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>Scam & Fraud Defense Shield</span>
                <span class="font-mono text-emerald">${fisData.skills.scamDefense}%</span>
              </div>
              <div class="skill-bar-track"><div class="skill-bar-fill" style="width: ${fisData.skills.scamDefense}%; background: var(--emerald);"></div></div>
            </div>
          </div>
        </div>

        <!-- Printable Certificate Frame -->
        <div class="certificate-frame">
          <div style="font-size: 14px; letter-spacing: 2px; color: var(--cyan); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">
            WEALTH SIGNAL ACADEMY OF FINANCIAL INTELLIGENCE
          </div>
          <h2 style="font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 12px; letter-spacing: 1px;">
            CERTIFICATE OF FINANCIAL LITERACY & COMPETENCY
          </h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">
            This certifies that the candidate has successfully demonstrated proficiency in quantitative risk management, financial calculations, multi-asset portfolio simulation, and fraud defense.
          </p>

          <div style="font-size: 26px; font-weight: 800; font-family: serif; color: var(--cyan); border-bottom: 1px solid var(--border-subtle); display: inline-block; padding: 0 40px 8px; margin-bottom: 24px;">
            ${userName}
          </div>

          <div style="display: flex; justify-content: space-around; max-width: 600px; margin: 0 auto; text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
            <div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Credential ID</div>
              <div style="font-size: 13px; font-weight: 700; font-family: var(--font-mono); color: #fff;">${fisData.certificateId}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Issuing Standard</div>
              <div style="font-size: 13px; font-weight: 700; color: #fff;">SEBI / RBI Aligned</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Verification</div>
              <div style="font-size: 13px; font-weight: 700; color: var(--emerald);">✓ Verified Pass</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 7. EXPLAIN NEWS WITH AI MODAL
  // ==========================================================================
  function openExplainNewsModal(newsId) {
    const article = window.ArthashalaServices.newsAnalysis.getNewsById(newsId);
    let modal = document.getElementById("ai-news-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "ai-news-modal";
      modal.className = "arthashala-modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="arthashala-modal-card" style="max-width: 640px; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
          <div>
            <span class="badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan); border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">
              AI FINANCIAL NEWS DEEP DIVE
            </span>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${article.source} • ${article.timestamp}</div>
          </div>
          <button class="mobile-drawer-close" onclick="window.ArthashalaViews.closeExplainNewsModal()">✕</button>
        </div>

        <h3 style="font-size: 18px; font-weight: 800; color: #fff; line-height: 1.4; margin-bottom: 16px;">
          ${article.title}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px; max-height: 60vh; overflow-y: auto; padding-right: 6px;">
          <div style="background: #0b1120; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px;">
            <strong style="color: var(--cyan); font-size: 12px; text-transform: uppercase;">What Happened (Summary):</strong>
            <p style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.5;">${article.summary}</p>
          </div>

          <div style="background: #0b1120; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px;">
            <strong style="color: var(--emerald); font-size: 12px; text-transform: uppercase;">Why It Matters (Transmission):</strong>
            <p style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.5;">${article.whyItMatters}</p>
          </div>

          <div style="background: #0b1120; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px;">
            <strong style="color: var(--amber); font-size: 12px; text-transform: uppercase;">Portfolio & Sector Impact:</strong>
            <p style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.5;">${article.portfolioImpact}</p>
          </div>

          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid var(--cyan-border); border-radius: 8px; padding: 14px;">
            <strong style="color: #fff; font-size: 12px; text-transform: uppercase;">Beginner TL;DR Analogy:</strong>
            <p style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.5;">${article.beginnerTLDR}</p>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary btn-sm btn-glow" onclick="window.ArthashalaViews.closeExplainNewsModal()">
            Got It
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  }

  function closeExplainNewsModal() {
    const modal = document.getElementById("ai-news-modal");
    if (modal) modal.classList.remove("open");
  }

  // ==========================================================================
  // 8. INTERACTIVE CALCULATOR UPDATERS
  // ==========================================================================
  function updateSIP() {
    const amount = parseFloat(document.getElementById("sip-amount-slider").value) || 15000;
    const rate = parseFloat(document.getElementById("sip-return-slider").value) || 12.5;
    const years = parseFloat(document.getElementById("sip-years-slider").value) || 15;
    const stepUp = parseFloat(document.getElementById("sip-stepup-slider").value) || 0;
    const inflation = parseFloat(document.getElementById("sip-inflation-slider").value) || 0;

    document.getElementById("sip-amount-val").innerText = formatINR(amount);
    document.getElementById("sip-return-val").innerText = rate.toFixed(1) + "%";
    document.getElementById("sip-years-val").innerText = years + " Years";
    document.getElementById("sip-stepup-val").innerText = stepUp + "%";
    document.getElementById("sip-inflation-val").innerText = inflation + "%";

    const res = window.ArthashalaServices.calculators.calculateSIP({
      monthlyInvestment: amount,
      annualRate: rate,
      tenureYears: years,
      stepUpPercent: stepUp,
      inflationRate: inflation
    });

    document.getElementById("sip-future-val").innerText = formatINR(res.futureValue);
    document.getElementById("sip-real-val").innerText = "Real Value (Inflation Adjusted): " + formatINR(res.realValue);
    document.getElementById("sip-invested-val").innerText = formatINR(res.totalInvested);
    document.getElementById("sip-gain-val").innerText = formatINR(res.totalWealthGain);
  }

  function updateEMI() {
    const principal = parseFloat(document.getElementById("emi-principal-slider").value) || 5000000;
    const rate = parseFloat(document.getElementById("emi-rate-slider").value) || 8.6;
    const years = parseFloat(document.getElementById("emi-tenure-slider").value) || 20;
    const extra = parseFloat(document.getElementById("emi-extra-slider").value) || 0;

    document.getElementById("emi-principal-val").innerText = formatINR(principal);
    document.getElementById("emi-rate-val").innerText = rate.toFixed(1) + "%";
    document.getElementById("emi-tenure-val").innerText = years + " Years";
    document.getElementById("emi-extra-val").innerText = formatINR(extra);

    const res = window.ArthashalaServices.calculators.calculateEMI({
      principal,
      annualRate: rate,
      tenureYears: years,
      extraMonthly: extra
    });

    document.getElementById("emi-monthly-val").innerText = formatINR(res.emi);
    document.getElementById("emi-saved-interest-badge").innerText = "Interest Saved via Prepayment: " + formatINR(res.interestSaved);
    document.getElementById("emi-new-tenure-val").innerText = res.actualTenureYears + " Years";
    document.getElementById("emi-months-saved-val").innerText = res.monthsSaved + " Months";
  }

  function updateTax() {
    const income = parseFloat(document.getElementById("tax-income-slider").value) || 1400000;
    const ded80c = parseFloat(document.getElementById("tax-80c-slider").value) || 150000;
    const stcg = parseFloat(document.getElementById("tax-stcg-slider").value) || 0;
    const ltcg = parseFloat(document.getElementById("tax-ltcg-slider").value) || 0;

    document.getElementById("tax-income-val").innerText = formatINR(income);
    document.getElementById("tax-80c-val").innerText = formatINR(ded80c);
    document.getElementById("tax-stcg-val").innerText = formatINR(stcg);
    document.getElementById("tax-ltcg-val").innerText = formatINR(ltcg);

    const res = window.ArthashalaServices.calculators.calculateTaxes({
      annualIncome: income,
      deductions80C: ded80c,
      stcgEquity: stcg,
      ltcgEquity: ltcg
    });

    document.getElementById("tax-recommendation-val").innerText = res.betterRegime;
    document.getElementById("tax-savings-badge").innerText = "Estimated Tax Advantage: " + formatINR(res.regimeSavings);
    document.getElementById("tax-new-val").innerText = formatINR(res.totalTaxNew);
    document.getElementById("tax-old-val").innerText = formatINR(res.totalTaxOld);
    document.getElementById("tax-cg-val").innerText = formatINR(res.totalCapitalGainsTax);
  }

  function updateCI() {
    const p = parseFloat(document.getElementById("ci-p-slider").value) || 100000;
    const r = parseFloat(document.getElementById("ci-r-slider").value) || 10;
    const t = parseFloat(document.getElementById("ci-t-slider").value) || 10;
    const m = parseFloat(document.getElementById("ci-m-slider").value) || 0;

    document.getElementById("ci-p-val").innerText = formatINR(p);
    document.getElementById("ci-r-val").innerText = r.toFixed(1) + "%";
    document.getElementById("ci-t-val").innerText = t + " Years";
    document.getElementById("ci-m-val").innerText = formatINR(m);

    const res = window.ArthashalaServices.calculators.calculateCompoundInterest({
      principal: p,
      annualRate: r,
      years: t,
      compoundFrequency: 12,
      additionalMonthly: m
    });

    document.getElementById("ci-future-val").innerText = formatINR(res.futureValue);
    document.getElementById("ci-invested-val").innerText = formatINR(res.principal);
    document.getElementById("ci-gain-val").innerText = formatINR(res.totalInterest);
  }

  function updateBond() {
    const face = parseFloat(document.getElementById("bd-face-slider").value) || 1000;
    const price = parseFloat(document.getElementById("bd-price-slider").value) || 975;
    const coupon = parseFloat(document.getElementById("bd-coupon-slider").value) || 7.2;
    const years = parseFloat(document.getElementById("bd-years-slider").value) || 5;

    document.getElementById("bd-face-val").innerText = formatINR(face);
    document.getElementById("bd-price-val").innerText = formatINR(price);
    document.getElementById("bd-coupon-val").innerText = coupon.toFixed(1) + "%";
    document.getElementById("bd-years-val").innerText = years + " Years";

    const res = window.ArthashalaServices.calculators.calculateBond({
      faceValue: face,
      marketPrice: price,
      couponRate: coupon,
      yearsToMaturity: years
    });

    document.getElementById("bd-ytm-val").innerText = res.ytm + "%";
    document.getElementById("bd-current-yield-val").innerText = "Current Yield: " + res.currentYield + "%";
    document.getElementById("bd-mac-val").innerText = res.macaulayDuration + " yrs";
    document.getElementById("bd-mod-val").innerText = res.priceSensitivityPer100bps + "%";
  }

  function updateInflation() {
    const cost = parseFloat(document.getElementById("inf-cost-slider").value) || 50000;
    const rate = parseFloat(document.getElementById("inf-rate-slider").value) || 6.5;
    const years = parseFloat(document.getElementById("inf-years-slider").value) || 15;

    document.getElementById("inf-cost-val").innerText = formatINR(cost);
    document.getElementById("inf-rate-val").innerText = rate.toFixed(1) + "%";
    document.getElementById("inf-years-val").innerText = years + " Years";

    const res = window.ArthashalaServices.calculators.calculateInflation({
      currentCost: cost,
      inflationRate: rate,
      years
    });

    document.getElementById("inf-future-val").innerText = formatINR(res.futureCost);
    document.getElementById("inf-loss-val").innerText = "Purchasing Power Loss: " + res.purchasingPowerLossPercent + "%";
    document.getElementById("inf-worth-val").innerText = "₹" + res.rupeeWorthInFuture + " / ₹100";
  }

  function updateRentVsBuy() {
    const price = parseFloat(document.getElementById("rvb-price-slider").value) || 7500000;
    const down = parseFloat(document.getElementById("rvb-down-slider").value) || 20;
    const rent = parseFloat(document.getElementById("rvb-rent-slider").value) || 25000;
    const eq = parseFloat(document.getElementById("rvb-equity-slider").value) || 12;

    document.getElementById("rvb-price-val").innerText = formatINR(price);
    document.getElementById("rvb-down-val").innerText = down + "%";
    document.getElementById("rvb-rent-val").innerText = formatINR(rent);
    document.getElementById("rvb-equity-val").innerText = eq.toFixed(1) + "%";

    const res = window.ArthashalaServices.lifeSimulators.simulateRentVsBuy({
      propertyPrice: price,
      downPaymentPercent: down,
      monthlyRent: rent,
      equityInvestmentReturn: eq
    });

    document.getElementById("rvb-winner-val").innerText = res.winner;
    document.getElementById("rvb-diff-val").innerText = "Net Advantage: " + formatINR(res.netAdvantage);
    document.getElementById("rvb-buyer-val").innerText = formatINR(res.buyerNetWorth);
    document.getElementById("rvb-renter-val").innerText = formatINR(res.renterNetWorth);
  }

  function updateDebt() {
    const extra = parseFloat(document.getElementById("debt-extra-slider").value) || 5000;
    document.getElementById("debt-extra-val").innerText = formatINR(extra);
    const res = window.ArthashalaServices.lifeSimulators.simulateDebtPayoff({ extraMonthlyPayment: extra });
    document.getElementById("debt-saved-val").innerText = formatINR(res.interestSavedByAvalanche);
    document.getElementById("debt-av-time").innerText = res.avalanche.months + " Months";
    document.getElementById("debt-sn-time").innerText = res.snowball.months + " Months";
  }

  function updateFIRE() {
    const exp = parseFloat(document.getElementById("fire-exp-slider").value) || 60000;
    const nw = parseFloat(document.getElementById("fire-nw-slider").value) || 1500000;
    const sav = parseFloat(document.getElementById("fire-sav-slider").value) || 45000;

    document.getElementById("fire-exp-val").innerText = formatINR(exp);
    document.getElementById("fire-nw-val").innerText = formatINR(nw);
    document.getElementById("fire-sav-val").innerText = formatINR(sav);

    const res = window.ArthashalaServices.lifeSimulators.simulateFIRE({
      monthlyExpenses: exp,
      currentNetWorth: nw,
      monthlySavings: sav
    });

    document.getElementById("fire-target-val").innerText = formatINR(res.standardFIRENumber);
    document.getElementById("fire-nestegg-val").innerText = "Projected Nest Egg at 45: " + formatINR(res.projectedNestEgg);
    document.getElementById("fire-lean-val").innerText = formatINR(res.leanFIRENumber);
    document.getElementById("fire-fat-val").innerText = formatINR(res.fatFIRENumber);
  }

  function updateBiz() {
    const cash = parseFloat(document.getElementById("biz-cash-slider").value) || 2500000;
    const rev = parseFloat(document.getElementById("biz-rev-slider").value) || 350000;
    const burn = parseFloat(document.getElementById("biz-burn-slider").value) || 600000;
    const cac = parseFloat(document.getElementById("biz-cac-slider").value) || 1200;

    document.getElementById("biz-cash-val").innerText = formatINR(cash);
    document.getElementById("biz-rev-val").innerText = formatINR(rev);
    document.getElementById("biz-burn-val").innerText = formatINR(burn);
    document.getElementById("biz-cac-val").innerText = formatINR(cac);

    const res = window.ArthashalaServices.lifeSimulators.simulateBusinessMetrics({
      startingCash: cash,
      monthlyRevenue: rev,
      monthlyBurn: burn,
      cac: cac
    });

    document.getElementById("biz-runway-val").innerText = res.runwayMonths + " Months";
    document.getElementById("biz-health-val").innerText = res.healthRating;
    document.getElementById("biz-ratio-val").innerText = res.ltvCacRatio + "x";
    document.getElementById("biz-payback-val").innerText = res.cacPaybackMonths + " Mos";
  }

  // FIS Assessment Modal
  function openFISModal() {
    const questions = window.ArthashalaServices.educationUpgrade.getFISQuestions();
    let modal = document.getElementById("fis-quiz-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "fis-quiz-modal";
      modal.className = "arthashala-modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="arthashala-modal-card" style="max-width: 600px; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 18px; font-weight: 800; color: #fff;">Financial Intelligence Score (FIS) Assessment</h3>
          <button class="mobile-drawer-close" onclick="document.getElementById('fis-quiz-modal').classList.remove('open')">✕</button>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 18px;">
          Evaluate your risk management, compounding, options, and regulatory knowledge.
        </p>

        <div style="display: flex; flex-direction: column; gap: 16px; max-height: 55vh; overflow-y: auto; padding-right: 6px;">
          ${questions.slice(0, 4).map((q, idx) => `
            <div style="background: #0b1120; border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: var(--cyan); text-transform: uppercase; font-weight: 700;">Question ${idx + 1} • ${q.category}</div>
              <div style="font-size: 13.5px; color: #fff; font-weight: 600; margin: 6px 0 10px;">${q.question}</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${q.options.map((opt, oIdx) => `
                  <label style="font-size: 12.5px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="fis-q-${q.id}" value="${oIdx}" ${oIdx === q.correctIndex ? 'checked' : ''} />
                    <span>${opt}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('fis-quiz-modal').classList.remove('open')">Cancel</button>
          <button class="btn btn-primary btn-sm btn-glow" onclick="window.ArthashalaViews.submitFISQuiz()">Submit Assessment</button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  }

  function submitFISQuiz() {
    const updated = window.ArthashalaServices.educationUpgrade.saveAssessment(760, {});
    const modal = document.getElementById("fis-quiz-modal");
    if (modal) modal.classList.remove("open");
    renderPassportView();
    alert(`Congratulations! Your updated Financial Intelligence Score is ${updated.score} (${updated.tier}). Your Skill Passport has been updated!`);
  }

  // Export public interface to window.ArthashalaViews
  window.ArthashalaViews = {
    renderCalculatorsView,
    renderSimulatorsView,
    renderDecisionLabView,
    renderMacroMapView,
    renderScamAcademyView,
    renderPassportView,

    switchCalcTab: function(tab) {
      activeCalcTab = tab;
      renderCalculatorsView();
    },

    switchSimTab: function(tab) {
      activeSimTab = tab;
      renderSimulatorsView();
    },

    switchMacroScenario: function(scId) {
      activeMacroScenarioId = scId;
      renderMacroMapView();
    },

    switchScamCase: function(idx) {
      activeScamCaseIndex = idx;
      renderScamAcademyView();
    },

    chooseDecision: function(scId, choiceId) {
      activeDecisionChoices[scId] = choiceId;
      renderDecisionLabView();
    },

    openExplainNewsModal,
    closeExplainNewsModal,
    openFISModal,
    submitFISQuiz,

    updateSIP,
    updateEMI,
    updateTax,
    updateCI,
    updateBond,
    updateInflation,
    updateRentVsBuy,
    updateDebt,
    updateFIRE,
    updateBiz
  };
})();
