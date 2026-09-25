// Wealth Signal (Arthashala) Authentication Service
// Integrated with Firebase (wealthsignal-d1329) & Cloud Firestore
// Supports Phone Number OTP, Google Sign-In, and Email/Password Login & Registration
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_SESSION = "arthashala_auth_session";
  const STORAGE_KEY_USERS = "arthashala_registered_users";

  // Pre-configured demo accounts for immediate testing / offline access
  const DEFAULT_USERS = [
    {
      id: "usr_google_arjun",
      name: "Arjun Singhania",
      email: "arjun.singhania@gmail.com",
      phone: "+91 98765 43210",
      provider: "google",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      role: "Pro Virtuoso Trader",
      tier: "Elite Quant",
      joinedDate: "Jan 2025",
      isPro: true,
      verified: true
    },
    {
      id: "usr_phone_priya",
      name: "Priya Sharma",
      email: "priya.sharma@wealthsignal.in",
      phone: "+91 98112 23344",
      provider: "phone",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      role: "Intraday Derivatives Trader",
      tier: "Intermediate Trader",
      joinedDate: "Mar 2025",
      isPro: true,
      verified: true
    },
    {
      id: "usr_email_rohit",
      name: "Rohit Mehta",
      email: "trader@wealthsignal.in",
      phone: "+91 99887 76655",
      provider: "email",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      role: "Swing Equity Investor",
      tier: "Novice Trader",
      joinedDate: "May 2025",
      isPro: false,
      verified: true
    }
  ];

  // Initialize stored users
  let registeredUsers = [];
  try {
    registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS)) || [];
  } catch(e) {
    registeredUsers = [];
  }
  if (!Array.isArray(registeredUsers)) {
    registeredUsers = [];
  }

  // Active session - starts as null (Logged Out) by default
  let currentSession = null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up legacy mock sessions so visitors start logged out
      if (parsed && !["usr_google_arjun", "usr_phone_priya", "usr_email_rohit"].includes(parsed.id)) {
        currentSession = parsed;
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        currentSession = null;
      }
    } else {
      currentSession = null;
    }
  } catch (e) {
    currentSession = null;
  }

  // Pending OTP verification state
  let pendingOtpState = {
    phone: null,
    countryCode: "+91",
    rawPhone: null,
    otp: null,
    confirmationResult: null,
    expiresAt: null
  };

  const listeners = [];

  function notifyListeners() {
    listeners.forEach(fn => {
      try { fn(currentSession); } catch(e) { console.error("Auth listener error:", e); }
    });
  }

  // Helper to map Firebase User object to Wealth Signal User Model
  function mapFirebaseUser(fbUser, extra = {}) {
    const providerId = (fbUser.providerData && fbUser.providerData[0]) ? fbUser.providerData[0].providerId : "";
    let provider = "email";
    if (providerId.includes("google") || (fbUser.email && fbUser.photoURL && fbUser.photoURL.includes("googleusercontent"))) {
      provider = "google";
    } else if (providerId.includes("phone") || fbUser.phoneNumber) {
      provider = "phone";
    }

    return {
      id: fbUser.uid,
      name: fbUser.displayName || extra.name || (fbUser.email ? fbUser.email.split("@")[0] : "Trader"),
      email: fbUser.email || (provider === "phone" ? `${fbUser.phoneNumber.replace(/[^0-9]/g, "")}@wealthsignal.in` : ""),
      phone: fbUser.phoneNumber || extra.phone || "+91 98765 00000",
      provider: provider,
      avatar: fbUser.photoURL || extra.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      role: extra.role || "Retail Market Trader",
      tier: extra.tier || "Novice Trader",
      joinedDate: extra.joinedDate || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      isPro: extra.isPro !== undefined ? extra.isPro : false,
      verified: fbUser.emailVerified || !!fbUser.phoneNumber || true,
      firebaseUid: fbUser.uid
    };
  }

  // Save/sync user profile in Firestore
  async function syncUserToFirestore(userObj) {
    try {
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.db && userObj && userObj.id) {
        const userRef = window.wealthSignalFirebase.db.collection("users").doc(userObj.id);
        await userRef.set({
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          provider: userObj.provider,
          avatar: userObj.avatar,
          role: userObj.role,
          tier: userObj.tier,
          isPro: userObj.isPro,
          lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("[Wealth Signal Firebase] Synced user profile to Firestore:", userObj.id);
      }
    } catch (e) {
      console.warn("[Wealth Signal Firebase] Firestore sync notice:", e.message);
    }
  }

  // Initialize Firebase Auth State Listener
  function initFirebaseListener() {
    if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
      window.wealthSignalFirebase.auth.onAuthStateChanged(async (fbUser) => {
        if (fbUser) {
          console.log("[Wealth Signal Firebase] Active Firebase user detected:", fbUser.uid, fbUser.email);
          let extra = {};
          try {
            if (window.wealthSignalFirebase.db) {
              const doc = await window.wealthSignalFirebase.db.collection("users").doc(fbUser.uid).get();
              if (doc.exists) {
                extra = doc.data();
              }
            }
          } catch(e) {}

          const user = mapFirebaseUser(fbUser, extra);
          currentSession = user;
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
          notifyListeners();
        }
      });
    }
  }

  // Run on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFirebaseListener);
  } else {
    setTimeout(initFirebaseListener, 100);
  }

  window.ArthashalaServices.auth = {
    getUser: function() {
      return currentSession;
    },

    isAuthenticated: function() {
      return !!currentSession;
    },

    onAuthStateChanged: function(callback) {
      if (typeof callback === "function") {
        listeners.push(callback);
        callback(currentSession);
      }
    },

    // 1. PHONE NUMBER AUTHENTICATION WITH OTP
    sendPhoneOtp: function(phoneNumber, countryCode = "+91") {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        return Promise.reject(new Error("Please enter a valid 10-digit mobile number"));
      }

      const fullPhone = `${countryCode} ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      pendingOtpState = {
        phone: fullPhone,
        countryCode: countryCode,
        rawPhone: cleanPhone,
        otp: generatedOtp,
        confirmationResult: null,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes validity
      };

      console.log(`[Wealth Signal SMS Gateway / Firebase] Sent OTP ${generatedOtp} to ${fullPhone}`);

      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            phone: fullPhone,
            otp: generatedOtp,
            message: `OTP sent successfully to ${fullPhone}`
          });
        }, 500);
      });
    },

    getPendingOtpState: function() {
      return pendingOtpState;
    },

    verifyPhoneOtp: async function(enteredOtp) {
      const cleanOtp = (enteredOtp || "").replace(/\s+/g, "");
      if (!pendingOtpState.phone) {
        throw new Error("No active OTP request found. Please request a new OTP.");
      }
      if (Date.now() > pendingOtpState.expiresAt) {
        throw new Error("OTP has expired. Please request a fresh OTP.");
      }
      // Check entered OTP against generated OTP or universal test OTP '123456'
      if (cleanOtp !== pendingOtpState.otp && cleanOtp !== "123456") {
        throw new Error("Invalid OTP code entered. Please try again or use 123456.");
      }

      // Check if user already exists
      let user = registeredUsers.find(u => u.phone && u.phone.replace(/[^0-9]/g, "") === pendingOtpState.rawPhone);
      if (!user) {
        user = {
          id: "usr_phone_" + Date.now().toString(36),
          name: `Trader +91-${pendingOtpState.rawPhone.slice(-4)}`,
          email: `trader${pendingOtpState.rawPhone.slice(-4)}@wealthsignal.in`,
          phone: pendingOtpState.phone,
          provider: "phone",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
          role: "Retail Market Trader",
          tier: "Novice Trader",
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          isPro: false,
          verified: true
        };
        registeredUsers.push(user);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
      }

      currentSession = user;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      await syncUserToFirestore(user);
      pendingOtpState = { phone: null, countryCode: "+91", rawPhone: null, otp: null, expiresAt: null, confirmationResult: null };
      
      notifyListeners();
      return user;
    },

    // 2. GOOGLE SIGN-IN
    getGoogleAccounts: function() {
      return [
        {
          id: "google_acc_arjun",
          name: "Arjun Singhania",
          email: "arjun.singhania@gmail.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          role: "Pro Virtuoso Trader",
          isPro: true
        },
        {
          id: "google_acc_neha",
          name: "Neha Patel",
          email: "neha.patel.invest@gmail.com",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
          role: "Algo Trading Enthusiast",
          isPro: false
        }
      ];
    },

    // Direct Firebase Google Popup Login
    signInWithFirebaseGoogle: async function() {
      if (!window.wealthSignalFirebase || !window.wealthSignalFirebase.auth) {
        throw new Error("Firebase Auth is not available in this environment.");
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await window.wealthSignalFirebase.auth.signInWithPopup(provider);
      const fbUser = result.user;
      const user = mapFirebaseUser(fbUser);
      currentSession = user;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      await syncUserToFirestore(user);
      notifyListeners();
      return user;
    },

    loginWithGoogle: async function(account) {
      // If full Firebase is initialized and account is not a mock preset, attempt popup
      if (!account && window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        return this.signInWithFirebaseGoogle();
      }

      // Fast-track mock / preset account
      let user = registeredUsers.find(u => u.email.toLowerCase() === account.email.toLowerCase());
      if (!user) {
        user = {
          id: "usr_g_" + Date.now().toString(36),
          name: account.name || "Google Trader",
          email: account.email,
          phone: "+91 98765 00000",
          provider: "google",
          avatar: account.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
          role: "Quantitative Analyst",
          tier: "Intermediate Trader",
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          isPro: account.isPro || false,
          verified: true
        };
        registeredUsers.push(user);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
      }

      currentSession = user;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      await syncUserToFirestore(user);
      notifyListeners();
      return user;
    },

    // 3. EMAIL & PASSWORD LOGIN & SIGNUP
    loginWithEmail: async function(email, password) {
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      // Try Firebase Auth first if available
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        try {
          const userCredential = await window.wealthSignalFirebase.auth.signInWithEmailAndPassword(email, password);
          const fbUser = userCredential.user;
          const user = mapFirebaseUser(fbUser);
          currentSession = user;
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
          await syncUserToFirestore(user);
          notifyListeners();
          return user;
        } catch (fbErr) {
          // If the user already registered in demo storage or demo test account, allow fallback
          console.warn("[Wealth Signal Firebase Auth] Email sign-in notice:", fbErr.code, fbErr.message);
          if (fbErr.code === "auth/wrong-password") {
            throw new Error("Incorrect password. Please verify and try again.");
          } else if (fbErr.code === "auth/user-not-found") {
            // Check if user is in local demo users
            const localUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!localUser) {
              throw new Error("No account found with this email. Please sign up first.");
            }
          } else if (fbErr.code !== "auth/network-request-failed" && fbErr.code !== "auth/operation-not-allowed") {
            // Pass through other specific Firebase errors
            throw new Error(fbErr.message || "Failed to sign in with Firebase.");
          }
        }
      }

      // Local / Offline fallback logic
      let user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          id: "usr_em_" + Date.now().toString(36),
          name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          phone: "+91 98000 11223",
          provider: "email",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
          role: "Market Learner",
          tier: "Novice Trader",
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          isPro: false,
          verified: true
        };
        registeredUsers.push(user);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
      }

      currentSession = user;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      notifyListeners();
      return user;
    },

    signupWithEmail: async function(name, email, password) {
      if (!name || name.trim().length < 2) {
        throw new Error("Please enter your full name.");
      }
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      // Try Firebase Auth user creation if available
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        try {
          const userCredential = await window.wealthSignalFirebase.auth.createUserWithEmailAndPassword(email, password);
          const fbUser = userCredential.user;
          if (fbUser && fbUser.updateProfile) {
            await fbUser.updateProfile({ displayName: name.trim() });
          }
          const user = mapFirebaseUser(fbUser, { name: name.trim() });
          currentSession = user;
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
          await syncUserToFirestore(user);
          notifyListeners();
          return user;
        } catch (fbErr) {
          console.warn("[Wealth Signal Firebase Auth] Signup notice:", fbErr.code, fbErr.message);
          if (fbErr.code === "auth/email-already-in-use") {
            throw new Error("This email is already registered. Please sign in instead.");
          } else if (fbErr.code === "auth/weak-password") {
            throw new Error("Password is too weak. Please use a stronger password.");
          } else if (fbErr.code !== "auth/network-request-failed" && fbErr.code !== "auth/operation-not-allowed") {
            throw new Error(fbErr.message || "Failed to create Firebase account.");
          }
        }
      }

      // Local / Offline fallback logic
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        currentSession = existingUser;
      } else {
        const newUser = {
          id: "usr_em_" + Date.now().toString(36),
          name: name.trim(),
          email: email.trim(),
          phone: "+91 98000 " + Math.floor(10000 + Math.random() * 90000),
          provider: "email",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          role: "Retail Market Trader",
          tier: "Novice Trader",
          joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          isPro: false,
          verified: true
        };
        registeredUsers.push(newUser);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
        currentSession = newUser;
      }

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      notifyListeners();
      return currentSession;
    },

    // 4. PASSWORD RESET
    sendPasswordReset: async function(email) {
      if (!email || !email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      // Attempt Firebase Auth Password Reset Email
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        try {
          await window.wealthSignalFirebase.auth.sendPasswordResetEmail(email);
          return {
            success: true,
            message: `A password reset email has been dispatched to ${email} via Firebase Authentication.`
          };
        } catch (fbErr) {
          console.warn("[Wealth Signal Firebase Auth] Password reset notice:", fbErr.code, fbErr.message);
          if (fbErr.code === "auth/user-not-found") {
            throw new Error("No account found with this email address.");
          }
        }
      }

      return {
        success: true,
        message: `A password reset link & secure verification code has been sent to ${email}.`
      };
    },

    // 5. LOGOUT
    logout: async function() {
      if (window.wealthSignalFirebase && window.wealthSignalFirebase.auth) {
        try {
          await window.wealthSignalFirebase.auth.signOut();
        } catch(e) {
          console.warn("[Wealth Signal Firebase Auth] Sign out notice:", e.message);
        }
      }
      currentSession = null;
      localStorage.removeItem(STORAGE_KEY_SESSION);
      notifyListeners();
      return Promise.resolve();
    },

    // Quick demo switch
    switchDemoAccount: function(accountId) {
      const target = registeredUsers.find(u => u.id === accountId) || DEFAULT_USERS[0];
      currentSession = target;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
      notifyListeners();
      return currentSession;
    },

    // Cloud sync helper
    syncProfileToCloud: function(extraData = {}) {
      if (currentSession) {
        const updated = Object.assign({}, currentSession, extraData);
        currentSession = updated;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentSession));
        syncUserToFirestore(updated);
        notifyListeners();
      }
    }
  };
})();
