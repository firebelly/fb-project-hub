module.exports = {


  friendlyName: 'View All Projects',


  description: 'Display list of all clients + projects.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/all-projects'
    }

  },


  fn: async function () {

    var clients = await Client.find().populate('projects').populate('users');
    for (let client of clients) {
      client.user_ids = _.map(client.users, 'id');
    }
    var users = await User.find();

    // Respond with view.
    return {
      clients,
      users
    };

  }


};
