$(function() {
  var wordWrap = function(str, width) {
    if (!str) { return str; }
    try{
      var regex = new RegExp('.{1,' + width + '}', 'g');
      return str.replace(/\r?\n/g, '').match(regex).join('\n');
    } catch(e) {
      return str;
    }
  };
  var countMatch = function(str, regex) {
    if (!str || !regex || regex.length === 0) { return 0; }
    try{
      var m = str.match(new RegExp(regex + '(?![^<]*>)', 'g'));
      return m ? m.length : 0;
    } catch(e) {
      // fail silently
      return 0;
    }
  };
  var highlight = function(str, regex, fcolor, bcolor) {
    var repl = [
      '<span style="color:',
      fcolor,
      ' !important;background-color:',
      bcolor,
      ' !important;">$&</span>',
    ].join('');
    if (!str || !regex || regex.length === 0) { return str; }
    try{
      return str.replace(new RegExp(regex + '(?![^<]*>)', 'g'), repl);
    } catch(e) {
      // fail silently
      return str;
    }
  };
  var substitute = function(str, regex, repl) {
    if (!str || !regex || regex.length === 0) { return str; }
    try{
      return str.replace(new RegExp(regex + '(?![^<]*>)', 'g'), repl);
    } catch(e) {
      // fail silently
      return str;
    }
  };

  var updateViewer = function() {
    var text;
    text = $('#textarea').val();

    switch($('input[name=case]:checked').val()) {
      case 'upper':
        text = text.toUpperCase();
        break;
      case 'lowe':
        text = text.toLowerCase();
        break;
    }

    $('.substitute-var').each(function() {
      var r = $('.substitute-regex',  this).val() || '';
      var p = $('.substitute-repl', this).val() || '';
      text = substitute(text, r, p);
    });
    text = wordWrap(text, $('#text-width').val() || 80);
    $('.highlight-var').each(function() {
      var r = $('.highlight-regex',  this).val() || '';
      var f = $('.highlight-fcolor', this).val() || '#ffffff';
      var b = $('.highlight-bcolor', this).val() || '#ff0000';
      var m = countMatch(text, r);
      $('.highlight-num', this).html(m);
      text = highlight(text, r, f, b);
    });
    $('#viewer').html(text);
  };

  $('#text-width').keypress(updateViewer);
  $('#text-width').keyup(updateViewer);
  $('input[name=case]').click(updateViewer);
  $('.highlight-regex').keypress(updateViewer);
  $('.highlight-regex').keyup(updateViewer);
  $('.highlight-fcolor').change(updateViewer);
  $('.highlight-fcolor').on('change.color', updateViewer);
  $('.highlight-bcolor').change(updateViewer);
  $('.highlight-bcolor').on('change.color', updateViewer);
  $('.substitute-regex').keypress(updateViewer);
  $('.substitute-regex').keyup(updateViewer);
  $('.substitute-repl').keypress(updateViewer);
  $('.substitute-repl').keyup(updateViewer);
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
  $('#substitute ul').addInputArea({
    area_var: '.substitute-var',
    btn_add: '.substitute-add',
    btn_del: '.substitute-del',
  });

  $('.highlight-fcolor').colorpicker({ hideButton: true });
  $('.highlight-bcolor').colorpicker({ hideButton: true });


  updateViewer();
});



