module.exports = {


  friendlyName: 'Update Client',


  description: 'Update client details from ajax form.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    user_ids: {
      type: ['number'],
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      description: 'Client updated.'
    },
  },


  fn: async function ({ id, title, user_ids }) {
    var client = await Client.findOne({ id });

    // Ensure the thing still exists.
    if (!client) {
      throw 'notFound';
    }

    // Update the `Client` record
    await Client.update({ id }).set({
      title: title,
      users: user_ids,
    });
  }


};
