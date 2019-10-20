const JSONAPIError = require('jsonapi-serializer').Error;

module.exports = (code, title) => {
  return new JSONAPIError({ code, title });
}
