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

    let nextStageNum = project.stages.length + 1;

    // Add new Stage to Project
    let stage = await Stage.create({ title: 'Stage ' + nextStageNum, project: project.id, position: nextStageNum }).fetch();

    // Empty array of relations for view
    stage.tasks = [];

    return {
      stage
    }
  }


};
