module.exports = {


  friendlyName: 'Add Project to Client',


  description: 'Add new project and assign to a client.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      outputDescription: 'The newly created `Project`.',
      outputExample: {}
    },
  },


  fn: async function ({ id }) {

    let moment = require('moment');
    let client = await Client.findOne({ id }).populate('projects');

    // Ensure Client still exists
    if (!client) {
      throw 'notFound';
    }

    // Add new Project for Client
    let project = await Project.create({ title: 'New Project', client: client.id, position: client.projects.length + 1 }).fetch();

    // Assign starter stage + task to project
    var stage = await Stage.create({ title: 'Stage 1', project: project.id }).fetch();
    var task = await Task.create({ title: 'Task 1', stage: stage.id, position: 1, status: 'In Progress', due: moment().add(1, 'months').format('X') }).fetch();

    return {
      project
    }
  }


};
