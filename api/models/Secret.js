/**
 * Secret.js
 *
 * A way to securely share credentials
 */

module.exports = {

  attributes: {
    name: { type: 'string' },
    email: { type: 'string' },
    viewed: { type: 'boolean' },
    content: {
      type: 'string',
      columnType: 'longtext',
      encrypt: true,
      required: true
    }
  },

};

