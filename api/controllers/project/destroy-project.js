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
    let project = await Project.findOne({ id });

    // Ensure the thing still exists.
    if (!project) {
      throw 'notFound';
    }

    // Archive the record
    await Project.archiveOne({ id });
  }


};
