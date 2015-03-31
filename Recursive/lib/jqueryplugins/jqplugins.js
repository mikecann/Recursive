﻿(function ($, window, undefined) {
    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function () {
        var xhr = oldXHR();
        if (xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }

        return xhr;
    };
})(jQuery, window);

(function ($) {
    $.fn.disableSelection = function () {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);