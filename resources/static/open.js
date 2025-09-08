    /**
   * Add event listener in DOMElement
   *
   * @param {HTMLElement} obj HTMLElement which should be listen
   * @param {String} type Type of the event to listen
   * @param {Function} fn Callback function
   */
    function addEvent(obj, type, fn) {
        if (typeof obj.addEventListener === 'function') {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn].call(obj, window.event);
            }
            obj.attachEvent('on' + type, obj[type + fn]);
        }
    }

	    /**
   * Return the value of the input trimed
   *
   * @param {x} value to trim
   */
    function myTrim(x) {
        return x.trim();
      }

	    /**
   * Manage the input event on input semi open
   *
   * @param {Object} event Input event of the input semi open
   * @param {Object} that AdcDefault object, same as options
   */
  function onInputSemiOpen (event, that) {
    var el = event.target || event.srcElement;
    if (el.className === 'contentinput') {
        el.previousElementSibling.value = myTrim(el.value);
    }
}

function triggerEvent(el, type) {
    // IE9+ and other modern browsers
    if ('createEvent' in document) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE8
        var e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

// Add debounce function at the top or before usage
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}


(function ($) {
	$.fn.adcOpen = function (options) {

  // Change event on input semi open
  var inputSemiOpens = document.querySelectorAll('#adc_' + options.instanceId + ' .contentinput');
  for (var j1 = 0; j1 < inputSemiOpens.length; j1++) {
    addEvent(inputSemiOpens[j1], 'input',
    (function (passedInElement) {
      return function (e) {
        onInputSemiOpen(e, passedInElement);
      };
    }(this)));
    triggerEvent(inputSemiOpens[j1], 'input');
  }

  // Hide native responses(class=".myresponse")
  var exclusiveResponses = document.querySelectorAll('.myresponse');
  for (var i = 0; i < exclusiveResponses.length; i++) {
    exclusiveResponses[i].style.display = "none";
  }

   var itemsLength = 1,
          itemsLength = (options.isInLoop) ? options.items.length : 1;
   for (var i = 0; i < itemsLength; i++) {

    options.inputId = (options.isInLoop) ? options.items[i].element[0].id : options.inputId;
    options.increment = i + 1;


    if (options.strExclusiveResponseIds != "") {

      let strExclusiveResponseIds = options.strExclusiveResponseIds;
      let arrIds = strExclusiveResponseIds.split(',');

      for (var i = 0; i < arrIds.length; i++) {
        if (document.getElementById(arrIds[i]).checked) {
          document.getElementById(options.inputId).value = '';

          if (window.askia
              && window.arrLiveRoutingShortcut
              && window.arrLiveRoutingShortcut.length > 0
              && window.arrLiveRoutingShortcut.indexOf(options.exclusiveQuestion) >= 0) {
              askia.triggerAnswer();
          }

        }

        document.getElementById(arrIds[i]).addEventListener('change', function (e) {
          if (e.srcElement.checked) {
            uncheckResponses2(e.srcElement.id, strExclusiveResponseIds);
            document.getElementById(options.inputId).value = '';
            document.getElementById('other'+options.inputId).value = '';


            if (window.askia
                && window.arrLiveRoutingShortcut
                && window.arrLiveRoutingShortcut.length > 0
                && window.arrLiveRoutingShortcut.indexOf(options.exclusiveQuestion) >= 0) {
                askia.triggerAnswer();
            }
          }
        });
      }
      if (window.askia
          && window.arrLiveRoutingShortcut
          && window.arrLiveRoutingShortcut.length > 0
          && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
          askia.triggerAnswer();
      }
    }
    options.adcSelector = '#adc_' + options.instanceId;

    // var openInputDK = document.querySelector('#adc_' + this.instanceId + ' .openDK input[type="checkbox"]');
/*
    document.getElementById('other'+options.inputId).addEventListener('keyup', function (e) {
        uncheckResponses(options.strExclusiveResponseIds);

        //var inputcontent= this.value.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n'); //handling of line-break characters
        var inputcontent = this.value.trim();
        this.previousElementSibling.value = inputcontent;

        options.counterdiv = getContainer(this.id).querySelector(options.adcSelector + " .counterdiv .counter b");
        options.congratsdiv = getContainer(this.id).querySelector(options.adcSelector + " .congrats-message");

        if (options.direction == 'desc') {
            options.val = (options.maxchar - inputcontent.length > 0 ? options.maxchar - inputcontent.length : 0);
            printcounter(options);
        } else {
            options.val = inputcontent.length;
            printcounter(options);
        }
        if (options.suggestedchar > 0 && options.showcongrats && inputcontent.length >= options.suggestedchar) {
            options.congratsdiv.style = "display:block";
        }
        else {
            options.congratsdiv.style = "display:none";
        }
        if (window.askia
            && window.arrLiveRoutingShortcut
            && window.arrLiveRoutingShortcut.length > 0
            && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
            askia.triggerAnswer();
        }
    });
*/
    // document.getElementById(options.inputId).addEventListener('focus', function (e) {
    //   uncheckResponses(options.strExclusiveResponseIds);
    // });

    document.getElementById(options.inputId).addEventListener('paste', function () {

        uncheckResponses(options.strExclusiveResponseIds);

        var inputcontent = this.previousElementSibling.value.trim();
        options.counterdiv = getContainer(this.id).querySelector(options.adcSelector + " .counterdiv .counter b");
        options.congratsdiv = getContainer(this.id).querySelector(options.adcSelector + " .congrats-message");

        if (options.direction == 'desc') {
            options.val = (options.maxchar - inputcontent.length > 0 ? options.maxchar - inputcontent.length : 0);
            printcounter(options);
        }
        else {
            options.val = inputcontent.length;
            printcounter(options);
        }
        if (options.suggestedchar > 0 && options.showcongrats && inputcontent.length >= options.suggestedchar) {
            options.congratsdiv.style = "display:block";
        }
        else {
            options.congratsdiv.style = "display:none";
        }
        if (window.askia
            && window.arrLiveRoutingShortcut
            && window.arrLiveRoutingShortcut.length > 0
            && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
            askia.triggerAnswer();
        }

    });

    
    document.getElementById("other" + options.inputId).addEventListener('input', debounce(function (e) {
        uncheckResponses(options.strExclusiveResponseIds);

        var inputcontent = this.value.trim();
        this.previousElementSibling.value = inputcontent;

        options.counterdiv = getContainer(this.id).querySelector(options.adcSelector + " .counterdiv .counter b");
        options.congratsdiv = getContainer(this.id).querySelector(options.adcSelector + " .congrats-message");

        if (options.maxchar > 0 && options.maxchar - inputcontent.length < 0) {
            this.value = this.value.trim().substring(0, options.maxchar);
        }

        if (options.direction == 'desc') {
            options.val = (options.maxchar - inputcontent.length > 0 ? options.maxchar - inputcontent.length : 0);
            printcounter(options);
        }
        else {
            options.val = inputcontent.length;
            printcounter(options);
        }
        if (options.suggestedchar > 0 && options.showcongrats && inputcontent.length >= options.suggestedchar) {
            options.congratsdiv.style = "display:block";
        }
        else {
            options.congratsdiv.style = "display:none";
        }
        if (window.askia
            && window.arrLiveRoutingShortcut
            && window.arrLiveRoutingShortcut.length > 0
            && window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
            askia.triggerAnswer();
        }
    }, 300)); // 300ms debounce delay
  }
}
}(jQuery));

