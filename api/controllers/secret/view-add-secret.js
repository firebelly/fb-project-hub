module.exports = {


  friendlyName: 'View add secret',


  description: 'Display form to create a new secret.',


  exits: {

    success: {
      statusCode: 200,
      viewTemplatePath: 'pages/secret/add-secret',
    },

  },


  fn: async function () {

    return {};

  }


};
