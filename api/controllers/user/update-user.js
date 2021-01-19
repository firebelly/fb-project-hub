module.exports = {


  friendlyName: 'Update User',


  description: 'Update user details from ajax form.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

    fullName: {
      type: 'string',
      required: true
    },

    emailAddress: {
      type: 'string',
      required: true
    },

    isSuperAdmin: {
      type: 'number'
    },

    archived: {
      type: 'boolean'
    },

    client_ids: {
      type: ['number'],
    },

    newPassword: {
      type: 'string'
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    success: {
      description: 'User updated.'
    },
  },


  fn: async function ({ id, fullName, emailAddress, isSuperAdmin, archived, client_ids, newPassword }) {

    var user = await User.findOne({ id });

    // Ensure User still exists
    if (!user) {
      throw 'notFound';
    }

    // Update the `User` record
    await User.update({ id }).set(_.extend({
      fullName: fullName,
      emailAddress: emailAddress.toLowerCase(),
      isSuperAdmin: isSuperAdmin,
      archived: archived,
      clients: client_ids,
    }, newPassword? {
      password: await sails.helpers.passwords.hashPassword(newPassword)
    }:{}))
    .intercept('E_UNIQUE', 'emailAlreadyInUse')
    .intercept({name: 'UsageError'}, 'invalid');

  }


};
