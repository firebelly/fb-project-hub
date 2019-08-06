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

    // Modals
    editTaskModalOpen: false,
    editStageModalOpen: false,
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
      $('.modal-dialog input:visible:enabled:first').focus().select();
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

  methods: {

    ///////////////////////
    // Task forms/modals

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

    parseTaskForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedTask.id }, this.formData);

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

    submittedTaskForm: function() {
      this._clearEditTaskModal();
    },

    //

    _clearEditStageModal: function() {
      this.editStageModalOpen = false;
      this.selectedStage = undefined;
      this.cloudError = '';
    },

    // Adding task
    clickAddTask: async function(stageId) {
      // Find stage in nested stages.stages by id
      this.selectedStage = _.find(this.stages, { id: stageId })

      // Submit to stage/add-task, returns new task
      let result = await Cloud.addTask(stageId);
      this.selectedStage.tasks.push(result.task);

      // Set form data to stage that was clicked
      this.selectedTask = result.task;
      this.formData = this.selectedTask;

      // Open edit task modal w/ new task
      this.editTaskModalOpen = true;
    },

    clickDestroyTask: async function(taskId) {
      if (confirm('Are you sure?')) {
        let stage = _.find(this.stages, { tasks: [ { id: taskId } ]});
        _.remove(stage.tasks, { id: taskId });
        await Cloud.destroyTask(taskId);
        this._clearEditTaskModal();
      }
    },


    ///////////////////////
    // Stage forms/modals

    clickEditStage: function(stageId) {
      // Find stage in nested stages.stages by id
      this.selectedStage = _.find(this.stages, { id: stageId })

      // Set form data to stage that was clicked
      this.formData = this.selectedStage;

      // Open modal
      this.editStageModalOpen = true;
    },

    closeEditStageModal: function() {
      this._clearEditStageModal();
    },

    parseStageForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedStage.id }, this.formData);

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

    submittedStageForm: function() {
      this._clearEditStageModal();
    },


  }
});
