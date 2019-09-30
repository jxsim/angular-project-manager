const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const type = 'projects';
const attributes = ['projectDescription', 'priority', 'startDate', 'endDate'];

module.exports = new JSONAPISerializer(type, { attributes, keyForAttribute: 'camelCase' });
