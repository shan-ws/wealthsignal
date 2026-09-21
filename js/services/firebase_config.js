// Wealth Signal Firebase Configuration & Initialization
// Project: wealthsignal-d1329
window.wealthSignalFirebaseConfig = {
  apiKey: "AIzaSyAqA30Lp6DQ9iZ-MF3vdEBs191PxtRsyvQ",
  authDomain: "wealthsignal-d1329.firebaseapp.com",
  projectId: "wealthsignal-d1329",
  storageBucket: "wealthsignal-d1329.firebasestorage.app",
  messagingSenderId: "73278564583",
  appId: "1:73278564583:web:4a164f0858d3d3f1e45a42",
  measurementId: "G-M3Z19EN8SQ"
};

window.wealthSignalFirebase = {
  initialized: false,
  app: null,
  auth: null,
  db: null,
  analytics: null,
  config: window.wealthSignalFirebaseConfig
};

(function() {
  if (typeof firebase !== "undefined") {
    try {
      if (!firebase.apps.length) {
        window.wealthSignalFirebase.app = firebase.initializeApp(window.wealthSignalFirebaseConfig);
      } else {
        window.wealthSignalFirebase.app = firebase.app();
      }

      if (typeof firebase.auth === "function") {
        window.wealthSignalFirebase.auth = firebase.auth();
      }

      if (typeof firebase.firestore === "function") {
        window.wealthSignalFirebase.db = firebase.firestore();
      }

      if (typeof firebase.analytics === "function") {
        try {
          window.wealthSignalFirebase.analytics = firebase.analytics();
        } catch (e) {
          // Analytics might not be supported in certain sandboxes or file:// protocols
        }
      }

      window.wealthSignalFirebase.initialized = true;
      console.log("[Wealth Signal] Firebase initialized successfully with project:", window.wealthSignalFirebaseConfig.projectId);
    } catch (err) {
      console.warn("[Wealth Signal] Firebase initialization note:", err.message);
    }
  } else {
    console.warn("[Wealth Signal] Firebase SDK not detected on window. Operating in hybrid/local mode.");
  }
})();
