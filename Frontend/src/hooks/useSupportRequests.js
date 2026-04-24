import { useEffect, useState } from "react";
import { createSupportRequest, fetchSupportRequests } from "../api/supportApi";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  role: "patient",
  location: "",
  supportType: "medical",
  requestPriority: "normal",
  message: "",
  consent: false
};

export const useSupportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSupportRequests();
        setRequests(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const submitRequest = async (formValues) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSubmitSuccess("");

      const createdRequest = await createSupportRequest(formValues);
      setRequests((current) => [createdRequest, ...current]);
      setSubmitSuccess("Your support request has been submitted.");

      return { createdRequest, resetState: initialFormState };
    } catch (submitError) {
      setError(submitError.message);
      return { createdRequest: null, resetState: formValues };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    requests,
    isLoading,
    isSubmitting,
    error,
    submitSuccess,
    submitRequest,
    clearMessages: () => {
      setError("");
      setSubmitSuccess("");
    },
    initialFormState
  };
};
