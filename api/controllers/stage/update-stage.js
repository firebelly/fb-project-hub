module.exports = {


  friendlyName: 'Update Stage',


  description: 'Update stage details from ajax form.',


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
      description: 'Stage updated.'
    },
  },


  fn: async function ({ id, title }) {
    var stage = await Stage.findOne({ id });

    // Ensure Stage still exists
    if (!stage) {
      throw 'notFound';
    }

    // Update the `Stage` record
    await Stage.update({ id }).set({
      title: title,
    });
  }


};
