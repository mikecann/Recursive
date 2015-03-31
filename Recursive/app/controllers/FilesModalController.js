var FilesModalController = (function () {
    function FilesModalController(elementId) {
        var _this = this;
        this.filesModal = $("#" + elementId);
        $(this.filesModal).find("#downloadAllBtn").click(function (e) {
            return _this.downloadAll();
        });
        $(this.filesModal).find("#openPage").click(function (e) {
            return _this.openPage();
        });
        this.enabledFilters = settings.enabledFileFilters;
        var as = $("#filesModal .nav-pills a").toArray();
        as.forEach(function (j) {
            return $(j).click(function (c) {
                return _this.toggleFilter(j);
            });
        });
        this.filesModal.on('shown', function () {
            return renderer.isRendering = false;
        });
        this.filesModal.on('hidden', function () {
            console.log("in");
            renderer.isRendering = true;
        });
    }
    FilesModalController.prototype.open = function (crawler) {
        this.crawler = crawler;
        var imgSrc = "http://g.etfv.co/http://" + encodeURI(crawler.parsedUrl.host);
        this.filesModal.find(".modal-header h3").html("<img src=\"" + imgSrc + "\" width=\"19\" height=\"19\" /> " + crawler.parsedUrl.host);
        this.updateFileList();
        (this.filesModal).modal();
    };
    FilesModalController.prototype.toggleFilter = function (a) {
        var type = CrawlerFileTypes.BINARY;
        if(a.id == "imagesPill") {
            type = CrawlerFileTypes.IMAGE;
        }
        if(a.id == "soundPill") {
            type = CrawlerFileTypes.SOUND;
        }
        if(a.id == "videoPill") {
            type = CrawlerFileTypes.VIDEO;
        }
        if(a.id == "otherPill") {
            type = CrawlerFileTypes.OTHER;
        }
        if(a.id == "userPill") {
            type = CrawlerFileTypes.USER;
        }
        if(this.enabledFilters.indexOf(type) != -1) {
            $(a).parent().removeClass("active");
            this.enabledFilters.splice(this.enabledFilters.indexOf(type), 1);
        } else {
            $(a).parent().addClass("active");
            this.enabledFilters.push(type);
        }
        this.updateFileList();
        settings.enabledFileFilters = this.enabledFilters;
        chrome.storage.sync.set(settings);
    };
    FilesModalController.prototype.updateFileList = function () {
        var _this = this;
        this.selectedFiles = [];
        var crawlers = graph.getAllCrawlersForHost(this.crawler.parsedUrl.host);
        var files = CrawlerFile.getAllFilesFromCrawlers(crawlers);
        if(settings.removeDuplicateFiles) {
            files = CrawlerFile.getNonDuplicateFileList(files);
        }
        files.forEach(function (f) {
            if(_this.enabledFilters.indexOf(f.type) != -1) {
                _this.selectedFiles.push(f);
            }
        });
        var iconClasses = {
        };
        iconClasses[CrawlerFileTypes.BINARY] = "briefcase";
        iconClasses[CrawlerFileTypes.IMAGE] = "picture";
        iconClasses[CrawlerFileTypes.OTHER] = "file";
        iconClasses[CrawlerFileTypes.SOUND] = "music";
        iconClasses[CrawlerFileTypes.VIDEO] = "film";
        iconClasses[CrawlerFileTypes.USER] = "user";
        $("#filesModal .list-of-files").html(this.selectedFiles.map(function (f) {
            var s = "<i class=\"icon-" + iconClasses[f.type] + "\"></i> ";
            s += '<a href="' + f.fileUrl + '">' + f.fileUrl + "</a>";
            return s;
        }).join('<br/>'));
    };
    FilesModalController.prototype.downloadAll = function () {
        var _this = this;
        $('#downloadAllBtn').hide();
        $('#openPage').hide();
        var progbar = $('#downloadProgress').show();
        var fs = new zip.fs.FS();
        var count = this.selectedFiles.length;
        var remaining = [];
        var updateProg = function (f) {
            remaining.splice(remaining.indexOf(f), 1);
            var prog = Math.round(((count - remaining.length) / count) * 100);
            var bar = $("#downloadProgress .bar");
            bar.html("Downloading (" + prog + "%)");
            bar.css("width", prog + "%");
            if(remaining.length == 0) {
                bar.addClass("bar-success");
                fs.exportBlob(function (blob) {
                    saveAs(blob, _this.crawler.parsedUrl.host + ".zip");
                    $('#downloadAllBtn').show();
                    $('#openPage').show();
                    bar.removeClass("bar-success");
                    var progbar = $('#downloadProgress').hide();
                }, function (indx, maxIndx) {
                    var prog = Math.round((indx / maxIndx) * 100);
                    bar.html("Compressing (" + prog + "%)");
                });
            }
        };
        this.selectedFiles.forEach(function (f) {
            var request = new XMLHttpRequest();
            remaining.push(f);
            request.addEventListener("load", function () {
                var size = Number(request.getResponseHeader("Content-Length"));
                var blob = new Blob([
                    request.response
                ]);
                try  {
                    fs.root.addBlob(f.filename, blob);
                } catch (e) {
                }
                updateProg(f);
            }, false);
            request.addEventListener("error", function () {
                updateProg(f);
            }, false);
            request.open("GET", f.fileUrl);
            request.responseType = "blob";
            request.send();
        });
    };
    FilesModalController.prototype.openPage = function () {
        window.open(this.crawler.url, "_blank");
    };
    return FilesModalController;
})();
//@ sourceMappingURL=FilesModalController.js.map
