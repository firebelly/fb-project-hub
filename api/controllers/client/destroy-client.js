module.exports = {


  friendlyName: 'Delete Client',


  description: 'Delete a client from ajax button.',


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
      description: 'Client deleted.'
    },
  },


  fn: async function ({ id  }) {
    let client = await Client.findOne({ id });

    // Ensure the thing still exists.
    if (!client) {
      throw 'notFound';
    }

    // Archive the record
    await Client.archiveOne({ id });
  }


};
