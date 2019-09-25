/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"addClient":{"verb":"POST","url":"/api/v1/client/add-client","args":[]},"addProject":{"verb":"POST","url":"/api/v1/client/add-project/:id","args":["id"]},"updateClient":{"verb":"PUT","url":"/api/v1/client/:id","args":["id","title","user_ids"]},"destroyClient":{"verb":"DELETE","url":"/api/v1/client/:id","args":["id"]},"updateProject":{"verb":"PUT","url":"/api/v1/project/:id","args":["id","title","slug"]},"addStage":{"verb":"POST","url":"/api/v1/project/add-stage/:id","args":["id"]},"updateProjectPositions":{"verb":"PUT","url":"/api/v1/project/update-project-positions","args":["projects"]},"destroyProject":{"verb":"DELETE","url":"/api/v1/project/:id","args":["id"]},"addTask":{"verb":"POST","url":"/api/v1/stage/add-task/:id","args":["id"]},"updateStagePositions":{"verb":"POST","url":"/api/v1/stage/update-stage-positions","args":["stages"]},"updateStage":{"verb":"PUT","url":"/api/v1/stage/:id","args":["id","title"]},"destroyStage":{"verb":"DELETE","url":"/api/v1/stage/:id","args":["id"]},"updateTask":{"verb":"PUT","url":"/api/v1/task/:id","args":["id","title","due_formatted","url","status"]},"updateTaskPositions":{"verb":"PUT","url":"/api/v1/task/update-task-positions","args":["tasks","stageId"]},"destroyTask":{"verb":"DELETE","url":"/api/v1/task/:id","args":["id"]},"addUser":{"verb":"POST","url":"/api/v1/user/add-user","args":[]},"updateUser":{"verb":"PUT","url":"/api/v1/user/:id","args":["id","fullName","emailAddress","isSuperAdmin","client_ids","newPassword"]},"destroyUser":{"verb":"DELETE","url":"/api/v1/user/:id","args":["id"]}}
  /* eslint-enable */

});
