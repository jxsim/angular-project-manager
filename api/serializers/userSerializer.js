const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const type = 'users';
const attributes = ['firstName', 'lastName', 'employeeId'];

module.exports = new JSONAPISerializer(type, { attributes, keyForAttribute: 'camelCase' });
