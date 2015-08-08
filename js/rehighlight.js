$(function() {
  ////////////////////////////////////////////////////////////////////////////
  // Functions without side-effect
  ////////////////////////////////////////////////////////////////////////////
  var getRegExp = function(pattern, flags, behavior) { 
    flags = flags || '';
    try {
      if (behavior === 'keep') {
        // do not match text in/inside HTML tag.
        return new RegExp(pattern + '(?![^<]*>|[^<>]*<\/)', flags);
      } else {
        // do not match text inside HTML tag.
        return new RegExp(pattern + '(?![^<]*>)', flags);
      }
    } catch (e) {
      return new RegExp('', '');
    }
  };
  var wrap = function(text, width) {
    if (!text || text.length === 0) {
      return text;
    }
    var regex = getRegExp('.{1,' + width + '}', 'g');
    text = text.replace(/\r?\n/g, '');  // remove unwilling newlines
    text = text.match(regex).join('\n');
    return text;
  };
  var count = function(text, pattern) {
    if (!text || text.length === 0) {
      return 0;
    }
    var regex = getRegExp(pattern, 'g');
    var match = text.match(regex);
    return match ? match.length : 0;
  };
  var substitute = function(text, pattern, repl, behavior) {
    if (!text || text.length === 0) {
      return text;
    }
    var regex = getRegExp(pattern, 'g', behavior);
    text = text.replace(regex, repl);
    return text;
  };
  var highlight = function(text, pattern, fcolor, bcolor, behavior) {
    var styles = [
      'color:' + fcolor + '!important;',
      'background-color:' + bcolor + '!important;',
    ];
    var repl = '<span style="' + styles.join('') + '">$&</span>';
    return substitute(text, pattern, repl, behavior);
  };

  ////////////////////////////////////////////////////////////////////////////
  // Object which connect to DOM element
  ////////////////////////////////////////////////////////////////////////////
  var Substitution = function(parent) {
    Object.defineProperty(this, 'pattern', {
      get: function() {
        return $('.substitution-pattern', parent).val();
      },
      set: function(value) {
        $('.substitution-pattern', parent).val(value);
      }
    });
    Object.defineProperty(this, 'repl', {
      get: function() {
        return $('.substitution-repl', parent).val();
      },
      set: function(value) {
        $('.substitution-repl', parent).val(value);
      }
    });
    Object.defineProperty(this, 'num', {
      get: function() {
        return $('.substitution-num', parent).html() || 0;
      },
      set: function(value) {
        $('.substitution-num', parent).html(value);
      }
    });
  };
  var Highlight = function(parent) {
    Object.defineProperty(this, 'pattern', {
      get: function() {
        return $('.highlight-pattern', parent).val();
      },
      set: function(value) {
        $('.highlight-pattern', parent).val(value);
      }
    });
    Object.defineProperty(this, 'fcolor', {
      get: function() {
        return $('.highlight-fcolor', parent).val() || '#ffffff';
      },
      set: function(value) {
        $('.highlight-fcolor', parent).val(value).css('color', value);
      }
    });
    Object.defineProperty(this, 'bcolor', {
      get: function() {
        return $('.highlight-bcolor', parent).val() || '#c0504d';
      },
      set: function(value) {
        $('.highlight-bcolor', parent).val(value).css('color', value);
      }
    });
    Object.defineProperty(this, 'num', {
      get: function() {
        return $('.highlight-num', parent).html() || 0;
      },
      set: function(value) {
        $('.highlight-num', parent).html(value);
      }
    });
  };
  var Config = function() {
    var self = this;
    Object.defineProperty(this, 'textWidth', {
      get: function() {
        return $('#text-width').val() || 50;
      },
      set: function(value) {
        $('#text-width').val(value);
      }
    });
    Object.defineProperty(this, 'textCase', {
      get: function() {
        return $('input[name=text-case]:checked').val();
      },
      set: function(value) {
        $('input[name=text-case][value="' + value + '"]').prop('checked', true);
      }
    });
    Object.defineProperty(this, 'matchBehavior', {
      get: function() {
        return $('input[name=match-behavior]:checked').val();
      },
      set: function(value) {
        $('input[name=match-behavior][value="' + value + '"]').prop('checked', true);
      }
    });
    Object.defineProperty(this, 'substitutions', {
      get: function() {
        substitutions = new Array();
        $('.substitution-var').each(function() {
          substitutions.push(new Substitution(this));
        });
        return substitutions;
      },
      set: function(value) {
        if (!value) {
          return;
        }
        var size = $('.substitution-var').length;
        if (size > value.length) {
          var btn = $('.substitution-del');
          for (var i=value.length; i<size; ++i) {
            btn.click();
          }
        } else if (size < value.length) {
          var btn = $('.substitution-add');
          for (var i=size; i<value.length; ++i) {
            btn.click();
          }
        }
        $('.substitution-var').each(function(index, element) {
          $('.substitution-pattern', this).val(value[index].pattern);
          $('.substitution-repl', this).val(value[index].repl);
        });
      }
    });
    Object.defineProperty(this, 'highlights', {
      get: function() {
        highlights = new Array();
        $('.highlight-var').each(function() {
          highlights.push(new Highlight(this));
        });
        return highlights;
      },
      set: function(value) {
        if (!value) {
          return;
        }
        var size = $('.highlight-var').length;
        if (size > value.length) {
          var btn = $('.highlight-del');
          for (var i=value.length; i<size; ++i) {
            btn.click();
          }
        } else if (size < value.length) {
          var btn = $('.highlight-add');
          for (var i=size; i<value.length; ++i) {
            btn.click();
          }
        }
        $('.highlight-var').each(function(index, element) {
          $('.highlight-pattern', this).val(value[index].pattern);
          $('.highlight-fcolor', this).val(value[index].fcolor);
          $('.highlight-bcolor', this).val(value[index].bcolor);
          $('.highlight-num', this).val(value[index].num);
        });
      }
    });
    Object.defineProperty(this, 'originalValue', {
      get: function() {
        return $('#textarea').val();
      },
      set: function(value) {
        $('#textarea').val(value);
      },
    });
  };
  Config.toJSON = function(config) {
    var rawConfig = {
      originalValue: config.originalValue,
      textWidth: config.textWidth,
      textCase: config.textCase,
    };
    rawConfig.substitutions = new Array();
    config.substitutions.forEach(function(val, index, array) {
      rawConfig.substitutions.push({
        pattern: val.pattern,
        repl: val.repl
      });
    });
    rawConfig.highlights = new Array();
    config.highlights.forEach(function(val, index, array) {
      rawConfig.highlights.push({
        pattern: val.pattern,
        fcolor: val.fcolor,
        bcolor: val.bcolor,
        num: val.num,
      });
    });
    return JSON.stringify(rawConfig);
  }
  Config.fromJSON = function(jsonConfig, config) {
    var rawConfig = JSON.parse(jsonConfig);
    for (var key in rawConfig) {
      config[key] = rawConfig[key];
    }
    return config;
  };
  Config.prototype.toJSON = function() {
    return Config.toJSON(this);
  };
  Config.prototype.fromJSON = function(json) {
    return Config.fromJSON(json, this);
  };
  Config.prototype.saveToLocalStorage = function() {
    localStorage.setItem('config', this.toJSON());
  };
  Config.prototype.loadFromLocalStorage = function() {
    var json = localStorage.getItem('config');
    if (!json) {
      return this;
    }
    return this.fromJSON(json);
  };
  Config.prototype.toURL = function() {
    return [
      $.url('protocol'),
      '://',
      $.url('hostname'),
      $.url('path'),
      '?json=' + encodeURIComponent(this.toJSON())
    ].join('');
  }
  Config.prototype.toDownloadURL = function() {
    var data = new Blob([Config.toJSON(this)]);
    return URL.createObjectURL(data);
  }
  Config.prototype.connect = function(callback) {
    var self = this;
    $('#text-width').on('keypress keyup paste', callback);
    $('input[name=text-case]').on('change', callback);
    $('input[name=match-behavior]').on('change', callback);
    $('.substitution-pattern').on('keypress keyup paste', callback);
    $('.substitution-repl').on('keypress keyup paste', callback);
    $('.highlight-pattern').on('keypress keyup paste', callback);
    $('.highlight-fcolor').on('keypress keyup paste change.color', callback);
    $('.highlight-bcolor').on('keypress keyup paste change.color', callback);
    $('#textarea').on('keypress keyup paste', callback);
    $(window).on('unload', function(){
      self.saveToLocalStorage();
    });
  };

  var Viewer = function() {
    this.config = new Config();
    Object.defineProperty(this, 'renderedValue', {
      get: function() {
        return $('#viewer').html();
      },
      set: function(value) {
        return $('#viewer').html(value);
      },
    });
  };
  Viewer.prototype.render = function() {
    var self = this;
    var text = this.config.originalValue;
    // Upper/Lower
    switch(this.config.textCase) {
      case 'upper':
        text = text.toUpperCase();
        break;
      case 'lower':
        text = text.toLowerCase();
        break;
    }
    // Substitution
    this.config.substitutions.forEach(function(val, index, array) {
      val.num = count(text, val.pattern);
      text = substitute(text, val.pattern, val.repl);
    });
    // Wrap
    text = wrap(text, this.config.textWidth);
    // Highlight
    this.config.highlights.forEach(function(val, index, array) {
      val.num = count(text, val.pattern);
      text = highlight(
        text, val.pattern, val.fcolor, val.bcolor,
        self.config.matchBehavior);
    });
    this.renderedValue = text;
  };
  Viewer.prototype.connect = function() {
    var self = this;
    this.config.connect(function() {
      self.render();
    });
  };

  var rehighlight = {};
  rehighlight.viewer = new Viewer(rehighlight.config);
  rehighlight.viewer.connect();

  $('#substitution ul').addInputArea({
    area_var: '.substitution-var',
    btn_add: '.substitution-add',
    btn_del: '.substitution-del',
  });
  $('#highlight ul').addInputArea({
    area_var: '.highlight-var',
    btn_add: '.highlight-add',
    btn_del: '.highlight-del',
    after_add: function() {
      $('.highlight-fcolor', this).colorpicker({ hideButton: true });
      $('.highlight-bcolor', this).colorpicker({ hideButton: true });
    }
  });
  $('.highlight-fcolor').colorpicker({ hideButton: true });
  $('.highlight-bcolor').colorpicker({ hideButton: true });

  window.rehighlight = rehighlight;
  if ($.url('?url')) {
    $.getJSON($.url('?url'), function(data) {
      rehighlight.viewer.config.fromJSON(data);
      rehighlight.viewer.render();
    });
  } else if ($.url('?json')) {
    rehighlight.viewer.config.fromJSON($.url('?json'));
    rehighlight.viewer.render();
  } else {
    rehighlight.viewer.config.loadFromLocalStorage();
    rehighlight.viewer.render();
  }
});



