module.exports = {


  friendlyName: 'Delete Project',


  description: 'Delete a project from ajax button.',


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
      description: 'Project deleted.'
    },
  },


  fn: async function ({ id  }) {
    let project = await Project.findOne({ id }).populate('stages');

    // Ensure the thing still exists.
    if (!project) {
      throw 'notFound';
    }

    // Destroy relations
    for (let stage of project.stages) {
      await Task.destroy({ stage: stage.id });
      await Stage.destroyOne({ id: stage.id });
    }

    // Destroy the record
    await Project.destroyOne({ id });
  }


};
