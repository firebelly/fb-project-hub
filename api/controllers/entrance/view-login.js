module.exports = {


  friendlyName: 'View login',


  description: 'Display "Login" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/login',
    },

    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

    if (this.req.me) {
      throw {redirect: '/'};
    }

    // Sending along a redirect after login?
    let next = this.req.query.next ? this.req.query.next : '';

    return {
      next
    };

  }


};
