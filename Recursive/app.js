var graph;
var renderer;
var filesModal;
var settingsModal;
var topBar;
var contextMenu;
var heroController;
var stats;
var images = new ImageCache();
var settings = {
    maxCrawlDepth: 1,
    showFPS: false,
    showDebugCircles: false,
    userFilesRegex: "",
    enabledFileFilters: [
        CrawlerFileTypes.BINARY, 
        CrawlerFileTypes.IMAGE, 
        CrawlerFileTypes.OTHER, 
        CrawlerFileTypes.SOUND, 
        CrawlerFileTypes.VIDEO, 
        CrawlerFileTypes.USER
    ],
    removeDuplicateFiles: true
};
window.onload = function () {
    chrome.storage.sync.get(null, function (o) {
        for(var key in o) {
            settings[key] = o[key];
        }
        stats.domElement.style.visibility = settings.showFPS ? 'visible' : 'hidden';
    });
    $(".alert-container").disableSelection();
    $("form").each(function (i, e) {
        return e.onsubmit = function () {
            return false;
        };
    });
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '5px';
    stats.domElement.style.top = '5px';
    stats.domElement.style.visibility = 'hidden';
    document.body.appendChild(stats.domElement);
    zip.workerScriptsPath = "/lib/zipjs/";
    graph = new CrawlGraph();
    renderer = new Renderer("mainRenderCanvas", graph);
    filesModal = new FilesModalController('filesModal');
    settingsModal = new SettingsModalController('settingsModal');
    topBar = new TopBarController('topBar');
    contextMenu = new ContextMenuController('#mainRenderCanvas');
    heroController = new HeroController('heroUnit');
};
//@ sourceMappingURL=app.js.map
