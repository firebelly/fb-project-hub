module.exports = {


  friendlyName: 'View All Projects',


  description: 'Display list of all clients + projects.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/all-projects'
    }

  },


  fn: async function () {

    var clients = await Client.find().populate('projects');

    // Respond with view.
    return {
      clients
    };

  }


};
