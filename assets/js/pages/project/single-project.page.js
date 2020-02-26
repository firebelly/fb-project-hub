parasails.registerPage('single-project', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {
    formErrors: {},

    // Syncing / loading state
    syncing: false,

    // Disables editing and styles tasks darker despite status
    presentationMode: false,

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
      if ($(this).attr('data-status')) {
        $('.tooltip').attr('data-status', $(this).attr('data-status'));
      } else {
        $('.tooltip').attr('data-status', '');
      }
    });

    // $(document).on('click', '.stage-dots li', function(e) {
    //   let id = e.currentTarget.getAttribute('data-id');
    //   window.scrollTo(0, $(`.stage-item[data-id="${id}"]`).offset().top);
    // });

    // Make tasks sortable between stages
    this._sortableStages();

    // Focus first input when opening modal
    $('body').on('shown.bs.modal', '.mdl', function () {
      var el = $('.modal-dialog input:visible:enabled:first');
      el.focus();
      // New item dialog? Select placeholder title
      if (el.val().match(/^New/)) {
        el.select();
      }
    });

    // Update greyed-out Not Started styles for each stage
    this._updateStagesNotStartedStyles();

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

    // Init all stages to be sortable
    _sortableStages: function() {

      // Abort if not admin (or on smaller screens)
      if (!this.me.isSuperAdmin || $(window).width() < 768) {
        return;
      }

      var that = this;

      // Sortable stages
      $('ol.stages:not(.sortabled)').each(function() {
        let sortable_stages = new Sortable(this, {
          group: 'project-stages',
          draggable: '.stage-item',
          onUpdate: function(evt) {

            // Update position IDs in database
            that._updateStagePositions(sortable_stages.toArray());

            // Update stage-dots
            that._updateStagesNotStartedStyles();

          }
        });
        $(this).addClass('sortabled');
      });

      // Sortable tasks
      $('ol.stages ul.tasks:not(.sortabled)').each(function() {
        let sortable_tasks = new Sortable(this, {
          group: 'project-tasks',
          draggable: '.task-item',
          onAdd: function(evt) {

            // Pull data-stage-id from new stage
            let stageId = parseInt(evt.to.getAttribute('data-stage-id'));

            // Get id array of tasks in stage item was dragged to
            let idArr = $(evt.to).find('[data-id]').map(function() { return this.getAttribute('data-id') });

            // Move task between stages in view
            that._updateTaskPositions(idArr, stageId);

          },
          onUpdate: function(evt) {

            // Update position IDs in database
            that._updateTaskPositions(sortable_tasks.toArray(), evt.to.getAttribute('data-stage-id'));

          }
        });
        $(this).addClass('sortabled');
      });

    },

    ///////////////////////
    // Task forms/modals

    _clearEditTaskModal: function() {
      this.editTaskModalOpen = false;
      this.selectedTask = undefined;
      this.cloudError = '';
      // Update greyed-out Not Started styles for each stage
      this._updateStagesNotStartedStyles();
    },

    clickEditTask: function(taskId) {
      // Find task in nested stages.tasks by id
      this.selectedTask = _.find(_.flatten(_.map(this.stages, 'tasks')), { id: taskId });

      // If not admin and task is clicked, open URL if set for task, or just do nothing
      if (!this.me.isSuperAdmin || this.presentationMode) {
        if (this.selectedTask.url !== '') {
          window.open(this.selectedTask.url);
        }
        return false;
      }

      // Set form data to task that was clicked
      this.formData = this.selectedTask;

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
      if(!argins.due_formatted.match(/^[\d]{1,2}\/[\d]{2}\/[\d]{4}$/)) {
        this.formErrors.due_formatted = true;
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

    // User dragged a task around, update positions in database
    _updateTaskPositions: async function(taskIds, stageId) {
      // Send to /task/update-task-positions
      await Cloud.updateTaskPositions(_.map(taskIds, Number), stageId);

      // Update greyed-out Not Started styles for each stage
      this._clearEditTaskModal();
    },

    // User dragged a stage around, update positions in database
    _updateStagePositions: async function(stageIds) {
      // Send to /task/update-stage-positions
      await Cloud.updateStagePositions(_.map(stageIds, Number));
    },

    // Set not-started class on various elements based on if stage has any Not Started items
    _updateStagesNotStartedStyles: function() {
      $('ol.stages > li').each(function(i) {
        console.log(this, i);
        let $this = $(this);
        let notStarted = ($this.find('.task-item > div[data-status != "Not Started"]').length == 0);
        $this.toggleClass('not-started', notStarted);
        // Update stage-dots styling based on status
        $('.stage-dots li:eq('+i+')').toggleClass('not-started', notStarted);
      });
      // Set stage-dots current-stage
      $('.stage-dots li').removeClass('current-stage');
      $('.stage-dots li.not-started:first').prev().addClass('current-stage');
      console.log($('.stage-dots li.not-started:first'));
    },


    ///////////////////////
    // Stage forms/modals

    _clearEditStageModal: function() {
      this.editStageModalOpen = false;
      this.selectedStage = undefined;
      this.cloudError = '';
      this._updateStagesNotStartedStyles();
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
      // Abort if not admin
      if (!this.me.isSuperAdmin || this.presentationMode) { return false; }

      // Find stage in nested stages.stages by id
      this.selectedStage = _.find(this.stages, { id: stageId })

      // Set form data to stage that was clicked
      this.formData = this.selectedStage;

      // Open modal
      this.editStageModalOpen = true;
    },

    closeEditStageModal: function() {
      this._clearEditStageModal();
      // Init any new stages as sortable
      this._sortableStages();
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
      // Abort if not admin
      if (!this.me.isSuperAdmin || this.presentationMode) { return false; }

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

    submittedProjectForm: function(res) {
      // If project slug has changed, redirect to new project URL
      if (res.redirectTo !== '') {
        this.goto(res.redirectTo);
      }
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
