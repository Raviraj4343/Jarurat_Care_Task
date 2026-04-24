export const createApiResponse = ({ success, message, data = null, error = null }) => ({
  success,
  message,
  data,
  error
});
