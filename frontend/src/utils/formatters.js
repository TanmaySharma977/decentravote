export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export const timeLeft = (deadline) => {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return `${h}h ${m}m ${s}s`;
};

export const getTimeRemaining = (deadline) => {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    expired:  false,
    days:     Math.floor(diff / 86_400_000),
    hours:    Math.floor((diff % 86_400_000) / 3_600_000),
    minutes:  Math.floor((diff % 3_600_000) / 60_000),
    seconds:  Math.floor((diff % 60_000) / 1_000),
  };
};

export const formatTxHash = (hash) => hash ? `${hash.slice(0, 10)}...` : '';