module.exports = {


  friendlyName: 'Add User',


  description: 'Add new temp user from admin form.',


  inputs: {
  },


  exits: {
    success: {
      outputDescription: 'The newly created `User`.',
      outputExample: {}
    },
  },


  fn: async function ({ fullName, emailAddress, isSuperAdmin, password }) {

    var user = await User.create({
      fullName: 'New User',
      emailAddress: 'user@foo.com',
      password: await sails.helpers.passwords.hashPassword('abc123')
    })
    .intercept('E_UNIQUE', 'emailAlreadyInUse')
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();

    // Vars for view
    user.lastSeenAtHumanDate = 'Never';
    user.clients = [];

    return {
      user
    }
  }


};
