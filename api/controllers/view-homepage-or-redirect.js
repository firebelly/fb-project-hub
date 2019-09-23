module.exports = {


  friendlyName: 'View homepage or redirect',


  description: 'Display or redirect to the appropriate homepage, depending on login status.',


  exits: {

    success: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the projects list.'
    },

  },


  fn: async function () {

    if (this.req.me) {

      // Default redirect is to all projects page
      let redirectUrl = '/projects/';

      // If not admin, check if user has a single project
      if (!this.req.me.isSuperAdmin) {
        let user = await User.findOne({ id: this.req.me.id }).populate('clients');
        let client_ids = _.map(user.clients, 'id');
        let clients = await Client.find({ id: { in: client_ids }}).populate('projects');
        // If user has only one project, redirect to that
        if (clients.length === 1 && clients[0].projects.length === 1) {
          redirectUrl = '/projects/' + (clients[0].projects[0].slug ? clients[0].projects[0].slug : clients[0].projects[0].id) + '/';
        }
      }

      // Redirect to all projects page or single project
      throw {redirect: redirectUrl};

    }

    // Remove this if we want a homepage for some reason?
    throw {redirect: '/login/'};

    return {};

  }


};
