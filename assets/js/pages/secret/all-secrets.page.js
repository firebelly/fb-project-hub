parasails.registerPage('all-secrets', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {

    var expandTextareas = parasails.require('expandTextareas');
    expandTextareas();

    $('.copy-to-clipboard').on('click', function() {
      var textId = this.getAttribute('data-id');
      var textToCopy = $('textarea[data-id="' + textId + '"]').text();
      var textarea = document.createElement('textarea');
      textarea.textContent = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        this.classList.add('-success');
        return document.execCommand('copy');
      } catch (ex) {
        console.warn('Copy to clipboard failed.', ex);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // Deleting secret
    clickDestroySecret: async function(secretId) {
      if (confirm('Are you sure?')) {
        _.remove(this.secrets, { id: secretId });
        await Cloud.destroySecret(secretId);
        this.$forceUpdate();

        var expandTextareas = parasails.require('expandTextareas');
        expandTextareas();
      }
    },

  }
});
