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

    slug: {
      type: 'string',
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    slugAlreadyInUse: {
      statusCode: 409,
      description: 'The provided slug address is already in use.',
    },
    success: {
      description: 'Project updated.'
    },
  },


  fn: async function ({ id, title, slug }) {
    let project = await Project.findOne({ id });
    let redirectTo = '';

    // Ensure Project still exists
    if (!project) {
      throw 'notFound';
    }

    // Check if slug in use (if not blank)
    if (slug !== '') {
      let projectWithSlug = await Project.findOne({
        id: { '!=' : id },
        slug: slug,
      });
      if (projectWithSlug) {
        throw 'slugAlreadyInUse'
      }
    }

    // Update the `Project` record
    await Project.update({ id }).set({
      title: title,
      slug: slug,
    });

    // Redirect if slug changed
    if (project.slug !== slug) {
      redirectTo = '/projects/' + (slug || id);
    }
    return {
      redirectTo
    };
  }


};
