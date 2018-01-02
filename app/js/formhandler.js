(function (window) {
  'use strict';

  var App = window.App || {};
  var $ = window.jQuery;

  function FormHandler(selector) {
    if (!selector) {
      throw new Error('No selector provided');
    }

    this.$formElement = $(selector);
    if (this.$formElement.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  FormHandler.prototype.addSubmitHandler = function (fn) {
    this.$formElement.on('submit', function (event) {
      event.preventDefault();
      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
      });
      fn(data)
        .then(function () {
          this.reset();
          this.elements[0].focus();
        }.bind(this))
    });
  };

  FormHandler.prototype.addInputHandler = function (fn) {
    console.log('Setting input handler for form');
    this.$formElement.on('input', '[name="emailAddress"]', function (event) {
      var emailAddress = event.target.value;
      var message = '';
      if (fn(emailAddress)) {
        event.target.setCustomValidity('');
      } else {
        message = emailAddress + ' is not an authorized email address!'
        event.target.setCustomValidity(message);
      }
    });
  };

  FormHandler.prototype.setValueOfRange = function (range, value) {
    var defaultValue = $(range).val()
    $(value).text(defaultValue + 'x')
    
    function setColor (val) {
      if (val <= 30) {
        $(value).css('color', 'green')
      } else if (val <= 65) {
        $(value).css('color', 'blue')
      } else {
        $(value).css('color', 'red')
      }
    }

    setColor(defaultValue);

    $(range).on('change', function (event) {
      $(value).text(event.target.value + 'x');
      setColor(event.target.value);
    });

    this.$formElement.on('reset submit', function (event) {
      $(value).text(defaultValue + 'x');
      setColor(defaultValue);
    });
  };

  App.FormHandler = FormHandler;
  window.App = App;
})(window);