const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const type = 'tasks';
const attributes = ['projectDescription', 'priority', 'startDate', 'endDate', 'isCompleted', 'manager'];

module.exports = new JSONAPISerializer(type, { attributes, keyForAttribute: 'camelCase' });
