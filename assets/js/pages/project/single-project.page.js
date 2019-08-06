parasails.registerPage('single-project', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {
    formErrors: {},

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Form objects
    selectedTask: undefined,
    selectedStage: undefined,
    selectedProject: undefined,

    // Modals
    editTaskModalOpen: false,
    editStageModalOpen: false,
    editProjectModalOpen: false,
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
    $('#single-project')
    .tooltip({
      selector: '[data-toggle="tooltip"]',
    })
    .on('mouseenter', '[data-toggle="tooltip"]', function() {
       // Inherit data-status attribute from div for CSS styles
       $('.tooltip').attr('data-status', $(this).attr('data-status'));
    });

    // Focus first input when opening modal
    $('body').on('shown.bs.modal', '.mdl', function () {
      var el = $('.modal-dialog input:visible:enabled:first');
      el.focus();
      // New item dialog? Select placeholder title
      if (el.val().match(/^New/)) {
        el.select();
      }
    })

    // New project?
    if (window.location.hash == '#new') {
      history.replaceState(null, null, ' ');
      this.clickEditProject();
    }
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

    clickAddTask: async function(stageId) {
      // Submit to stage/add-task, returns new task
      let result = await Cloud.addTask(stageId);

      // Find stage in view and push task to list
      let stage = _.find(this.stages, { id: stageId });
      stage.tasks.push(result.task);

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

    _clearEditStageModal: function() {
      this.editStageModalOpen = false;
      this.selectedStage = undefined;
      this.cloudError = '';
    },

    clickAddStage: async function(projectId) {
      // Returns new stage
      let result = await Cloud.addStage(projectId);
      this.stages.push(result.stage);

      // Set form data to stage that was clicked
      this.selectedStage = result.stage;
      this.formData = this.selectedStage;

      // Open edit stage modal w/ new stage
      this.editStageModalOpen = true;
    },

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

    clickDestroyStage: async function(stageId) {
      if (confirm('Are you sure? This will also delete all tasks in stage.')) {
        let stage = _.find(this.stages, { id: stageId });
        _.remove(this.stages, { id: stageId });
        await Cloud.destroyStage(stageId);
        this._clearEditStageModal();
      }
    },

    ///////////////////////
    // Project forms/modals

    _clearEditProjectModal: function() {
      this.editProjectModalOpen = false;
      this.selectedProject = undefined;
      this.cloudError = '';
    },

    clickEditProject: function() {
      // Find project in nested projects.projects by id
      this.selectedProject = this.project;

      // Set form data to project that was clicked
      this.formData = this.selectedProject;

      // Open modal
      this.editProjectModalOpen = true;
    },

    closeEditProjectModal: function() {
      this._clearEditProjectModal();
    },

    parseProjectForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedProject.id }, this.formData);

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

    submittedProjectForm: function() {
      this._clearEditProjectModal();
    },

    clickDestroyProject: async function() {
      if (confirm('Are you sure? This will also delete all stages and tasks in project.')) {
        await Cloud.destroyProject(this.project.id);
        this.goto('/');
      }
    },



  }
});
