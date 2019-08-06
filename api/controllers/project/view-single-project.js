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
    let moment = require('moment');

    let project = await Project.findOne({ id: this.req.param('id') }).populate('client');
    if (!project) {
      throw 'notFound';
    }
    let stages = await Stage.find({ project: project.id }).populate('tasks');

    // Human friendly format of due date
    for (let stage of stages) {
      for (let task of stage.tasks) {
        task.due_formatted = moment.unix(task.due).format('MM/YY');
      }
    }

    // Respond with view.
    return {
      project,
      stages,
    };

  }


};
