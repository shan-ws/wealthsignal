// Arthashala Subscription & Mock Razorpay/UPI Checkout Modal
window.ArthashalaComponents = window.ArthashalaComponents || {};

(function() {
  const STORAGE_KEY_USER_TIER = "arthashala_user_subscription";

  let subscription = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_TIER)) || {
    isPro: false,
    plan: "Free",
    validUntil: null
  };

  const PLANS = {
    "1M": { id: "1M", name: "Starter Trader", duration: "1 Month", price: 99, savings: "Standard", daily: "₹3.30/day" },
    "3M": { id: "3M", name: "Active Learner", duration: "3 Months", price: 399, savings: "Save ₹15%", daily: "₹4.40/day" },
    "6M": { id: "6M", name: "Semi-Pro", duration: "6 Months", price: 699, savings: "Save 25%", daily: "₹3.80/day" },
    "1Y": { id: "1Y", name: "Annual Pro (Best Value)", duration: "1 Year", price: 1099, savings: "Best Value (Save 42%)", daily: "₹3.01/day" }
  };

  window.ArthashalaComponents.checkout = {
    getSubscription: function() {
      return subscription;
    },
    isProUser: function() {
      return subscription.isPro;
    },
    openModal: function(selectedPlanKey = "1Y") {
      const plan = PLANS[selectedPlanKey] || PLANS["1Y"];
      
      let modal = document.getElementById("arthashala-checkout-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "arthashala-checkout-modal";
        modal.className = "arthashala-modal-overlay";
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="badge-tag pro-pill">⭐ WEALTH SIGNAL PRO</div>
              <h3 class="modal-title">Upgrade to Pro Terminal</h3>
            </div>
            <button class="modal-close" onclick="window.ArthashalaComponents.checkout.closeModal()">&times;</button>
          </div>

          <div class="modal-body">
            <!-- Plan Selector -->
            <div class="checkout-plan-grid">
              ${Object.values(PLANS).map(p => `
                <div class="checkout-plan-card ${p.id === plan.id ? 'active' : ''}" onclick="window.ArthashalaComponents.checkout.selectPlan('${p.id}')">
                  ${p.id === '1Y' ? '<span class="best-value-ribbon">⭐ BEST VALUE</span>' : ''}
                  <div class="plan-card-name">${p.duration}</div>
                  <div class="plan-card-price">₹${p.price.toLocaleString('en-IN')}</div>
                  <div class="plan-card-daily">${p.daily}</div>
                </div>
              `).join('')}
            </div>

            <!-- Pro Perks -->
            <div class="pro-perks-box">
              <div class="perk-item"><span class="perk-check">✓</span> <span>Advanced Multi-Timeframe Candlestick Charts with RSI & Bollinger Bands</span></div>
              <div class="perk-item"><span class="perk-check">✓</span> <span>Unlimited Quantitative Strategy Backtesting on Historical Indian Equities</span></div>
              <div class="perk-item"><span class="perk-check">✓</span> <span>Psychological Trading Journal with Behavioral Bias Analytics</span></div>
              <div class="perk-item"><span class="perk-check">✓</span> <span>Uncapped Finance AI Tutor queries citing SEBI & RBI circulars</span></div>
              <div class="perk-item"><span class="perk-check">✓</span> <span>Institutional-grade Sharpe Ratio & Risk/Reward analytics</span></div>
            </div>

            <!-- Simulated Payment Gateway -->
            <div class="payment-method-container">
              <div class="payment-method-title">Select Indian Payment Method (Simulation Mode):</div>
              <div class="payment-modes">
                <label class="pay-radio active"><input type="radio" name="pay-mode" value="UPI" checked /> <span>⚡ Instant UPI / QR (GPay, PhonePe, Paytm)</span></label>
                <label class="pay-radio"><input type="radio" name="pay-mode" value="NetBanking" /> <span>🏛️ NetBanking (HDFC, ICICI, SBI)</span></label>
                <label class="pay-radio"><input type="radio" name="pay-mode" value="Cards" /> <span>💳 RuPay / Visa / MasterCard</span></label>
              </div>

              <div class="upi-input-group" id="upi-box">
                <input type="text" id="upi-vpa-input" class="text-input" placeholder="Enter your UPI ID (e.g. mobile@okaxis)" value="trader@upi" />
                <span class="upi-hint">Safe 256-bit encrypted simulation checkout. No real money deducted.</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="amount-display">
              <span class="text-muted">Total Payable:</span>
              <span class="final-price" id="checkout-final-price">₹${plan.price.toLocaleString('en-IN')}</span>
            </div>
            <button class="btn btn-primary btn-glow" id="btn-confirm-pay" onclick="window.ArthashalaComponents.checkout.processPayment('${plan.id}')">
              Pay ₹${plan.price} & Activate Pro
            </button>
          </div>
        </div>
      `;

      modal.classList.add("open");
    },

    selectPlan: function(planId) {
      this.openModal(planId);
    },

    closeModal: function() {
      const modal = document.getElementById("arthashala-checkout-modal");
      if (modal) modal.classList.remove("open");
    },

    processPayment: function(planId) {
      const plan = PLANS[planId] || PLANS["1Y"];
      const btn = document.getElementById("btn-confirm-pay");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span> Verifying via UPI Network...`;
      }

      setTimeout(() => {
        // Upgrade user
        const validUntilDate = new Date();
        const daysToAdd = planId === "1M" ? 30 : planId === "3M" ? 90 : planId === "6M" ? 180 : 365;
        validUntilDate.setDate(validUntilDate.getDate() + daysToAdd);

        subscription = {
          isPro: true,
          plan: plan.name,
          planId: plan.id,
          price: plan.price,
          validUntil: validUntilDate.toLocaleDateString("en-IN")
        };
        localStorage.setItem(STORAGE_KEY_USER_TIER, JSON.stringify(subscription));

        // Award XP
        if (window.ArthashalaServices.gamification) {
          window.ArthashalaServices.gamification.addXP(200, `Upgraded to Wealth Signal Pro (${plan.duration})`);
        }

        // Show Success View inside modal
        const modal = document.getElementById("arthashala-checkout-modal");
        if (modal) {
          modal.innerHTML = `
            <div class="modal-card modal-success">
              <div class="success-icon-badge">🎉</div>
              <h2 class="modal-title">Welcome to Wealth Signal Pro!</h2>
              <p class="text-muted" style="margin-top: 8px;">
                Your <strong>${plan.duration} Pro Membership</strong> is now active. All advanced candlestick indicators, portfolio analytics, backtesting engines, and Finance AI queries have been unlocked.
              </p>

              <div class="receipt-box">
                <div class="receipt-row"><span>Plan</span><strong>${plan.name}</strong></div>
                <div class="receipt-row"><span>Amount Paid (Simulated)</span><strong>₹${plan.price}</strong></div>
                <div class="receipt-row"><span>Valid Until</span><strong>${subscription.validUntil}</strong></div>
                <div class="receipt-row"><span>Status</span><strong class="text-emerald">ACTIVE & VERIFIED</strong></div>
              </div>

              <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="window.location.reload()">
                Go to Pro Trading Terminal
              </button>
            </div>
          `;
        }
      }, 1200);
    }
  };
})();
