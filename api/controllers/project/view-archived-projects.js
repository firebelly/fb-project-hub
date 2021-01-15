module.exports = {


  friendlyName: 'View All Archived Projects',


  description: 'Display list of all archived clients + projects.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/archived-projects'
    }

  },


  fn: async function () {
    let clients = [];
    // If we're an admin, get all clients
    if (this.req.me.isSuperAdmin) {
      clients = await Client.find({ where: { archived: true } }).populate('projects', { sort: 'position ASC' }).populate('users');
    } else {
      // Otherwise just pull clients for logged in non-admin user
      let user = await User.findOne({ id: this.req.me.id }).populate('clients');
      let client_ids = _.map(user.clients, 'id');
      clients = await Client.find({ id: { in: client_ids }}).populate('projects', { sort: 'position ASC' }).populate('users');
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
