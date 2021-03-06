module.exports = {


  friendlyName: 'Add Task to Stage',


  description: 'Add new task and assign to a stage.',


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
      outputDescription: 'The newly created `Task`.',
      outputExample: {}
    },
  },


  fn: async function ({ id }) {

    let moment = require('moment');
    let stage = await Stage.findOne({ id }).populate('tasks');

    // Ensure Stage still exists
    if (!stage) {
      throw 'notFound';
    }

    // Add new Task in Stage
    let task = await Task.create({ title: 'New Task', stage: stage.id, position: stage.tasks.length + 1, status: 'Not Started', due: moment().format('X') }).fetch();

    // Human-formatted date
    task.due_formatted = moment.unix(task.due).format('MM/DD/YYYY');

    return {
      task
    }
  }


};
