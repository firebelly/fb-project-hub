module.exports = {


  friendlyName: 'Add Client',


  description: 'Add new client.',


  inputs: {

  },


  exits: {
    success: {
      outputDescription: 'The newly created `Client`.',
      outputExample: {}
    },
  },


  fn: async function ({ id }) {

    // Add new Client
    let client = await Client.create({ title: 'New client' }).fetch();

    // Empty array of relations for view
    client.user_ids = [];

    return {
      client
    }
  }


};
