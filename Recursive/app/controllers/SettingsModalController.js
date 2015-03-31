var SettingsModalController = (function () {
    function SettingsModalController(elementId) {
        var _this = this;
        this.view = $("#" + elementId);
        this.view.find('#saveBtn').click(function () {
            return _this.save();
        });
        $("#userFilesRegexTip").tooltip();
    }
    SettingsModalController.prototype.open = function () {
        $('#maxDepthInp').attr('value', settings.maxCrawlDepth);
        $("#showFPSChk").attr('checked', settings.showFPS);
        $("#removeDuplicateFilesChk").attr('checked', settings.removeDuplicateFiles);
        $("#showDebugCirclesChk").attr('checked', settings.showDebugCircles);
        $('#userFilesRegex').attr('value', settings.userFilesRegex);
        this.view.find('.modal-body');
        this.view.modal();
    };
    SettingsModalController.prototype.save = function () {
        settings.maxCrawlDepth = parseInt($('#maxDepthInp').attr('value'));
        settings.showFPS = Boolean($("#showFPSChk").is(':checked'));
        settings.showDebugCircles = Boolean($("#showDebugCirclesChk").is(':checked'));
        settings.removeDuplicateFiles = Boolean($("#removeDuplicateFilesChk").is(':checked'));
        settings.userFilesRegex = $('#userFilesRegex').attr('value');
        this.view.modal('hide');
        chrome.storage.sync.set(settings);
        stats.domElement.style.visibility = settings.showFPS ? 'visible' : 'hidden';
    };
    return SettingsModalController;
})();
//@ sourceMappingURL=SettingsModalController.js.map
