module.exports = {


  friendlyName: 'View All Secrets',


  description: 'Admin view of all secrets.',


  exits: {

    success: {
      viewTemplatePath: 'pages/secret/all-secrets'
    }

  },


  fn: async function () {

    var moment = require('moment');
    var secrets = await Secret.find().decrypt();

    for (let secret of secrets) {
      // Populate readable createdAt date
      secret.createdAtHumanDate = moment.unix(secret.createdAt/1000).format('MM/DD/YY h:mma');
    }

    // Respond with view.
    return {
      secrets
    };

  }


};
