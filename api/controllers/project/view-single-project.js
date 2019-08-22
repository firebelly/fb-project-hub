module.exports = {


  friendlyName: 'View Single Project',


  description: 'Display single project page with all stages + tasks.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/single-project'
    },

    notFound: {
      responseType: 'notFound'
    },

  },


  fn: async function () {
    let moment = require('moment');
    let project = await Project.findOne({ id: this.req.param('id') }).populate('client');

    if (!project) {
      throw 'notFound';
    }

    // If not admin, check if we can view this project
    if (!this.req.me.isSuperAdmin) {
      let user = await User.findOne({ id: this.req.me.id }).populate('clients');
      let client_ids = _.map(user.clients, 'id');
      if (!client_ids.includes(project.client.id)) {
        throw 'notFound';
      }
    }

    // Pull stages + tasks for project
    let stages = await Stage.find({ project: project.id }).sort('position ASC').populate('tasks', { sort: 'position ASC' });

    // Human friendly format of due date
    for (let stage of stages) {
      for (let task of stage.tasks) {
        task.due_formatted = moment.unix(task.due).format('MM/DD/YYYY');
      }
    }

    // Respond with view
    return {
      project,
      stages,
    };

  }


};
