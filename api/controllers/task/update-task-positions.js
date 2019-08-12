module.exports = {


  friendlyName: 'Set Tasks Stage and Position',


  description: 'Update tasks to set stage and positions after dragging them around.',


  inputs: {

    tasks: {
      type: ['number'],
      required: true
    },

    stageId: {
      type: 'number',
      required: true
    },
  },


  exits: {
    success: {
      description: 'Tasks updated.'
    },
  },


  fn: async function ({ tasks, stageId }) {
    let position = 10;
    for (let id of tasks) {
      await Task.update({ id }).set({
        position: position,
        stage: stageId,
      });
      position += 10;
    }
  }


};
