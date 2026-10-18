// Wealth Signal Authentication Modal & Dedicated View Component
// Supports Google Sign-In and Email/Password Login & Registration
window.ArthashalaComponents = window.ArthashalaComponents || {};

(function() {
  let activeMode = "signin"; // "signin" | "signup"
  let isSubmitting = false;

  function getTemplate(isDedicatedPage = false) {
    const authService = window.ArthashalaServices.auth;
    const currentUser = authService ? authService.getUser() : null;

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

        <!-- Social Google Fast-Track Button (Instant Access) -->
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
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <!-- Email & Password Form -->
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
                <button type="button" class="pwd-toggle-btn" onclick="window.ArthashalaComponents.auth.togglePasswordVisibility()" aria-label="Toggle password visibility">
                  👁
                </button>
              </div>
              ${activeMode === 'signup' ? `
                <div class="pwd-strength-container">
                  <div class="pwd-strength-bar" id="pwd-strength-bar"></div>
                  <span class="pwd-strength-label" id="pwd-strength-label">Minimum 6 characters</span>
                </div>
              ` : ''}
            </div>

            <button type="submit" class="btn btn-primary auth-submit-btn" id="btn-email-submit">
              ${isSubmitting ? 'Processing...' : (activeMode === 'signin' ? 'Sign In to Terminal →' : 'Create My Account →')}
            </button>
          </form>
        </div>

        <!-- Quick 1-Click Demo Accounts -->
        <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-subtle); text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; letter-spacing: 0.5px;">
            QUICK DEMO ACCESS (1-CLICK)
          </div>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 11.5px; padding: 6px 12px;" onclick="window.ArthashalaComponents.auth.quickLogin('usr_google_arjun', ${isDedicatedPage})">
              Arjun (Pro Quant)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 11.5px; padding: 6px 12px;" onclick="window.ArthashalaComponents.auth.quickLogin('usr_email_rohit', ${isDedicatedPage})">
              Rohit (Trader)
            </button>
          </div>
        </div>

        <!-- Security & Simulation Notice -->
        <div class="auth-footer-notice">
          256-bit encrypted simulated environment. No real funds or broker credentials required.
        </div>
      </div>
    `;
  }

  // Google Account Chooser Modal Simulation / Popup Trigger
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
              <span class="google-check-icon"></span>
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

  window.ArthashalaComponents.auth = {
    // Open modal popup - supports openModal('signin'), openModal('signup'), or backward-compatible openModal('email', 'signin')
    openModal: function(arg1 = "signin", arg2 = null) {
      if (arg2) {
        // called like openModal('email', 'signin') or openModal('phone', 'signin')
        activeMode = (arg2 === "signup") ? "signup" : "signin";
      } else {
        // called like openModal('signin') or openModal('signup')
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
        const emailInput = document.getElementById("auth-email-input") || document.getElementById("auth-signup-name");
        if (emailInput) emailInput.focus();
      }, 10);
    },

    closeModal: function() {
      const modal = document.getElementById("arthashala-auth-modal");
      if (modal) {
        modal.classList.remove("open");
      }
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

    // Google Handlers
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
            if (err.code === "auth/unauthorized-domain") {
              this.showAlert("Domain not authorized in Firebase! Please add your Vercel domain in Firebase Console > Authentication > Settings > Authorized Domains.", false);
              return;
            }
            // If popup is blocked or fails, show quick chooser simulation
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

    // Email Handlers
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
      if (btn) btn.innerHTML = `<span class="spinner-inline"></span> Processing...`;

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
            if (btn) btn.innerHTML = 'Create My Account →';
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
            if (btn) btn.innerHTML = 'Sign In to Terminal →';
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

    // Quick Demo Sign In
    quickLogin: function(accountId, isDedicatedPage = false) {
      const user = window.ArthashalaServices.auth.switchDemoAccount(accountId);
      this.showAlert(`Switched to demo user: ${user.name}`, true);
      setTimeout(() => {
        if (!isDedicatedPage) this.closeModal();
        window.ArthashalaApp.navigate("profile");
        if (window.ArthashalaApp.showToast) {
          window.ArthashalaApp.showToast(`Signed in as ${user.name}`, "success");
        }
      }, 400);
    }
  };
})();
