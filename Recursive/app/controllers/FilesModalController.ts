/// <reference path="../../app.ts">

declare function saveAs(data: any, filename: string);

class FilesModalController {

    filesModal: JQuery;
    crawler: Crawler;
    enabledFilters: CrawlerFileTypes[];
    selectedFiles: CrawlerFile[];
    fileTypeLabelLookups: any;

    constructor (elementId: string) {
        this.filesModal = $("#"+elementId);
        $(this.filesModal).find("#downloadAllBtn").click(e=>this.downloadAll());
        $(this.filesModal).find("#openPage").click(e=>this.openPage());        
        
        this.enabledFilters = settings.enabledFileFilters;
                
        var as : HTMLAnchorElement[] = $("#filesModal .nav-pills a").toArray();
        as.forEach(j=> $(j).click(c=> this.toggleFilter(j)));   
        
        this.filesModal.on('shown', () => renderer.isRendering = false);
        this.filesModal.on('hidden', () => {
            console.log("in");
            renderer.isRendering = true;
        });
    }

    open(crawler: Crawler) {
        this.crawler = crawler;
        var imgSrc = "http://g.etfv.co/http://" + encodeURI(crawler.parsedUrl.host);
        this.filesModal.find(".modal-header h3").html("<img src=\""+imgSrc+"\" width=\"19\" height=\"19\" /> "+crawler.parsedUrl.host);
        this.updateFileList();
        (<any>this.filesModal).modal();
    }

    toggleFilter(a:HTMLAnchorElement) {      
                  
        var type = CrawlerFileTypes.BINARY;
        if (a.id=="imagesPill") type = CrawlerFileTypes.IMAGE;
        if (a.id=="soundPill") type = CrawlerFileTypes.SOUND;
        if (a.id=="videoPill") type = CrawlerFileTypes.VIDEO;
        if (a.id=="otherPill") type = CrawlerFileTypes.OTHER;
        if (a.id=="userPill") type = CrawlerFileTypes.USER;

        if (this.enabledFilters.indexOf(type) != -1) {
            $(a).parent().removeClass("active");
            this.enabledFilters.splice(this.enabledFilters.indexOf(type), 1);
        }
        else {
            $(a).parent().addClass("active");
            this.enabledFilters.push(type);
        } 
        this.updateFileList();

        // Remember which filters were selected
        settings.enabledFileFilters = this.enabledFilters;
        chrome.storage.sync.set(settings);
    }

    updateFileList() {
        this.selectedFiles = [];        

        var crawlers = graph.getAllCrawlersForHost(this.crawler.parsedUrl.host);
        var files = CrawlerFile.getAllFilesFromCrawlers(crawlers);
        if (settings.removeDuplicateFiles) {
            files = CrawlerFile.getNonDuplicateFileList(files);
        }

        files.forEach(f=>{
            if (this.enabledFilters.indexOf(f.type) != -1) this.selectedFiles.push(f);
        });

        var iconClasses = {};
        iconClasses[CrawlerFileTypes.BINARY] = "briefcase";
        iconClasses[CrawlerFileTypes.IMAGE] = "picture";
        iconClasses[CrawlerFileTypes.OTHER] = "file";
        iconClasses[CrawlerFileTypes.SOUND] = "music";
        iconClasses[CrawlerFileTypes.VIDEO] = "film";
        iconClasses[CrawlerFileTypes.USER] = "user";

        $("#filesModal .list-of-files").html(this.selectedFiles.map(f=>{            
            var s = "<i class=\"icon-" + iconClasses[f.type] + "\"></i> ";
            s += '<a href="' + f.fileUrl + '">' + f.fileUrl + "</a>";
            return s;
        }).join('<br/>'));
    }

    downloadAll() {

        $('#downloadAllBtn').hide();
        $('#openPage').hide();
        var progbar = $('#downloadProgress').show();

        var fs = new zip.fs.FS();
        var count = this.selectedFiles.length;
        var remaining: CrawlerFile[] = [];  
        
        var updateProg = (f:CrawlerFile) =>
        {
            remaining.splice(remaining.indexOf(f), 1);
            var prog = Math.round(((count-remaining.length) / count) * 100);

            var bar = $("#downloadProgress .bar");
            bar.html("Downloading (" + prog + "%)");
            bar.css("width",prog+"%");

            if (remaining.length == 0) {
                bar.addClass("bar-success");                
                fs.exportBlob(blob=>{
                    saveAs(blob, this.crawler.parsedUrl.host + ".zip");
                    $('#downloadAllBtn').show();
                    $('#openPage').show();
                    bar.removeClass("bar-success");
                    var progbar = $('#downloadProgress').hide();
                }, (indx, maxIndx) =>{
                    var prog = Math.round((indx / maxIndx) * 100);
                    bar.html("Compressing ("+prog+"%)");
                });
            }
        };
        
        this.selectedFiles.forEach(f=>
        {            
            var request = new XMLHttpRequest();
            remaining.push(f);
			request.addEventListener("load", ()=>
			{
				var size = Number(request.getResponseHeader("Content-Length"));
                var blob = new Blob([request.response]);
				try { fs.root.addBlob(f.filename, blob); } catch (e) { }
				updateProg(f);                
			}, false);
			request.addEventListener("error", () => {
			    updateProg(f);
			}, false);
			request.open("GET", f.fileUrl);
			request.responseType = "blob";
			request.send();
        });     
    }

    openPage() {
        window.open(this.crawler.url, "_blank");
    }

}