function uncheckResponses(exResponseIds){
  if (exResponseIds != "") {
    let arrIds = exResponseIds.split(',');
    for (var i = 0; i < arrIds.length; i++) {
      document.getElementById(arrIds[i]).checked = false;
    }
    return true;
  } else {
    return false;
  }
}

function uncheckResponses2(inputId, exResponseIds){
  let arrIds = exResponseIds.split(',');
  for (var i = 0; i < arrIds.length; i++) {
    if (arrIds[i] != inputId){
      document.getElementById(arrIds[i]).checked = false;
    }
  }
}

function printcounter(options) {
    if (options.direction != "none") {
        options.counterdiv.innerHTML = options.val;
    }
}

function getContainer(id) {
  var containerElem = document.getElementById(id).parentNode;
  if (containerElem.tagName == "LABEL") {
    containerElem = containerElem.parentNode;
  }
  return containerElem;
}

//onkeydown event
function imposeMaxLengthOnKeydown(Event, Object, MaxLen) {
    if ((Object.value.trim().length < MaxLen) || (Event.keyCode == 8 || Event.keyCode == 46 || (Event.keyCode >= 35 && Event.keyCode <= 40))) {
        return true;
    } else {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) //android detects
            Object.value = (Object.value.trim()).substring(0, MaxLen - 1);

        (Event.preventDefault ? Event.preventDefault() : event.returnValue = false);
    }

}

//onkeypress event
function imposeMaxLength(Event, Object, MaxLen) {
    if ((Object.value.trim().length < MaxLen) || (Event.keyCode == 8 || Event.keyCode == 46 || (Event.keyCode >= 35 && Event.keyCode <= 40))) {
        return true;
    } else {
        (Event.preventDefault ? Event.preventDefault() : event.returnValue = false);
    }

}

//onpaste event
function imposeMaxLengthOnPaste(Event, Object, MaxLen) {
    let paste = (Event.clipboardData || window.clipboardData).getData('text');
    var endP = (Object.value.trim() + paste).trim();
    if (endP.length >= MaxLen) {
        paste = endP.trim().substring(0, MaxLen);
        Object.value = paste.trim();
        (Event.preventDefault ? Event.preventDefault() : event.returnValue = false);
    } else {
        return true;
    }
}
