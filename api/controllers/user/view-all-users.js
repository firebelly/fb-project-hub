module.exports = {


  friendlyName: 'View All Users',


  description: 'Display list of all users.',


  exits: {

    success: {
      viewTemplatePath: 'pages/user/all-users'
    }

  },


  fn: async function () {

    var moment = require('moment');
    var users = await User.find().populate('clients');
    for (let user of users) {
      user.lastSeenAtHumanDate = user.lastSeenAt > 0 ? moment.unix(user.lastSeenAt).format('MM/DD/YYYY') : 'Never';
    }

    // Respond with view.
    return {
      users
    };

  }


};
