const formatLabel = (value, fallback = "Not provided") => {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export function SupportRequestCard({ request }) {
  const aiSummary = request.aiSummary || {};
  const severity = aiSummary.category || "unknown";
  const createdAt = request.createdAt ? new Date(request.createdAt).toLocaleString() : "Recently";

  return (
    <article className="request-card">
      <div className="request-card__header">
        <div>
          <p className="request-card__eyebrow">{formatLabel(request.role, "Request")}</p>
          <h3>{request.fullName || "Unnamed request"}</h3>
        </div>
        <span className={`severity-pill severity-pill--${severity}`}>
          {severity}
        </span>
      </div>

      <div className="request-card__meta">
        <span className="meta-pill">{formatLabel(request.supportType)}</span>
        <span className="meta-pill">Priority: {formatLabel(request.requestPriority, "Normal")}</span>
        <span className="meta-pill">{request.location || "Location not provided"}</span>
        <span className="meta-pill meta-pill--wrap">{request.email || "Email not provided"}</span>
        <span className="meta-pill">{createdAt}</span>
      </div>

      <p className="request-card__message">{request.message || "No additional message provided."}</p>

      <div className="summary-box">
        <h4>AI Summary</h4>
        <p>
          <strong>Issue:</strong> {aiSummary.issueSummary || "Summary not available."}
        </p>
        <p>
          <strong>Category:</strong> {severity}
        </p>
        <p>
          <strong>Suggestion:</strong> {aiSummary.suggestion || "No suggestion available."}
        </p>
      </div>
    </article>
  );
}
