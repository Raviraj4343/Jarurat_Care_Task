const formatLabel = (value) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function SupportRequestCard({ request }) {
  return (
    <article className="request-card">
      <div className="request-card__header">
        <div>
          <p className="request-card__eyebrow">{formatLabel(request.role)}</p>
          <h3>{request.fullName}</h3>
        </div>
        <span className={`severity-pill severity-pill--${request.aiSummary.category}`}>
          {request.aiSummary.category}
        </span>
      </div>

      <div className="request-card__meta">
        <span>{request.supportType}</span>
        <span>User priority: {request.requestPriority}</span>
        <span>{request.location}</span>
        <span>{request.email}</span>
        <span>{new Date(request.createdAt).toLocaleString()}</span>
      </div>

      <p className="request-card__message">{request.message}</p>

      <div className="summary-box">
        <h4>AI Summary</h4>
        <p>
          <strong>Issue:</strong> {request.aiSummary.issueSummary}
        </p>
        <p>
          <strong>Category:</strong> {request.aiSummary.category}
        </p>
        <p>
          <strong>Suggestion:</strong> {request.aiSummary.suggestion}
        </p>
      </div>
    </article>
  );
}
