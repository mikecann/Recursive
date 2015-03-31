/// <reference path="lib/jquery/jquery.d.ts" />
/// <reference path="lib/jqueryplugins/jqmodal.d.ts" />
/// <reference path="lib/jqueryplugins/jqcontextmenu.d.ts" />
/// <reference path="lib/stats/stats.d.ts" />
/// <reference path="lib/zipjs/zipjs.d.ts" />
/// <reference path="lib/tsm/tsm-0.6.d.ts" />
/// <reference path="lib/box2dweb/box2dweb.d.ts" />
/// <reference path="lib/jqueryplugins/jqplugins.d.ts" />

/// <reference path="app/utils/helpers.ts" />
/// <reference path="app/utils/signals.ts" />
/// <reference path="app/utils/ImageCache.ts" />

/// <reference path="app/crawling/CrawlGraph.ts" />
/// <reference path="app/crawling/Crawler.ts" />
/// <reference path="app/crawling/CrawlerMocks.ts" />
/// <reference path="app/crawling/CrawlerFile.ts" />
/// <reference path="app/crawling/CrawlerSignals.ts" />
/// <reference path="app/crawling/CrawlingResultParser.ts" />

/// <reference path="app/controllers/FilesModalController.ts" />
/// <reference path="app/controllers/SettingsModalController.ts" />
/// <reference path="app/controllers/TopBarController.ts" />
/// <reference path="app/controllers/ContextMenuController.ts" />
/// <reference path="app/controllers/HeroController.ts" />

/// <reference path="app/rendering/canvas2d/Physics.ts" />
/// <reference path="app/rendering/canvas2d/PhysicsRenderNode.ts" />
/// <reference path="app/rendering/canvas2d/RenderNode.ts" />
/// <reference path="app/rendering/canvas2d/Renderer.ts" />
/// <reference path="app/rendering/canvas2d/Camera.ts" />
/// <reference path="app/rendering/canvas2d/FileNode.ts" />
/// <reference path="app/rendering/canvas2d/HostNode.ts" />
/// <reference path="app/rendering/canvas2d/IconSheet.ts" />
/// <reference path="app/rendering/canvas2d/PageNode.ts" />
/// <reference path="app/rendering/canvas2d/Anim.ts" />

declare var chrome: any;
declare function webkitRequestAnimationFrame(cb:()=>void);

var graph: CrawlGraph;
var renderer: Renderer;
var filesModal: FilesModalController;
var settingsModal: SettingsModalController;
var topBar: TopBarController;
var contextMenu: ContextMenuController;
var heroController: HeroController;
var stats: Stats;
var images = new ImageCache();

var settings = {
    maxCrawlDepth: 1,
    showFPS: false,
    showDebugCircles: false,
    userFilesRegex: "",
    enabledFileFilters: [CrawlerFileTypes.BINARY,CrawlerFileTypes.IMAGE,CrawlerFileTypes.OTHER,CrawlerFileTypes.SOUND,CrawlerFileTypes.VIDEO,CrawlerFileTypes.USER],
    removeDuplicateFiles: true
};

window.onload = () => {

    chrome.storage.sync.get(null, (o) =>{
        for (var key in o) settings[key] = o[key];
        stats.domElement.style.visibility = settings.showFPS ? 'visible' : 'hidden';
    });

    $(".alert-container").disableSelection();

    // Prevent all forms from submitting
    $("form").each((i, e: HTMLFormElement) => e.onsubmit = () => false);  
       
    // Align top-left
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '5px';
    stats.domElement.style.top = '5px';
    stats.domElement.style.visibility = 'hidden';
    document.body.appendChild( stats.domElement );     

    zip.workerScriptsPath = "/lib/zipjs/";
    
    graph = new CrawlGraph();
    renderer = new Renderer("mainRenderCanvas",graph);

    filesModal = new FilesModalController('filesModal');    
    settingsModal = new SettingsModalController('settingsModal');    
    topBar = new TopBarController('topBar');   
    contextMenu = new ContextMenuController('#mainRenderCanvas');
    heroController = new HeroController('heroUnit'); 
};