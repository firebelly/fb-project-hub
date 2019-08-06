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

    due_formatted: {
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


  fn: async function ({ id, title, due_formatted, url, status }) {
    var moment = require('moment');
    var task = await Task.findOne({ id });

    // Ensure the thing still exists.
    if (!task) {
      throw 'notFound';
    }

    // Format timestamp from datepicker
    var due_timestamp = '';
    if (due_formatted) {
      due_timestamp = moment(due_formatted, 'MM/YY').format('X');
    }

    // Update the `Task` record
    await Task.update({ id }).set({
      title: title,
      due: due_timestamp,
      url: url,
      status: status,
    });

  }


};
