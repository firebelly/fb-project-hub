// api/models/Product.js
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    position: { type: 'number' },
    client: {
      model: 'Client'
    },
    stages: {
      collection: 'Stage',
      via: 'project'
    }
  },
};
