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
      <section className="page-header">
        <p className="page-header__eyebrow">Jarurat Care</p>
        <h1>Healthcare support request form</h1>
        <p>
          Submit a request and review the saved details with the AI-generated summary.
        </p>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="section-heading">
            <h2>Request support</h2>
            <p>Enter only the essential contact and support details.</p>
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
            <p>Each entry shows the request and the generated summary.</p>
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
