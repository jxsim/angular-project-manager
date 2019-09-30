const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const type = 'tasks';
const attributes = ['taskDescription', 'priority', 'startDate', 'endDate', 'status', 'parentId', 'projectId'];

module.exports = new JSONAPISerializer(type, { attributes, keyForAttribute: 'camelCase' });
