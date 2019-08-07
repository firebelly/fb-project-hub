parasails.registerPage('all-users', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formErrors: {},
    selectedUser: undefined,
    successAlert: '',

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Modals
    editUserModalOpen: '',
    addUserModalOpen: '',
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
    // User forms/modals

    // Adding user
    clickAddUser: async function() {
      // Submit to user/add-user, return new user
      let result = await Cloud.addUser();

      this.users.push(result.user);

      // Set form data to stage that was clicked
      this.selectedUser = result.user;
      this.formData = this.selectedUser;

      this.editUserModalOpen = true;
    },

    clickResetAlert: function() {
      this.successAlert = '';
    },

    // Deleting user
    clickDestroyUser: async function(userId) {
      if (confirm('Are you sure?')) {
        _.remove(this.users, { id: userId });
        await Cloud.destroyUser(userId);
        this._clearEditUserModal();
      }
    },

    _clearEditUserModal: function() {
      this.editUserModalOpen = false;
      this.selectedUser = undefined;
      this.formData = [];
      this.addingUser = false;
      this.cloudError = '';
    },

    clickEditUser: function(userId) {
      // Clear out alert
      this.successAlert = '';

      // Find user by id
      this.selectedUser = _.find(this.users, { id: userId })

      // Set form data to user that was clicked
      this.formData = this.selectedUser;

      // Open modal
      this.editUserModalOpen = true;
    },

    closeEditUserModal: function() {
      this._clearEditUserModal();
    },

    parseForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = _.extend({ id: this.selectedUser.id }, this.formData);

      // Validate data
      if(!argins.fullName) {
        this.formErrors.fullName = true;
      }
      if(!argins.emailAddress) {
        this.formErrors.emailAddress = true;
      }

      // If any errors, just return (vuejs will show errors based on formErrors state)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

    submittedForm: function() {
      this.successAlert = 'User updated ok!';
      this._clearEditUserModal();
    },

  }
});
