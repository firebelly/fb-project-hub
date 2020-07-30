module.exports = {


  friendlyName: 'Add Secret',


  description: 'Add new secret from frontend form.',


  inputs: {

    content: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
    },

  },

  exits: {
    success: {
      outputDescription: 'The newly created `Secret`.',
      outputExample: {}
    },
  },


  fn: async function ({ content, name, email }) {

    var moment = require('moment');
    var secret = await Secret.create({
      name: name,
      content: content,
      email: email
    })
    .fetch();

    // Vars for view
    secret.createdAtHumanDate = moment.unix(secret.createdAt/1000).format('MM/DD/YY h:mma');

    // Send email to admins
    await sails.helpers.sendTemplateEmail.with({
      to: sails.config.custom.internalEmailAddress,
      subject: 'New Secret from '+name,
      template: 'email-new-secret',
      templateData: {
        name: secret.name,
        email: secret.email
      }
    });

    return {
      secret
    }
  }


};
