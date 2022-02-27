// responses:
function success(data, statusCode) {
  return {
    statusCode: statusCode || 200,
    body: JSON.stringify(data),
  };
}

function error(errorMessages, statusCode) {
  const response = {
    errors: errorMessages,
  };

  return {
    statusCode: statusCode || 400,
    body: JSON.stringify(response),
  };
}

module.exports = {
  success,
  error,
};
