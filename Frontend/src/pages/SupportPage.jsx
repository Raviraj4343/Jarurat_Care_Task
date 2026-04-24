import { useSupportRequests } from "../hooks/useSupportRequests";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { SupportForm } from "../components/SupportForm.jsx";
import { SupportRequestCard } from "../components/SupportRequestCard.jsx";

export function SupportPage() {
  const {
    requests,
    isLoading,
    isSubmitting,
    error,
    submitSuccess,
    submitRequest,
    clearMessages,
    initialFormState
  } = useSupportRequests();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="hero__eyebrow">Jarurat Care</p>
          <h1>Healthcare support intake for patients and community volunteers.</h1>
          <p className="hero__text">
            This mini NGO dashboard captures support requests, stores them safely, and adds a
            concise AI summary grounded only in the submitted message.
          </p>
        </div>

        <div className="hero__panel">
          <p className="hero__panel-title">AI output contract</p>
          <ul className="hero__panel-list">
            <li>Issue summary</li>
            <li>Category: mild, urgent, or unknown</li>
            <li>Basic suggestion with no added facts</li>
          </ul>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-heading">
            <h2>Request support</h2>
            <p>Fill out the form and review the structured result once it is saved.</p>
          </div>

          <StatusBanner tone="error" message={error} />
          <StatusBanner tone="success" message={submitSuccess} />

          <SupportForm
            initialValues={initialFormState}
            isSubmitting={isSubmitting}
            onSubmit={submitRequest}
            onFocusField={clearMessages}
          />
        </div>

        <div className="panel panel--requests">
          <div className="section-heading">
            <h2>Submitted requests</h2>
            <p>Each card shows the original request alongside the AI-generated summary.</p>
          </div>

          {isLoading ? <p className="empty-state">Loading support requests...</p> : null}

          {!isLoading && requests.length === 0 ? (
            <p className="empty-state">No requests have been submitted yet.</p>
          ) : null}

          <div className="request-list">
            {requests.map((request) => (
              <SupportRequestCard key={request._id} request={request} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
