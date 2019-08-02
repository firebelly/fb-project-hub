module.exports = {


  friendlyName: 'Update Task',


  description: 'Update task details from ajax form.',


  inputs: {

    id: {
      type: 'number',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    due: {
      type: 'string'
    },

    url: {
      type: 'string',
    },

    status: {
      type: 'string',
    },

  },


  exits: {
    notFound: {
      responseType: 'notFound'
    },
    success: {
      description: 'Task updated.'
    },
  },


  fn: async function ({id, title, due, url, status}) {
    var moment = require('moment');
    var task = await Task.findOne({ id });

    // Ensure the thing still exists.
    if (!task) {
      throw 'notFound';
    }

    // Format timestamp from datepicker
    var due_timestamp = '';
    if (due) {
      due_timestamp = moment(due, 'MM/DD/YYYY').format('X');
    }

    // Update the `Task` record to show it is being borrowed.
    await Task.update({ id }).set({
      title: title,
      due: due_timestamp,
      url: url,
      status: status,
    });

  }


};
