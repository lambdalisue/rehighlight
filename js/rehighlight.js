$(function() {
  var wordWrap = function(str, width) {
    if (!str) { return str; }
    var regex = new RegExp('.{1,' + width + '}', 'g');
    return str.match(regex).join('<br>');
  };
  var highlight = function(str, regex, fcolor, bcolor) {
    var repl = [
      '<span style="color:',
      fcolor,
      ';background-color:',
      bcolor,
      ';">$&</span>',
    ].join('');
    if (!str || !regex) { return str; }
    return str.replace(new RegExp(regex + '(?![^<]*>|[^<>]*<\/)', 'g'), repl);
  };

  var updateViewer = function() {
    var text;
    text = $('#textarea').val();
    text = wordWrap(text, $('#text-width').val() || 80);
    $('.highlight-var').each(function() {
      var r = $('.highlight-regex',  this).val() || '';
      var f = $('.highlight-fcolor', this).val() || '#ffffff';
      var b = $('.highlight-bcolor', this).val() || '#ff0000';
      text = highlight(text, r, f, b);
    });
    $('#viewer').html(text);
  };

  $('#text-width').change(updateViewer);
  $('.highlight-regex').change(updateViewer);
  $('.highlight-fcolor').change(updateViewer);
  $('.highlight-bcolor').change(updateViewer);
  $('#textarea').keypress(updateViewer);
  $('#textarea').keyup(updateViewer);

  $('#highlight ul').addInputArea({
    area_var: '.highlight-var',
    btn_add: '.highlight-add',
    btn_del: '.highlight-del',
    after_add: function() {
      $('.highlight-fcolor').colorpicker({ hideButton: true });
      $('.highlight-bcolor').colorpicker({ hideButton: true });
    },
  });

  $('.highlight-fcolor').colorpicker({ hideButton: true });
  $('.highlight-bcolor').colorpicker({ hideButton: true });


  updateViewer();
});



