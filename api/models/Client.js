// api/models/Client.js
module.exports = {
  attributes: {
    title: { type: 'string', required: true },
    projects: {
      collection: 'Project',
      via: 'client'
    },
    users: {
      collection: 'User',
      via: 'clients'
    },
  },
};
