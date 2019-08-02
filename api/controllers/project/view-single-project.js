module.exports = {


  friendlyName: 'View single',


  description: 'Display "Single" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/project/single-project'
    },

    notFound: {
      responseType: 'notFound'
    },

  },


  fn: async function () {
    var moment = require('moment');

    var project = await Project.findOne({ id: this.req.param('id') }).populate('client');
    if (!project) {
      throw 'notFound';
    }
    var stages = await Stage.find({ project: project.id }).populate('tasks');

    // Human friendly format of due date
    for (var stage of stages) {
      for (var task of stage.tasks) {
        task.due_formatted = moment.unix(task.due).format('MM/YY');
        task.due_formatted_full = moment.unix(task.due).format('MM/DD/YYYY');
        task.status_slug = task.status.replace(/ /g, '-').toLowerCase();
      }
    }

    // Respond with view.
    return {
      project,
      stages,
    };

  }


};
