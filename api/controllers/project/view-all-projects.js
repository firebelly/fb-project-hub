module.exports = {


  friendlyName: 'View All Projects',


  description: 'Display list of all clients + projects.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/all-projects'
    }

  },


  fn: async function () {
    let clients = [];
    // If we're an admin, get all clients
    if (this.req.me.isSuperAdmin) {
      clients = await Client.find().populate('projects').populate('users');
    } else {
      // Otherwise just pull clients for logged in non-admin user
      let user = await User.findOne({ id: this.req.me.id }).populate('clients');
      let client_ids = _.map(user.clients, 'id');
      clients = await Client.find({ id: { in: client_ids }}).populate('projects').populate('users');
    }

    // Populate form-friendly array of user_ids for each client
    for (let client of clients) {
      client.user_ids = _.map(client.users, 'id');
    }

    // Find all non-admin users for assigning to clients
    let users = await User.find({ isSuperAdmin: { '!=' : 1 } });

    // Respond with view
    return {
      clients,
      users
    };

  }


};
