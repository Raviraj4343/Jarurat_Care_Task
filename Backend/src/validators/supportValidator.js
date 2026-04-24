const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;
const roles = new Set(["patient", "volunteer"]);
const supportTypes = new Set(["medical", "mental-health", "transport", "medicine", "food", "other"]);
const requestPriorities = new Set(["normal", "urgent", "mild"]);

export const validateSupportSubmission = (payload = {}) => {
  const errors = [];

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long.");
  }

  if (!payload.email || !emailPattern.test(payload.email)) {
    errors.push("A valid email address is required.");
  }

  if (!payload.phone || !phonePattern.test(payload.phone)) {
    errors.push("A valid phone number is required.");
  }

  if (!payload.role || !roles.has(payload.role)) {
    errors.push("Role must be either patient or volunteer.");
  }

  if (!payload.location || payload.location.trim().length < 2) {
    errors.push("Location is required.");
  }

  if (!payload.supportType || !supportTypes.has(payload.supportType)) {
    errors.push("Support type is invalid.");
  }

  if (!payload.requestPriority || !requestPriorities.has(payload.requestPriority)) {
    errors.push("Request priority must be normal, urgent, or mild.");
  }

  if (!payload.message || payload.message.trim().length < 20) {
    errors.push("Message must be at least 20 characters long.");
  }

  if (payload.consent !== true) {
    errors.push("Consent is required before submitting the request.");
  }

  return errors;
};
