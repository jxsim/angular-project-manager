const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const type = 'tasks';
const attributes = ['taskDescription', 'priority', 'startDate', 'endDate', 'status', 'isParent', 'parentTask', 'project', 'user'];

module.exports = new JSONAPISerializer(type, { attributes, keyForAttribute: 'camelCase' });
