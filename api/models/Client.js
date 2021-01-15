/**
 * Client.js
 *
 * A client who we assign projects to
 */
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
    archived: { type: 'boolean', defaultsTo: false },
  },
};
