// Wealth Signal Authentication Modal & Dedicated View Component
// Handles Phone Number (with live OTP), Google Sign-In, and Email/Password Login & Registration
window.ArthashalaComponents = window.ArthashalaComponents || {};

(function() {
  let activeTab = "phone"; // "phone" | "google" | "email"
  let activeMode = "signin"; // "signin" | "signup"
  let otpCountdown = 30;
  let otpTimerInterval = null;
  let pendingPhone = "";
  let isSubmitting = false;

  const COUNTRY_CODES = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" }
  ];

  function getTemplate(isDedicatedPage = false) {
    const authService = window.ArthashalaServices.auth;
    const currentUser = authService ? authService.getUser() : null;
    const pendingState = authService ? authService.getPendingOtpState() : null;
    const isOtpStep = !!(pendingState && pendingState.phone);

    return `
      <div class="auth-card ${isDedicatedPage ? 'dedicated-page-card' : ''}">
        ${!isDedicatedPage ? `
          <button class="modal-close auth-close-btn" onclick="window.ArthashalaComponents.auth.closeModal()" title="Close">&times;</button>
        ` : ''}

        <!-- Auth Header -->
        <div class="auth-header">
          <div class="auth-logo-badge">
            <img src="assets/logo.jpg" alt="Wealth Signal" class="auth-logo-img" />
          </div>
          <h2 class="auth-title">
            ${activeMode === "signin" ? "Welcome Back to Wealth Signal" : "Start Your Trading Journey"}
          </h2>
          <p class="auth-subtitle">
            ${activeMode === "signin" 
              ? "Access live TradingView charts, paper trading, and institutional analytics." 
              : "Create your free simulation account with ₹10,00,000 risk-free demo capital."}
          </p>
        </div>

        <!-- Mode Switcher (Sign In vs Create Account) -->
        <div class="auth-mode-switch">
          <button class="mode-btn ${activeMode === 'signin' ? 'active' : ''}" onclick="window.ArthashalaComponents.auth.setMode('signin', ${isDedicatedPage})">
            Sign In
          </button>
          <button class="mode-btn ${activeMode === 'signup' ? 'active' : ''}" onclick="window.ArthashalaComponents.auth.setMode('signup', ${isDedicatedPage})">
            Create Account
          </button>
        </div>

        <!-- Notification Banner Container -->
        <div id="auth-alert-box" class="auth-alert-box" style="display: none;"></div>

        <!-- Social Google Fast-Track Button (Always Visible for Instant Access) -->
        <div class="auth-fasttrack-section">
          <button class="google-auth-btn" onclick="window.ArthashalaComponents.auth.showGoogleChooser(${isDedicatedPage})">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div class="auth-divider">
          <span>OR SIGN IN WITH</span>
        </div>

        <!-- Auth Method Tabs: Phone vs Email -->
        <div class="auth-method-tabs">
          <button class="method-tab-btn ${activeTab === 'phone' ? 'active' : ''}" onclick="window.ArthashalaComponents.auth.setTab('phone', ${isDedicatedPage})">
            📱 Phone Number & OTP
          </button>
          <button class="method-tab-btn ${activeTab === 'email' ? 'active' : ''}" onclick="window.ArthashalaComponents.auth.setTab('email', ${isDedicatedPage})">
            ✉️ Email & Password
          </button>
        </div>

        <!-- Tab 1: Phone Number Flow -->
        ${activeTab === 'phone' ? `
          <div class="auth-tab-panel">
            ${!isOtpStep ? `
              <!-- Step 1: Enter Phone Number -->
              <form id="auth-phone-form" onsubmit="window.ArthashalaComponents.auth.handleSendOtp(event, ${isDedicatedPage})">
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <div class="phone-input-row">
                    <select id="auth-country-code" class="country-select">
                      ${COUNTRY_CODES.map(c => `
                        <option value="${c.code}" ${c.code === '+91' ? 'selected' : ''}>${c.flag} ${c.code}</option>
                      `).join('')}
                    </select>
                    <input 
                      type="tel" 
                      id="auth-phone-input" 
                      class="form-input phone-number-input" 
                      placeholder="98765 43210" 
                      maxlength="10" 
                      required 
                      autofocus
                      pattern="[0-9]{10}"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    />
                  </div>
                  <div class="input-helper-text">
                    We will send a 6-digit verification code to verify your mobile.
                  </div>
                </div>

                <button type="submit" class="btn btn-primary auth-submit-btn" id="btn-send-otp">
                  ${isSubmitting ? 'Sending OTP...' : 'Get Verification Code ➔'}
                </button>
              </form>
            ` : `
              <!-- Step 2: Enter 6-digit OTP -->
              <form id="auth-otp-form" onsubmit="window.ArthashalaComponents.auth.handleVerifyOtp(event, ${isDedicatedPage})">
                <div class="otp-verification-banner">
                  <span class="otp-sent-icon">💬</span>
                  <div>
                    <div style="color: #fff; font-weight: 600; font-size: 13px;">OTP sent to ${pendingState.phone}</div>
                    <div style="font-size: 11px; color: var(--emerald); margin-top: 2px;">
                      Demo Hint: Use OTP <strong style="letter-spacing: 1px;">${pendingState.otp}</strong> or <strong>123456</strong>
                    </div>
                  </div>
                </div>

                <div class="form-group" style="text-align: center; margin-top: 16px;">
                  <label class="form-label" style="text-align: center; display: block;">Enter 6-Digit Code</label>
                  <div class="otp-input-boxes">
                    ${[0, 1, 2, 3, 4, 5].map(i => `
                      <input 
                        type="text" 
                        maxlength="1" 
                        class="otp-box" 
                        id="otp-input-${i}" 
                        inputmode="numeric" 
                        pattern="[0-9]"
                        oninput="window.ArthashalaComponents.auth.onOtpInput(this, ${i})"
                        onkeydown="window.ArthashalaComponents.auth.onOtpKeyDown(event, ${i})"
                        onpaste="window.ArthashalaComponents.auth.onOtpPaste(event)"
                      />
                    `).join('')}
                  </div>
                </div>

                <button type="submit" class="btn btn-primary auth-submit-btn" id="btn-verify-otp">
                  ${isSubmitting ? 'Verifying...' : 'Verify OTP & Enter Terminal 🚀'}
                </button>

                <div class="otp-resend-row">
                  <button type="button" class="btn-link" onclick="window.ArthashalaComponents.auth.resetOtpStep(${isDedicatedPage})">
                    Change Mobile Number
                  </button>
                  <span id="otp-countdown-label" class="countdown-text">Resend in ${otpCountdown}s</span>
                  <button type="button" id="btn-resend-otp" class="btn-link" style="display: none;" onclick="window.ArthashalaComponents.auth.resendOtp(${isDedicatedPage})">
                    Resend Code
                  </button>
                </div>
              </form>
            `}
          </div>
        ` : ''}

        <!-- Tab 2: Email & Password Flow -->
        ${activeTab === 'email' ? `
          <div class="auth-tab-panel">
            <form id="auth-email-form" onsubmit="window.ArthashalaComponents.auth.handleEmailAuth(event, ${isDedicatedPage})">
              ${activeMode === 'signup' ? `
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="auth-signup-name" 
                    class="form-input" 
                    placeholder="e.g. Arjun Singhania" 
                    required 
                  />
                </div>
              ` : ''}

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="auth-email-input" 
                  class="form-input" 
                  placeholder="name@example.com" 
                  required 
                  autofocus
                />
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label class="form-label" style="margin: 0;">Password</label>
                  ${activeMode === 'signin' ? `
                    <a href="javascript:void(0)" class="forgot-link" onclick="window.ArthashalaComponents.auth.showForgotPassword()">Forgot?</a>
                  ` : ''}
                </div>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="auth-password-input" 
                    class="form-input" 
                    placeholder="••••••••" 
                    required 
                    minlength="6"
                    oninput="window.ArthashalaComponents.auth.checkPasswordStrength(this.value)"
                  />
                  <button type="button" class="pwd-toggle-btn" onclick="window.ArthashalaComponents.auth.togglePasswordVisibility()">
                    👁️
                  </button>
                </div>
                ${activeMode === 'signup' ? `
                  <div class="pwd-strength-container">
                    <div class="pwd-strength-bar" id="pwd-strength-bar"></div>
                    <span class="pwd-strength-label" id="pwd-strength-label">Minimum 6 characters</span>
                  </div>
                ` : ''}
              </div>

              <button type="submit" class="btn btn-primary auth-submit-btn">
                ${isSubmitting ? 'Processing...' : (activeMode === 'signin' ? 'Sign In to Terminal ➔' : 'Create My Account 🚀')}
              </button>
            </form>
          </div>
        ` : ''}

        <!-- Quick 1-Click Demo Profiles for Rapid Testing -->
        <div class="auth-demo-pill-section">
          <div class="demo-section-title">⚡ Instant 1-Click Demo Sign-In</div>
          <div class="demo-pills-row">
            <button class="demo-login-chip" onclick="window.ArthashalaComponents.auth.quickLogin('usr_google_arjun', ${isDedicatedPage})" title="Sign in as Arjun Singhania (Google Pro)">
              <span class="chip-avatar">🇮🇳</span>
              <span class="chip-label">Arjun Singhania (Google Pro)</span>
            </button>
            <button class="demo-login-chip" onclick="window.ArthashalaComponents.auth.quickLogin('usr_phone_priya', ${isDedicatedPage})" title="Sign in as Priya Sharma (Phone Verified)">
              <span class="chip-avatar">📱</span>
              <span class="chip-label">Priya (+91 Phone)</span>
            </button>
            <button class="demo-login-chip" onclick="window.ArthashalaComponents.auth.quickLogin('usr_email_rohit', ${isDedicatedPage})" title="Sign in as Rohit Mehta (Email)">
              <span class="chip-avatar">✉️</span>
              <span class="chip-label">Rohit (Email Trader)</span>
            </button>
          </div>
        </div>

        <!-- Security & SEBI Educational Micro Footer -->
        <div class="auth-footer-notice">
          🔒 256-bit encrypted simulated environment. No real funds or broker credentials required.
        </div>
      </div>
    `;
  }

  // Google Account Chooser Modal Simulation
  function renderGoogleChooserModal(isDedicatedPage = false) {
    const authService = window.ArthashalaServices.auth;
    const accounts = authService.getGoogleAccounts();

    let overlay = document.getElementById("google-chooser-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "google-chooser-overlay";
      overlay.className = "arthashala-modal-overlay";
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="google-chooser-card">
        <div class="google-chooser-header">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <div style="margin-left: 12px;">
            <div style="font-weight: 700; color: #fff; font-size: 16px;">Sign in with Google</div>
            <div style="font-size: 12px; color: var(--text-muted);">to continue to Wealth Signal</div>
          </div>
          <button class="modal-close" style="margin-left: auto;" onclick="document.getElementById('google-chooser-overlay').classList.remove('open')">&times;</button>
        </div>

        <div class="google-account-list">
          ${accounts.map(acc => `
            <div class="google-account-item" onclick="window.ArthashalaComponents.auth.selectGoogleAccount('${acc.id}', ${isDedicatedPage})">
              <img src="${acc.avatar}" alt="${acc.name}" class="google-account-avatar" />
              <div class="google-account-details">
                <div class="google-account-name">${acc.name}</div>
                <div class="google-account-email">${acc.email}</div>
              </div>
              <span class="google-check-icon">➔</span>
            </div>
          `).join('')}

          <!-- Option to add custom Google account -->
          <div class="google-account-item" onclick="window.ArthashalaComponents.auth.promptCustomGoogleAccount(${isDedicatedPage})">
            <div class="google-account-avatar custom-plus">+</div>
            <div class="google-account-details">
              <div class="google-account-name">Use another Google account</div>
              <div class="google-account-email">Enter any Google email address</div>
            </div>
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); padding: 14px 18px; border-top: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02); border-radius: 0 0 12px 12px;">
          To continue, Google will share your name, email address, and profile picture with Wealth Signal.
        </div>
      </div>
    `;

    setTimeout(() => {
      overlay.classList.add("open");
    }, 10);
  }

  function startOtpCountdown(isDedicatedPage) {
    clearInterval(otpTimerInterval);
    otpCountdown = 30;
    const label = document.getElementById("otp-countdown-label");
    const resendBtn = document.getElementById("btn-resend-otp");

    otpTimerInterval = setInterval(() => {
      otpCountdown--;
      const curLabel = document.getElementById("otp-countdown-label");
      const curBtn = document.getElementById("btn-resend-otp");
      if (curLabel && otpCountdown > 0) {
        curLabel.innerText = `Resend in ${otpCountdown}s`;
        curLabel.style.display = "inline";
      } else if (curLabel && curBtn) {
        curLabel.style.display = "none";
        curBtn.style.display = "inline";
        clearInterval(otpTimerInterval);
      }
    }, 1000);
  }

  window.ArthashalaComponents.auth = {
    // Open modal popup
    openModal: function(tab = "phone", mode = "signin") {
      activeTab = tab;
      activeMode = mode;

      let modal = document.getElementById("arthashala-auth-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "arthashala-auth-modal";
        modal.className = "arthashala-modal-overlay";
        document.body.appendChild(modal);
      }

      modal.innerHTML = getTemplate(false);
      setTimeout(() => {
        modal.classList.add("open");
        // Focus first input
        const phoneInput = document.getElementById("auth-phone-input");
        if (phoneInput) phoneInput.focus();
      }, 10);
    },

    closeModal: function() {
      const modal = document.getElementById("arthashala-auth-modal");
      if (modal) {
        modal.classList.remove("open");
      }
      clearInterval(otpTimerInterval);
    },

    // Render dedicated view inside page (#view-auth)
    renderAuthView: function(containerId = "view-auth") {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <div class="auth-page-wrapper">
          ${getTemplate(true)}
        </div>
      `;
    },

    setTab: function(tab, isDedicatedPage = false) {
      activeTab = tab;
      if (isDedicatedPage) {
        this.renderAuthView("view-auth");
      } else {
        const modal = document.getElementById("arthashala-auth-modal");
        if (modal) modal.innerHTML = getTemplate(false);
      }
    },

    setMode: function(mode, isDedicatedPage = false) {
      activeMode = mode;
      if (isDedicatedPage) {
        this.renderAuthView("view-auth");
      } else {
        const modal = document.getElementById("arthashala-auth-modal");
        if (modal) modal.innerHTML = getTemplate(false);
      }
    },

    showAlert: function(msg, isSuccess = false) {
      const box = document.getElementById("auth-alert-box");
      if (!box) return;
      box.className = `auth-alert-box ${isSuccess ? 'success' : 'error'}`;
      box.innerHTML = `${isSuccess ? '✅' : '⚠️'} ${msg}`;
      box.style.display = "block";
    },

    // 1. Phone Handlers
    handleSendOtp: function(event, isDedicatedPage = false) {
      event.preventDefault();
      const codeSelect = document.getElementById("auth-country-code");
      const phoneInput = document.getElementById("auth-phone-input");
      if (!phoneInput) return;

      const phoneVal = phoneInput.value.trim();
      const codeVal = codeSelect ? codeSelect.value : "+91";

      isSubmitting = true;
      const btn = document.getElementById("btn-send-otp");
      if (btn) btn.innerHTML = `<span class="spinner-inline"></span> Sending OTP...`;

      window.ArthashalaServices.auth.sendPhoneOtp(phoneVal, codeVal)
        .then(res => {
          isSubmitting = false;
          if (isDedicatedPage) {
            this.renderAuthView("view-auth");
          } else {
            const modal = document.getElementById("arthashala-auth-modal");
            if (modal) modal.innerHTML = getTemplate(false);
          }
          this.showAlert(`Verification code sent to ${res.phone}. Use Demo OTP: ${res.otp}`, true);
          startOtpCountdown(isDedicatedPage);

          // Focus first OTP box
          setTimeout(() => {
            const firstOtp = document.getElementById("otp-input-0");
            if (firstOtp) firstOtp.focus();
          }, 100);
        })
        .catch(err => {
          isSubmitting = false;
          if (btn) btn.innerText = "Get Verification Code ➔";
          this.showAlert(err.message, false);
        });
    },

    onOtpInput: function(input, index) {
      input.value = input.value.replace(/[^0-9]/g, "");
      if (input.value.length === 1 && index < 5) {
        const next = document.getElementById(`otp-input-${index + 1}`);
        if (next) next.focus();
      }
    },

    onOtpKeyDown: function(event, index) {
      if (event.key === "Backspace" && !event.target.value && index > 0) {
        const prev = document.getElementById(`otp-input-${index - 1}`);
        if (prev) prev.focus();
      }
    },

    onOtpPaste: function(event) {
      event.preventDefault();
      const pasteData = (event.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
      if (pasteData.length >= 6) {
        for (let i = 0; i < 6; i++) {
          const box = document.getElementById(`otp-input-${i}`);
          if (box) box.value = pasteData[i];
        }
        const last = document.getElementById("otp-input-5");
        if (last) last.focus();
      }
    },

    handleVerifyOtp: function(event, isDedicatedPage = false) {
      event.preventDefault();
      let enteredOtp = "";
      for (let i = 0; i < 6; i++) {
        const box = document.getElementById(`otp-input-${i}`);
        if (box) enteredOtp += box.value;
      }

      if (enteredOtp.length < 6) {
        this.showAlert("Please enter all 6 digits of the OTP code.", false);
        return;
      }

      isSubmitting = true;
      const btn = document.getElementById("btn-verify-otp");
      if (btn) btn.innerHTML = `<span class="spinner-inline"></span> Verifying...`;

      window.ArthashalaServices.auth.verifyPhoneOtp(enteredOtp)
        .then(user => {
          isSubmitting = false;
          clearInterval(otpTimerInterval);
          this.showAlert(`Signed in successfully as ${user.name}! Redirecting...`, true);
          setTimeout(() => {
            if (!isDedicatedPage) this.closeModal();
            window.ArthashalaApp.navigate("profile");
            if (window.ArthashalaApp.showToast) {
              window.ArthashalaApp.showToast(`Welcome ${user.name}! 🚀`, "success");
            }
          }, 600);
        })
        .catch(err => {
          isSubmitting = false;
          if (btn) btn.innerText = "Verify OTP & Enter Terminal 🚀";
          this.showAlert(err.message, false);
        });
    },

    resendOtp: function(isDedicatedPage = false) {
      const pendingState = window.ArthashalaServices.auth.getPendingOtpState();
      if (!pendingState || !pendingState.phone) return;

      window.ArthashalaServices.auth.sendPhoneOtp(pendingState.rawPhone, pendingState.countryCode)
        .then(res => {
          startOtpCountdown(isDedicatedPage);
          this.showAlert(`New OTP sent! Code: ${res.otp}`, true);
        });
    },

    resetOtpStep: function(isDedicatedPage = false) {
      clearInterval(otpTimerInterval);
      if (isDedicatedPage) {
        this.renderAuthView("view-auth");
      } else {
        const modal = document.getElementById("arthashala-auth-modal");
        if (modal) modal.innerHTML = getTemplate(false);
      }
    },

    // 2. Google Handlers
    showGoogleChooser: function(isDedicatedPage = false) {
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        window.wealthSignalFirebase.auth.signInWithPopup(provider)
          .then(result => {
            if (!isDedicatedPage) this.closeModal();
            window.ArthashalaApp.navigate("profile");
            if (window.ArthashalaApp.showToast) {
              window.ArthashalaApp.showToast(`Signed in via Google as ${result.user.displayName || result.user.email}!`, "success");
            }
          })
          .catch(err => {
            console.warn("[Firebase Google Auth Popup]", err);
            if (err.code === "auth/popup-closed-by-user") {
              return;
            }
            renderGoogleChooserModal(isDedicatedPage);
          });
      } else {
        renderGoogleChooserModal(isDedicatedPage);
      }
    },

    selectGoogleAccount: function(accountId, isDedicatedPage = false) {
      const accounts = window.ArthashalaServices.auth.getGoogleAccounts();
      const target = accounts.find(a => a.id === accountId);
      if (!target) return;

      const overlay = document.getElementById("google-chooser-overlay");
      if (overlay) overlay.classList.remove("open");

      window.ArthashalaServices.auth.loginWithGoogle(target)
        .then(user => {
          if (!isDedicatedPage) this.closeModal();
          window.ArthashalaApp.navigate("profile");
          if (window.ArthashalaApp.showToast) {
            window.ArthashalaApp.showToast(`Signed in via Google as ${user.name}!`, "success");
          }
        });
    },

    promptCustomGoogleAccount: function(isDedicatedPage = false) {
      const email = prompt("Enter your Google email address:", "trader.india@gmail.com");
      if (!email || !email.includes("@")) return;

      const overlay = document.getElementById("google-chooser-overlay");
      if (overlay) overlay.classList.remove("open");

      const customAcc = {
        id: "custom_g_" + Date.now(),
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        isPro: false
      };

      window.ArthashalaServices.auth.loginWithGoogle(customAcc)
        .then(user => {
          if (!isDedicatedPage) this.closeModal();
          window.ArthashalaApp.navigate("profile");
        });
    },

    // 3. Email Handlers
    handleEmailAuth: function(event, isDedicatedPage = false) {
      event.preventDefault();
      const emailInput = document.getElementById("auth-email-input");
      const passwordInput = document.getElementById("auth-password-input");
      const nameInput = document.getElementById("auth-signup-name");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      const name = nameInput ? nameInput.value.trim() : "";

      isSubmitting = true;

      if (activeMode === "signup") {
        window.ArthashalaServices.auth.signupWithEmail(name, email, password)
          .then(user => {
            isSubmitting = false;
            this.showAlert(`Account created! Welcome, ${user.name}.`, true);
            setTimeout(() => {
              if (!isDedicatedPage) this.closeModal();
              window.ArthashalaApp.navigate("profile");
            }, 600);
          })
          .catch(err => {
            isSubmitting = false;
            this.showAlert(err.message, false);
          });
      } else {
        window.ArthashalaServices.auth.loginWithEmail(email, password)
          .then(user => {
            isSubmitting = false;
            this.showAlert(`Welcome back, ${user.name}!`, true);
            setTimeout(() => {
              if (!isDedicatedPage) this.closeModal();
              window.ArthashalaApp.navigate("profile");
            }, 600);
          })
          .catch(err => {
            isSubmitting = false;
            this.showAlert(err.message, false);
          });
      }
    },

    togglePasswordVisibility: function() {
      const input = document.getElementById("auth-password-input");
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
      }
    },

    checkPasswordStrength: function(val) {
      const bar = document.getElementById("pwd-strength-bar");
      const label = document.getElementById("pwd-strength-label");
      if (!bar || !label) return;

      if (val.length === 0) {
        bar.style.width = "0%";
        bar.style.background = "transparent";
        label.innerText = "Minimum 6 characters";
      } else if (val.length < 6) {
        bar.style.width = "30%";
        bar.style.background = "var(--rose)";
        label.innerText = "Too short (min 6 characters)";
        label.style.color = "var(--rose)";
      } else if (val.length < 9) {
        bar.style.width = "65%";
        bar.style.background = "var(--amber)";
        label.innerText = "Moderate strength";
        label.style.color = "var(--amber)";
      } else {
        bar.style.width = "100%";
        bar.style.background = "var(--emerald)";
        label.innerText = "Strong password";
        label.style.color = "var(--emerald)";
      }
    },

    showForgotPassword: function() {
      const email = prompt("Enter your registered email address to receive password reset link:", "trader@wealthsignal.in");
      if (email) {
        window.ArthashalaServices.auth.sendPasswordReset(email)
          .then(res => {
            alert(res.message);
          });
      }
    },

    // 4. Quick Demo Sign In
    quickLogin: function(accountId, isDedicatedPage = false) {
      const user = window.ArthashalaServices.auth.switchDemoAccount(accountId);
      this.showAlert(`Switched to demo user: ${user.name} (${user.provider.toUpperCase()})`, true);
      setTimeout(() => {
        if (!isDedicatedPage) this.closeModal();
        window.ArthashalaApp.navigate("profile");
        if (window.ArthashalaApp.showToast) {
          window.ArthashalaApp.showToast(`Signed in as ${user.name} 🇮🇳`, "success");
        }
      }, 400);
    }
  };
})();
