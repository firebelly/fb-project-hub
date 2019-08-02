parasails.registerPage('single-project', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {
    formErrors: {},
    selectedTask: undefined,

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Modal closed
    editTaskModalOpen: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝

  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },

  mounted: async function() {
    // Init tooltips
    $('[data-toggle="tooltip"]')
    .tooltip()
    .hover(function(){
      // Inherit data-status attribute from div for CSS styles
      $('.tooltip').attr('data-status', $(this).attr('data-status'));
    });

    // Focus first input when opening modal
    $('body').on('shown.bs.modal', '.mdl', function () {
      $('.modal-dialog input:visible:enabled:first').focus();
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

  methods: {

    _clearEditTaskModal: function() {
      this.editTaskModalOpen = false;
      this.selectedTask = undefined;
      this.cloudError = '';
    },

    clickEditTask: function(taskId) {
      // Find task in nested stages.tasks by id
      this.selectedTask = _.find(_.flatten(_.pluck(this.stages, 'tasks')), { id: taskId })

      // Set form data to task that was clicked
      this.formData = this.selectedTask;

      // Use full date formatting for input instead of timestamp
      this.formData.due = this.selectedTask.due_formatted_full;

      // Open modal
      this.editTaskModalOpen = true;
    },

    closeEditTaskModal: function() {
      this._clearEditTaskModal();
    },

    parseForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedTask.id }, this.formData);

      // Validate data
      if(!argins.title) {
        this.formErrors.title = true;
      }
      // todo: check URL? due date?

      // If any errors, just return (vuejs will show errors based on formErrors state)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }
      this.selectedTask = this.formData;

      return argins;
    },

    submittedForm: function() {
      this._clearEditTaskModal();
    },

  }
});
