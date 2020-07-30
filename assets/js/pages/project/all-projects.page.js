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

    // Make projects sortable in each client
    this._sortableClients();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _sortableClients: function() {

      // Abort if not admin
      if (!this.me.isSuperAdmin) {
        return;
      }

      let that = this;
      $('ul.projects-list:not(.sortabled)').each(function() {
        let sortable_projects = new Sortable(this, {
          draggable: '.project-item',
          onUpdate: function() {
            // Update position IDs in database
            that._updateProjectPositions(sortable_projects.toArray());
          }
        });
        $(this).addClass('sortabled');
      });
    },

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

      // Init Choices multiselect
      this._initSelects();

    },

    _initSelects: function() {

      // Init Choices multiselect
      setTimeout(function() {
        let multiSelect = document.querySelector('select.choices');
        if (multiSelect) {
          const choices = new Choices(multiSelect, {
            itemSelectText: '',
            removeItemButton: true
          });
          // Hide choices dropdown on select
          multiSelect.addEventListener('choice', function() {
            choices.hideDropdown();
          });
        }
      }, 150);

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

      // Init Choices multiselect
      this._initSelects();

    },

    closeEditClientModal: function() {
      this._clearEditClientModal();
      // Init any new clients as sortable
      this._sortableClients();
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

    // User dragged a project around, update positions in database
    _updateProjectPositions: async function(projectIds) {
      // Send to /project/update-project-positions
      await Cloud.updateProjectPositions(_.map(projectIds, Number));
    },

  }
});
