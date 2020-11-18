/**
 * expandTextareas()
 *
 * Expand textareas to fit content
 *
 */

parasails.registerUtility('expandTextareas', function expandTextareas() {

  // Set textareas to height of content
  $('textarea.js-auto-size').each(function() {
    var $this = $(this);
    while($this.outerHeight() < $this[0].scrollHeight + parseFloat($this.css('borderTopWidth')) + parseFloat($this.css('borderBottomWidth'))) {
      $this.height($this.height()+1);
    };
  });

});
