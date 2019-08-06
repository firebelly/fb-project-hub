module.exports = {


  friendlyName: 'Delete Task',


  description: 'Delete a task from ajax button.',


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
      description: 'Task deleted.'
    },
  },


  fn: async function ({ id  }) {
    let task = await Task.findOne({ id });

    // Ensure the thing still exists.
    if (!task) {
      throw 'notFound';
    }

    // Destroy the record
    await Task.destroyOne({ id });
  }


};
