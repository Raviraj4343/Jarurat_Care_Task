import { httpClient } from "./httpClient";

export const fetchSupportRequests = async () => {
  const response = await httpClient("/support-requests");
  return response.data || [];
};

export const createSupportRequest = async (payload) => {
  const response = await httpClient("/support-requests", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
};
