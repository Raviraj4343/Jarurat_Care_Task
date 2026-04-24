import { useState } from "react";
import { useSupportRequests } from "../hooks/useSupportRequests";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { SupportForm } from "../components/SupportForm.jsx";
import { SupportRequestCard } from "../components/SupportRequestCard.jsx";

const getStateValue = (location = "") => {
  const parts = location
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : location.trim().toLowerCase();
};

export function SupportPage({ theme, onToggleTheme }) {
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
  const [filters, setFilters] = useState({
    search: "",
    state: "",
    location: "",
    role: "all",
    supportType: "all",
    requestPriority: "all",
    category: "all"
  });

  const filteredRequests = requests.filter((request) => {
    const searchValue = filters.search.trim().toLowerCase();
    const stateValue = filters.state.trim().toLowerCase();
    const locationValue = filters.location.trim().toLowerCase();
    const requestLocation = (request.location || "").toLowerCase();
    const requestText = [
      request.fullName,
      request.email,
      request.phone,
      request.location,
      request.message,
      request.aiSummary?.issueSummary,
      request.aiSummary?.suggestion
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchValue && !requestText.includes(searchValue)) {
      return false;
    }

    if (stateValue && !getStateValue(request.location).includes(stateValue)) {
      return false;
    }

    if (locationValue && !requestLocation.includes(locationValue)) {
      return false;
    }

    if (filters.role !== "all" && request.role !== filters.role) {
      return false;
    }

    if (filters.supportType !== "all" && request.supportType !== filters.supportType) {
      return false;
    }

    if (filters.requestPriority !== "all" && request.requestPriority !== filters.requestPriority) {
      return false;
    }

    if (filters.category !== "all" && request.aiSummary?.category !== filters.category) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      state: "",
      location: "",
      role: "all",
      supportType: "all",
      requestPriority: "all",
      category: "all"
    });
  };

  const isDarkTheme = theme === "dark";
  const themeActionLabel = isDarkTheme ? "Switch to light mode" : "Switch to dark mode";

  return (
    <main className="page-shell">
      <section className="page-header">
        <div className="page-header__topbar">
          <div>
            <p className="page-header__eyebrow">Jarurat Care</p>
            <h1>Healthcare support request form</h1>
            <p>
              Submit a request and review the saved details with the AI-generated summary.
            </p>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={themeActionLabel}
            title={themeActionLabel}
          >
            {isDarkTheme ? (
              <svg
                className="theme-toggle__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 4V2m0 20v-2m8-8h2M2 12h2m12.95 4.95 1.41 1.41M3.64 3.64l1.41 1.41m11.9-1.41-1.41 1.41M5.05 16.95l-1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="theme-toggle__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span>{isDarkTheme ? "Light" : "Dark"}</span>
          </button>
        </div>
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
          <div className="section-heading section-heading--row">
            <div>
              <h2>Submitted requests</h2>
              <p>Each entry shows the request and the generated summary.</p>
            </div>
            <span className="results-count">{filteredRequests.length} shown</span>
          </div>

          <div className="filters-panel">
            <input
              className="field__input"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search name, message, email"
            />
            <input
              className="field__input"
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="Filter by state"
            />
            <input
              className="field__input"
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Filter by city or location"
            />
            <select
              className="field__input"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="all">All roles</option>
              <option value="patient">Patient</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <select
              className="field__input"
              name="supportType"
              value={filters.supportType}
              onChange={handleFilterChange}
            >
              <option value="all">All support types</option>
              <option value="medical">Medical</option>
              <option value="mental-health">Mental health</option>
              <option value="transport">Transport</option>
              <option value="medicine">Medicine</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
            <select
              className="field__input"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All categories</option>
              <option value="urgent">Urgent</option>
              <option value="mild">Mild</option>
              <option value="unknown">Unknown</option>
            </select>
            <select
              className="field__input"
              name="requestPriority"
              value={filters.requestPriority}
              onChange={handleFilterChange}
            >
              <option value="all">All user priorities</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="mild">Mild</option>
            </select>
            <button className="filter-reset-button" type="button" onClick={resetFilters}>
              Clear filters
            </button>
          </div>

          {isLoading ? <p className="empty-state">Loading support requests...</p> : null}

          {!isLoading && requests.length === 0 ? (
            <p className="empty-state">No requests have been submitted yet.</p>
          ) : null}

          {!isLoading && requests.length > 0 && filteredRequests.length === 0 ? (
            <p className="empty-state">No requests match the current filters.</p>
          ) : null}

          <div className="request-list request-list--scrollable">
            {filteredRequests.map((request) => (
              <SupportRequestCard key={request._id} request={request} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
