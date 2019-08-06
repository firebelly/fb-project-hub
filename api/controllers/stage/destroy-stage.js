module.exports = {


  friendlyName: 'Delete Stage',


  description: 'Delete a stage from ajax button.',


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
      description: 'Stage deleted.'
    },
  },


  fn: async function ({ id  }) {
    let stage = await Stage.findOne({ id });

    // Ensure the thing still exists.
    if (!stage) {
      throw 'notFound';
    }

    // Destroy relations
    await Task.destroy({ stage: stage.id });

    // Destroy the record
    await Stage.destroyOne({ id });
  }


};
