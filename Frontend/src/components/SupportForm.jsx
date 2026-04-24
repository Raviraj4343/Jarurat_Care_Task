import { useState } from "react";
import { InputField } from "./InputField.jsx";
import { SelectField } from "./SelectField.jsx";
import { TextAreaField } from "./TextAreaField.jsx";

const roleOptions = [
  { value: "patient", label: "Patient" },
  { value: "volunteer", label: "Volunteer" }
];

const supportTypeOptions = [
  { value: "medical", label: "Medical" },
  { value: "mental-health", label: "Mental Health" },
  { value: "transport", label: "Transport" },
  { value: "medicine", label: "Medicine" },
  { value: "food", label: "Food" },
  { value: "other", label: "Other" }
];

const requestPriorityOptions = [
  { value: "normal", label: "Normal" },
  { value: "urgent", label: "Urgent" },
  { value: "mild", label: "Mild" }
];

const validateForm = (values) => {
  const errors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter the full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!/^[0-9+\-\s()]{7,20}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (values.location.trim().length < 2) {
    errors.location = "Location is required.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Please share at least 20 characters.";
  }

  if (!values.consent) {
    errors.consent = "You need to confirm consent before submitting.";
  }

  return errors;
};

export function SupportForm({ initialValues, isSubmitting, onSubmit, onFocusField }) {
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors((current) => ({ ...current, [name]: "" }));
    }

    if (onFocusField) {
      onFocusField();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await onSubmit(formValues);
    if (result?.createdRequest) {
      setFormValues(result.resetState);
      setFormErrors({});
    }
  };

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <div className="support-form__grid">
        <InputField
          id="fullName"
          label="Full name"
          value={formValues.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          error={formErrors.fullName}
        />
        <InputField
          id="email"
          label="Email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter email address"
          type="email"
          error={formErrors.email}
        />
        <InputField
          id="phone"
          label="Phone"
          value={formValues.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          error={formErrors.phone}
        />
        <InputField
          id="location"
          label="Location"
          value={formValues.location}
          onChange={handleChange}
          placeholder="City or district"
          error={formErrors.location}
        />
        <SelectField
          id="role"
          label="I am a"
          value={formValues.role}
          onChange={handleChange}
          options={roleOptions}
        />
        <SelectField
          id="supportType"
          label="Support needed"
          value={formValues.supportType}
          onChange={handleChange}
          options={supportTypeOptions}
        />
        <SelectField
          id="requestPriority"
          label="Request priority"
          value={formValues.requestPriority}
          onChange={handleChange}
          options={requestPriorityOptions}
        />
      </div>

      <TextAreaField
        id="message"
        label="Describe the need"
        value={formValues.message}
        onChange={handleChange}
        placeholder="Share the situation, what help is needed, and any immediate concern."
        error={formErrors.message}
      />

      <label className="consent-row">
        <input
          type="checkbox"
          name="consent"
          checked={formValues.consent}
          onChange={handleChange}
        />
        <span>I confirm the details above can be reviewed by the NGO support team.</span>
      </label>
      {formErrors.consent ? <span className="field__error">{formErrors.consent}</span> : null}

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit support request"}
      </button>
    </form>
  );
}
