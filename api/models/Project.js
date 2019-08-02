// api/models/Product.js
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    client: {
      model: 'Client'
    },
    stages: {
      collection: 'Stage',
      via: 'project'
    }
  },
};
