module.exports = {


  friendlyName: 'Update Project',


  description: 'Update project details from ajax form.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      description: 'Project updated.'
    },
  },


  fn: async function ({ id, title }) {
    var project = await Project.findOne({ id });

    // Ensure Project still exists
    if (!project) {
      throw 'notFound';
    }

    // Update the `Project` record
    await Project.update({ id }).set({
      title: title,
    });
  }


};
