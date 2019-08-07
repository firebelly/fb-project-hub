module.exports = {


  friendlyName: 'Delete User',


  description: 'Delete a user from ajax button.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      description: 'User deleted.'
    },
  },


  fn: async function ({ id  }) {
    let user = await User.findOne({ id });

    // Ensure the thing still exists.
    if (!user) {
      throw 'notFound';
    }

    // Destroy the record
    await User.destroyOne({ id });
  }


};
