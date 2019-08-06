module.exports = {


  friendlyName: 'Add Stage to Project',


  description: 'Add new stage to project.',


  inputs: {

    id: {
      type: 'number',
      required: true,
    }

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      outputDescription: 'The newly created `Stage`.',
      outputExample: {}
    },
  },


  fn: async function ({ id }) {

    // Find project
    let project = await Project.findOne({ id: id }).populate('stages');

    // Ensure Project still exists
    if (!project) {
      throw 'notFound';
    }

    // Add new Stage to Project
    let stage = await Stage.create({ title: 'New stage', project: project.id, position: project.stages.length + 1 }).fetch();
    // Empty array for tasks
    stage.tasks = [];

    return {
      stage
    }
  }


};
