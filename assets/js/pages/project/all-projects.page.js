parasails.registerPage('all-projects', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formErrors: {},
    selectedClient: undefined,

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Modals
    editClientModalOpen: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    // Focus first input when opening modal
    $('body').on('shown.bs.modal', '.mdl', function () {
      var el = $('.modal-dialog input:visible:enabled:first');
      el.focus();
      // New item dialog? Select placeholder title
      if (el.val().match(/^New/)) {
        el.select();
      }
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {



    ///////////////////////
    // Client forms/modals

    // Adding client
    clickAddClient: async function() {
      // Returns new client
      let result = await Cloud.addClient();
      this.clients.push(result.client);

      // Set form data to stage that was clicked
      this.selectedClient = result.client;
      this.formData = this.selectedClient;

      // Open edit client modal w/ new client
      this.editClientModalOpen = true;
    },

    // Adding project for client
    clickAddProject: async function(clientId) {
      // Submit to client/add-project, returns new project
      let result = await Cloud.addProject(clientId);
      this.goto('/projects/' + result.project.id + '#new');
    },

    // Deleting client
    clickDestroyClient: async function(clientId) {
      if (confirm('Are you sure? All client’s projects and tasks will also be deleted.')) {
        _.remove(this.clients, { id: clientId });
        await Cloud.destroyClient(clientId);
        this._clearEditClientModal();
      }
    },


    _clearEditClientModal: function() {
      this.editClientModalOpen = false;
      this.selectedClient = undefined;
      this.cloudError = '';
    },

    clickEditClient: function(clientId) {
      // Abort if not admin
      if (!this.me.isSuperAdmin) {
        return false;
      }

      // Find client by id
      this.selectedClient = _.find(this.clients, { id: clientId })

      // Set form data to client that was clicked
      this.formData = this.selectedClient;

      // Open modal
      this.editClientModalOpen = true;
    },

    closeEditClientModal: function() {
      this._clearEditClientModal();
    },

    parseForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedClient.id }, this.formData);

      // Validate data
      if(!argins.title) {
        this.formErrors.title = true;
      }

      // If any errors, just return (vuejs will show errors based on formErrors state)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

    submittedForm: function() {
      this._clearEditClientModal();
    },

  }
});
