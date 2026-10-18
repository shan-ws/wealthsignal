// Wealth Signal Authentication Modal & Dedicated View Component
// Authentication-First Website: Sign In & Create Account (Register) with seamless redirection to Home Dashboard
window.ArthashalaComponents = window.ArthashalaComponents || {};

(function() {
  let activeMode = "signin"; // "signin" | "signup"
  let isSubmitting = false;

  function getTemplate(isDedicatedPage = false) {
    const isSignIn = activeMode === "signin";

    return `
      <div class="auth-card ${isDedicatedPage ? 'dedicated-page-card' : ''}" id="auth-main-card">
        ${!isDedicatedPage ? `
          <button class="modal-close auth-close-btn" onclick="window.ArthashalaComponents.auth.closeModal()" title="Close">&times;</button>
        ` : ''}

        <!-- Auth Brand Header -->
        <div class="auth-header">
          <div class="auth-logo-badge">
            <img src="assets/logo.jpg" alt="Wealth Signal" class="auth-logo-img" />
          </div>
          <h2 class="auth-title">
            ${isSignIn ? "Sign In to Wealth Signal" : "Create Your Free Account"}
          </h2>
          <p class="auth-subtitle">
            ${isSignIn 
              ? "Access live NSE/BSE charts, simulated paper trading & institutional analytics." 
              : "Register to unlock ₹10,00,000 risk-free virtual demo money. Zero real capital required."}
          </p>
        </div>

        <!-- Mode Switcher: Sign In vs Create Account (Register) Toggle -->
        <div class="auth-mode-switch" role="tablist">
          <button 
            type="button"
            class="mode-btn ${isSignIn ? 'active' : ''}" 
            onclick="window.ArthashalaComponents.auth.setMode('signin', ${isDedicatedPage})"
            role="tab"
            aria-selected="${isSignIn}">
            Sign In
          </button>
          <button 
            type="button"
            class="mode-btn ${!isSignIn ? 'active' : ''}" 
            onclick="window.ArthashalaComponents.auth.setMode('signup', ${isDedicatedPage})"
            role="tab"
            aria-selected="${!isSignIn}">
            Create Account (Register)
          </button>
        </div>

        <!-- Notification Banner Container -->
        <div id="auth-alert-box" class="auth-alert-box" style="display: none;"></div>

        <!-- Fast-Track Google Sign-In Button -->
        <div class="auth-fasttrack-section">
          <button type="button" class="google-auth-btn" onclick="window.ArthashalaComponents.auth.showGoogleChooser(${isDedicatedPage})">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>${isSignIn ? "Continue with Google" : "Sign Up with Google"}</span>
          </button>
        </div>

        <div class="auth-divider">
          <span>${isSignIn ? "OR SIGN IN WITH EMAIL" : "OR REGISTER WITH EMAIL"}</span>
        </div>

        <!-- Auth Form (Sign In / Register) -->
        <div class="auth-tab-panel">
          <form id="auth-email-form" onsubmit="window.ArthashalaComponents.auth.handleEmailAuth(event, ${isDedicatedPage})">
            ${!isSignIn ? `
              <div class="form-group">
                <label class="form-label" for="auth-signup-name">Full Name</label>
                <input 
                  type="text" 
                  id="auth-signup-name" 
                  class="form-input" 
                  placeholder="e.g. Arjun Singhania" 
                  required 
                  autofocus
                />
              </div>
            ` : ''}

            <div class="form-group">
              <label class="form-label" for="auth-email-input">Email Address</label>
              <input 
                type="email" 
                id="auth-email-input" 
                class="form-input" 
                placeholder="name@example.com" 
                required 
                ${isSignIn ? 'autofocus' : ''}
              />
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" for="auth-password-input" style="margin: 0;">Password</label>
                ${isSignIn ? `
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
                <button type="button" class="pwd-toggle-btn" onclick="window.ArthashalaComponents.auth.togglePasswordVisibility()" aria-label="Toggle password visibility">
                  👁
                </button>
              </div>
              ${!isSignIn ? `
                <div class="pwd-strength-container">
                  <div class="pwd-strength-bar" id="pwd-strength-bar"></div>
                  <span class="pwd-strength-label" id="pwd-strength-label">Minimum 6 characters</span>
                </div>
              ` : ''}
            </div>

            <button type="submit" class="btn btn-primary auth-submit-btn" id="btn-email-submit">
              ${isSubmitting ? 'Processing...' : (isSignIn ? 'Sign In to Dashboard →' : 'Register & Enter Dashboard →')}
            </button>
          </form>
        </div>

        <!-- Quick 1-Click Demo Accounts for Fast Evaluation -->
        <div class="auth-demo-section" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle); text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; font-weight: 700; letter-spacing: 0.8px;">
            FAST EVALUATION • 1-CLICK DEMO LOGIN
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 11.5px; padding: 7px 14px; border-radius: 8px;" onclick="window.ArthashalaComponents.auth.quickLogin('usr_google_arjun', ${isDedicatedPage})">
              ⚡ Arjun (Pro Quant)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 11.5px; padding: 7px 14px; border-radius: 8px;" onclick="window.ArthashalaComponents.auth.quickLogin('usr_email_rohit', ${isDedicatedPage})">
              ⚡ Rohit (Trader)
            </button>
          </div>
        </div>

        <!-- Security & Simulation Notice -->
        <div class="auth-footer-notice">
          SEBI / RBI educational simulated environment • ₹10,00,000 virtual capital • No real money risk
        </div>
      </div>
    `;
  }

  // Google Account Chooser Simulation / Firebase Fallback
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
              <span class="google-check-icon">✓</span>
            </div>
          `).join('')}

          <div class="google-account-item" onclick="window.ArthashalaComponents.auth.promptCustomGoogleAccount(${isDedicatedPage})">
            <div class="google-account-avatar custom-plus">+</div>
            <div class="google-account-details">
              <div class="google-account-name">Use another Google account</div>
              <div class="google-account-email">Enter any Google email address</div>
            </div>
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-muted); padding: 14px 18px; border-top: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02); border-radius: 0 0 12px 12px;">
          Google will share your name, email address, and profile picture with Wealth Signal to authenticate your session.
        </div>
      </div>
    `;

    setTimeout(() => {
      overlay.classList.add("open");
    }, 10);
  }

  window.ArthashalaComponents.auth = {
    // Open modal popup
    openModal: function(arg1 = "signin", arg2 = null) {
      if (arg2) {
        activeMode = (arg2 === "signup") ? "signup" : "signin";
      } else {
        activeMode = (arg1 === "signup") ? "signup" : "signin";
      }

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
        const focusInput = document.getElementById(activeMode === "signup" ? "auth-signup-name" : "auth-email-input");
        if (focusInput) focusInput.focus();
      }, 10);
    },

    closeModal: function() {
      const modal = document.getElementById("arthashala-auth-modal");
      if (modal) {
        modal.classList.remove("open");
      }
    },

    // Render dedicated view inside page container (#view-auth)
    renderAuthView: function(containerId = "view-auth") {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <div class="auth-page-wrapper">
          ${getTemplate(true)}
        </div>
      `;
    },

    // Toggle between Sign In and Create Account (Register)
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
      box.innerHTML = `${isSuccess ? '✓' : '⚠️'} ${msg}`;
      box.style.display = "block";
    },

    // Redirection helper to Home Dashboard
    redirectToHomeDashboard: function(userName, message, isDedicatedPage = false) {
      if (!isDedicatedPage) {
        this.closeModal();
      }
      
      // Seamlessly navigate to Home Dashboard
      if (window.ArthashalaApp && window.ArthashalaApp.navigate) {
        window.ArthashalaApp.navigate("home");
      }

      if (window.ArthashalaApp && window.ArthashalaApp.showToast) {
        window.ArthashalaApp.showToast(message || `Welcome to Wealth Signal, ${userName}! Dashboard unlocked.`, "success");
      }
    },

    // Google Handlers
    showGoogleChooser: function(isDedicatedPage = false) {
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        window.wealthSignalFirebase.auth.signInWithPopup(provider)
          .then(result => {
            const displayName = result.user.displayName || result.user.email.split("@")[0];
            this.redirectToHomeDashboard(displayName, `Signed in via Google as ${displayName}! Welcome to Wealth Signal.`, isDedicatedPage);
          })
          .catch(err => {
            console.warn("[Firebase Google Auth Popup]", err);
            if (err.code === "auth/popup-closed-by-user") {
              return;
            }
            if (err.code === "auth/unauthorized-domain") {
              this.showAlert("Domain not authorized in Firebase! Please add your Vercel domain in Firebase Console.", false);
              return;
            }
            // Fallback to Google Chooser
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
          this.redirectToHomeDashboard(user.name, `Signed in via Google as ${user.name}! Welcome to Wealth Signal.`, isDedicatedPage);
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
          this.redirectToHomeDashboard(user.name, `Signed in as ${user.name}! Welcome to Wealth Signal.`, isDedicatedPage);
        });
    },

    // Email Handlers (Sign In & Register)
    handleEmailAuth: function(event, isDedicatedPage = false) {
      event.preventDefault();
      const emailInput = document.getElementById("auth-email-input");
      const passwordInput = document.getElementById("auth-password-input");
      const nameInput = document.getElementById("auth-signup-name");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      const name = nameInput ? nameInput.value.trim() : "";

      isSubmitting = true;
      const btn = document.getElementById("btn-email-submit");
      if (btn) btn.innerHTML = `<span class="spinner-inline"></span> Authenticating...`;

      if (activeMode === "signup") {
        window.ArthashalaServices.auth.signupWithEmail(name, email, password)
          .then(user => {
            isSubmitting = false;
            this.showAlert(`Account created successfully! Redirecting to Home Dashboard...`, true);
            setTimeout(() => {
              this.redirectToHomeDashboard(user.name, `Welcome to Wealth Signal, ${user.name}! Your ₹10,00,000 demo capital is ready.`, isDedicatedPage);
            }, 500);
          })
          .catch(err => {
            isSubmitting = false;
            if (btn) btn.innerHTML = 'Register & Enter Dashboard →';
            this.showAlert(err.message, false);
          });
      } else {
        window.ArthashalaServices.auth.loginWithEmail(email, password)
          .then(user => {
            isSubmitting = false;
            this.showAlert(`Welcome back, ${user.name}! Redirecting to Home Dashboard...`, true);
            setTimeout(() => {
              this.redirectToHomeDashboard(user.name, `Welcome back, ${user.name}! Home Dashboard unlocked.`, isDedicatedPage);
            }, 500);
          })
          .catch(err => {
            isSubmitting = false;
            if (btn) btn.innerHTML = 'Sign In to Dashboard →';
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

    // Fast 1-Click Demo Login with immediate Home Dashboard redirection
    quickLogin: function(accountId, isDedicatedPage = false) {
      const user = window.ArthashalaServices.auth.switchDemoAccount(accountId);
      this.showAlert(`Demo account verified: ${user.name}. Redirecting to Home Dashboard...`, true);
      setTimeout(() => {
        this.redirectToHomeDashboard(user.name, `Signed in as ${user.name}! Home Dashboard unlocked.`, isDedicatedPage);
      }, 400);
    }
  };
})();
