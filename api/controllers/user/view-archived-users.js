module.exports = {


  friendlyName: 'View All Archived Users',


  description: 'Display list of all archived users.',


  exits: {

    success: {
      viewTemplatePath: 'pages/user/archived-users'
    }

  },


  fn: async function () {

    var moment = require('moment');
    var users = await User.find({ where: { archived: true } }).populate('clients');
    var clients = await Client.find();

    for (let user of users) {
      // Populate readable lastSeenAt date
      user.lastSeenAtHumanDate = user.lastSeenAt > 0 ? moment.unix(user.lastSeenAt/1000).format('MM/DD/YY h:mma') : 'Never';
      // Populate form-friendly array of client_ids
      user.client_ids = _.map(user.clients, 'id');
    }

    // Respond with view.
    return {
      users,
      clients
    };

  }


};
