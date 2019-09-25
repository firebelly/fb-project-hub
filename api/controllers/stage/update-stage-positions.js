module.exports = {


  friendlyName: 'Set Stage Positions',


  description: 'Update stage positions after dragging them around.',


  inputs: {

    stages: {
      type: ['number'],
      required: true
    },
  },


  exits: {
    success: {
      description: 'Stages updated.'
    },
  },


  fn: async function ({ stages }) {
    console.log(stages);
    let position = 10;
    for (let id of stages) {
      await Stage.update({ id }).set({
        position: position
      });
      position += 10;
    }
  }


};
