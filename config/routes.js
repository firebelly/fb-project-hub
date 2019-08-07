/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  // ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  // ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  // ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /':                   { action: 'view-homepage-or-redirect' },
  'GET /projects/':          { action: 'project/view-all-projects' },
  'GET /projects/:id':       { action: 'project/view-single-project' },

  // 'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { action: 'entrance/view-confirmed-email' },

  'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /users':              { action: 'user/view-all-users' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  '/logout':                  '/api/v1/account/logout',


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  '/api/v1/account/logout':                                { action: 'account/logout' },
  'PUT    /api/v1/account/update-password':                { action: 'account/update-password' },
  'PUT    /api/v1/account/update-profile':                 { action: 'account/update-profile' },
  'PUT    /api/v1/account/update-billing-card':            { action: 'account/update-billing-card' },
  'PUT    /api/v1/entrance/login':                         { action: 'entrance/login' },
  // 'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST   /api/v1/entrance/send-password-recovery-email':  { action: 'entrance/send-password-recovery-email' },
  'POST   /api/v1/entrance/update-password-and-login':     { action: 'entrance/update-password-and-login' },

  'POST   /api/v1/client/add-client':                      { action: 'client/add-client' },
  'POST   /api/v1/client/add-project/:id':                 { action: 'client/add-project' },
  'PUT    /api/v1/client/:id':                             { action: 'client/update-client' },
  'DELETE /api/v1/client/:id':                             { action: 'client/destroy-client' },

  'PUT    /api/v1/project/:id':                            { action: 'project/update-project' },
  'POST   /api/v1/project/add-stage/:id':                  { action: 'project/add-stage' },
  'DELETE /api/v1/project/:id':                            { action: 'project/destroy-project' },

  'POST   /api/v1/stage/add-task/:id':                     { action: 'stage/add-task' },
  'PUT    /api/v1/stage/:id':                              { action: 'stage/update-stage' },
  'DELETE /api/v1/stage/:id':                              { action: 'stage/destroy-stage' },

  'PUT    /api/v1/task/:id':                               { action: 'task/update-task' },
  'DELETE /api/v1/task/:id':                               { action: 'task/destroy-task' },

  'POST   /api/v1/user/add-user':                          { action: 'user/add-user' },
  'PUT    /api/v1/user/:id':                               { action: 'user/update-user' },
  'DELETE /api/v1/user/:id':                               { action: 'user/destroy-user' },


};
