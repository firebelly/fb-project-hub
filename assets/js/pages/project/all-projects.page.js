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
      $('.modal-dialog input:visible:enabled:first').focus();
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _clearEditClientModal: function() {
      this.editClientModalOpen = false;
      this.selectedClient = undefined;
      this.cloudError = '';
    },

    clickEditClient: function(clientId) {
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
