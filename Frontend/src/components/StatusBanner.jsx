export function StatusBanner({ tone = "neutral", message }) {
  if (!message) {
    return null;
  }

  return <div className={`status-banner status-banner--${tone}`}>{message}</div>;
}
