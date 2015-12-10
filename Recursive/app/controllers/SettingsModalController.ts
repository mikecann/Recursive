/// <reference path="../../app.ts" />

class SettingsModalController {

    view: JQuery;

    constructor (elementId: string) {
        this.view = $("#"+elementId);
        this.view.find('#saveBtn').click(() =>this.save());
        $("#userFilesRegexTip").tooltip();
    }
    
    open() {        
        $('#maxDepthInp').attr('value', settings.maxCrawlDepth);
        $("#showFPSChk").attr('checked',settings.showFPS + "");
        $("#removeDuplicateFilesChk").attr('checked',settings.removeDuplicateFiles + "");
        $("#showDebugCirclesChk").attr('checked',settings.showDebugCircles + "");
        $('#userFilesRegex').attr('value', settings.userFilesRegex);  

        this.view.find('.modal-body');
        this.view.modal();
    }   

    save() {
        settings.maxCrawlDepth = parseInt($('#maxDepthInp').attr('value'));
        settings.showFPS = Boolean($("#showFPSChk").is(':checked'));
        settings.showDebugCircles = Boolean($("#showDebugCirclesChk").is(':checked'));
        settings.removeDuplicateFiles = Boolean($("#removeDuplicateFilesChk").is(':checked'));
        settings.userFilesRegex = $('#userFilesRegex').attr('value');
        this.view.modal('hide');
        chrome.storage.sync.set(settings);
        stats.domElement.style.visibility = settings.showFPS ? 'visible' : 'hidden';
    }

}