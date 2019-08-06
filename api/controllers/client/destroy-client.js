module.exports = {


  friendlyName: 'Delete Client',


  description: 'Delete a client from ajax button.',


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
      description: 'Client deleted.'
    },
  },


  fn: async function ({ id  }) {
    let client = await Client.findOne({ id });

    // Ensure the thing still exists.
    if (!client) {
      throw 'notFound';
    }

    // Destroy relations
    let projects = await Project.find({ client: client.id }).populate('stages');
    for (let project of projects) {
      for (let stage of project.stages) {
        await Task.destroy({ stage: stage.id });
        await Stage.destroyOne({ id: stage.id });
      }
      await Project.destroyOne({ id: project.id });
    }

    // Destroy the record
    await Client.destroyOne({ id });
  }


};
