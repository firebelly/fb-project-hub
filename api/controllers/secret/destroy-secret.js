module.exports = {


  friendlyName: 'Delete Secret',


  description: 'Delete a secret from ajax button.',


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
      description: 'Secret deleted.'
    },
  },


  fn: async function ({ id  }) {
    let secret = await Secret.findOne({ id });

    // Ensure the thing still exists.
    if (!secret) {
      throw 'notFound';
    }

    // Destroy the record
    await Secret.destroyOne({ id });
  }


};
