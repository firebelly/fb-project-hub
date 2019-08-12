module.exports = {


  friendlyName: 'Set Project Positions',


  description: 'Update projects positions after dragging them around.',


  inputs: {

    projects: {
      type: ['number'],
      required: true
    },

  },


  exits: {
    success: {
      description: 'Projects updated.'
    },
  },


  fn: async function ({ projects }) {
    let position = 10;
    for (let id of projects) {
      await Project.update({ id }).set({
        position: position,
      });
      position += 10;
    }
  }


};
