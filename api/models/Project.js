/**
 * Project.js
 *
 * Projects for a client
 */
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    slug: { type: 'string' },
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
