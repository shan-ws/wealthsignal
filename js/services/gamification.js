// Arthashala Gamification Engine - XP, Badges, Daily Streaks & Risk-Adjusted Leaderboard
window.ArthashalaServices = window.ArthashalaServices || {};

(function() {
  const STORAGE_KEY_XP = "arthashala_user_xp";
  const STORAGE_KEY_BADGES = "arthashala_user_badges";
  const STORAGE_KEY_STREAK = "arthashala_user_streak";

  let xp = parseInt(localStorage.getItem(STORAGE_KEY_XP), 10);
  if (isNaN(xp)) xp = 1450; // Starts at intermediate Level 3 for rich demo experience

  let badges = JSON.parse(localStorage.getItem(STORAGE_KEY_BADGES)) || [
    { id: "badge-1", name: "First Market Trade", icon: "⚡", description: "Executed your first simulated order on NSE", unlocked: true, date: "2 days ago" },
    { id: "badge-2", name: "SEBI Compliance Savvy", icon: "📜", description: "Completed Indian Market Structure Academy Track", unlocked: true, date: "Yesterday" },
    { id: "badge-3", name: "Risk Disciplinarian", icon: "🛡️", description: "Maintained <2% risk and honored stop losses on 5 consecutive trades", unlocked: true, date: "Today" },
    { id: "badge-4", name: "Backtest Pioneer", icon: "🔬", description: "Ran full historical strategy backtesting simulation", unlocked: true, date: "Today" },
    { id: "badge-5", name: "Psychological Journaler", icon: "📝", description: "Logged trade reflection and identified FOMO patterns", unlocked: true, date: "3 days ago" },
    { id: "badge-6", name: "7-Day Streak Master", icon: "🔥", description: "Engaged in daily market analysis for 7 consecutive days", unlocked: false, date: "In Progress (5/7)" }
  ];

  let streak = parseInt(localStorage.getItem(STORAGE_KEY_STREAK), 10);
  if (isNaN(streak)) streak = 5;

  const tiers = [
    { level: 1, name: "Novice Observer", minXp: 0, maxXp: 300, color: "#94a3b8" },
    { level: 2, name: "Analytical Apprentice", minXp: 301, maxXp: 800, color: "#38bdf8" },
    { level: 3, name: "Strategic Trader", minXp: 801, maxXp: 1800, color: "#00e599" },
    { level: 4, name: "Risk Virtuoso", minXp: 1801, maxXp: 3200, color: "#a855f7" },
    { level: 5, name: "Market Maven", minXp: 3201, maxXp: 10000, color: "#f59e0b" }
  ];

  // Leaderboard ranking by Sharpe Ratio and Discipline rather than raw P&L
  const communityLeaderboard = [
    { rank: 1, name: "Aarav Sharma", city: "Bengaluru", sharpe: 2.84, winRate: 74, pnl: "₹2,48,500", level: "Market Maven", badge: "🏆" },
    { rank: 2, name: "Priya Sundaram", city: "Chennai", sharpe: 2.61, winRate: 71, pnl: "₹1,84,200", level: "Risk Virtuoso", badge: "🥈" },
    { rank: 3, name: "Rohan Varma", city: "Mumbai", sharpe: 2.45, winRate: 68, pnl: "₹1,95,000", level: "Risk Virtuoso", badge: "🥉" },
    { rank: 4, name: "Ananya Patel", city: "Ahmedabad", sharpe: 2.20, winRate: 66, pnl: "₹1,42,800", level: "Strategic Trader", badge: "⭐" },
    { rank: 5, name: "Vikram Malhotra", city: "Delhi NCR", sharpe: 2.05, winRate: 64, pnl: "₹1,12,000", level: "Strategic Trader", badge: "⭐" },
    { rank: 6, name: "You (Demo User)", city: "India", sharpe: 1.85, winRate: 67, pnl: "₹45,200", level: "Strategic Trader", isUser: true, badge: "🎯" },
    { rank: 7, name: "Kavita Nair", city: "Kochi", sharpe: 1.72, winRate: 61, pnl: "₹88,400", level: "Analytical Apprentice", badge: "⚡" },
    { rank: 8, name: "Devendra Singh", city: "Jaipur", sharpe: 1.58, winRate: 59, pnl: "₹64,200", level: "Analytical Apprentice", badge: "⚡" }
  ];

  function save() {
    localStorage.setItem(STORAGE_KEY_XP, xp.toString());
    localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
    localStorage.setItem(STORAGE_KEY_STREAK, streak.toString());
  }

  window.ArthashalaServices.gamification = {
    getXP: function() {
      return xp;
    },
    getStreak: function() {
      return streak;
    },
    getBadges: function() {
      return badges;
    },
    getLeaderboard: function() {
      return communityLeaderboard;
    },
    getCurrentTier: function() {
      const current = tiers.find(t => xp >= t.minXp && xp <= t.maxXp) || tiers[tiers.length - 1];
      const nextTier = tiers.find(t => t.level === current.level + 1);
      const progressInTier = xp - current.minXp;
      const tierRange = (nextTier ? nextTier.minXp : current.maxXp) - current.minXp;
      const progressPct = Math.min(100, Math.round((progressInTier / tierRange) * 100));

      return {
        ...current,
        nextTier: nextTier ? nextTier.name : "Maximum Tier",
        progressPct: progressPct,
        xpToNext: nextTier ? (nextTier.minXp - xp) : 0
      };
    },
    addXP: function(amount, reason = "Platform Activity") {
      xp += amount;
      save();
      
      // Dispatch toast event if UI is listening
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("arthashala_xp_awarded", {
          detail: { amount, reason, totalXp: xp }
        }));
      }
      return xp;
    },
    unlockBadge: function(badgeId) {
      const b = badges.find(x => x.id === badgeId);
      if (b && !b.unlocked) {
        b.unlocked = true;
        b.date = "Just Now";
        save();
        this.addXP(100, `Unlocked Badge: ${b.name}`);
        return true;
      }
      return false;
    }
  };
})();
