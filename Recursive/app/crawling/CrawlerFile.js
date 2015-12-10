var CrawlerFileTypes;
(function (CrawlerFileTypes) {
    CrawlerFileTypes[CrawlerFileTypes["IMAGE"] = 0] = "IMAGE";
    CrawlerFileTypes[CrawlerFileTypes["BINARY"] = 1] = "BINARY";
    CrawlerFileTypes[CrawlerFileTypes["SOUND"] = 2] = "SOUND";
    CrawlerFileTypes[CrawlerFileTypes["VIDEO"] = 3] = "VIDEO";
    CrawlerFileTypes[CrawlerFileTypes["OTHER"] = 4] = "OTHER";
    CrawlerFileTypes[CrawlerFileTypes["USER"] = 5] = "USER";
})(CrawlerFileTypes || (CrawlerFileTypes = {}));
var CrawlerFile = (function () {
    function CrawlerFile(crawler, fileUrl) {
        this.fileUrl = fileUrl;
        this.crawler = crawler;
        this.filename = Helpers.parseUri(fileUrl).file;
        var tmp = this.filename.split(".");
        this.extension = tmp[tmp.length - 1].toLowerCase();
        if (this.is(["png", "jpg", "gif", "ico", "jpeg"]))
            this.type = CrawlerFileTypes.IMAGE;
        else if (this.is(["flv", "avi", "wmv", "mp4"]))
            this.type = CrawlerFileTypes.VIDEO;
        else if (this.is(["wav", "mp3"]))
            this.type = CrawlerFileTypes.SOUND;
        else if (this.is(["bin", "zip", "dat", "7z", "rar", "tar", "gz"]))
            this.type = CrawlerFileTypes.BINARY;
        else {
            //console.log("Unknown file type: "+this.filename);
            this.type = CrawlerFileTypes.OTHER;
        }
    }
    CrawlerFile.prototype.is = function (types) {
        return types.indexOf(this.extension) != -1;
    };
    CrawlerFile.getAllFilesFromCrawlers = function (crawlers) {
        var a = [];
        crawlers.forEach(function (c) { return a = a.concat(c.files); });
        return a;
    };
    CrawlerFile.getNonDuplicateFileList = function (files) {
        var o = {};
        files.forEach(function (f) { return o[f.fileUrl] = f; });
        var a = [];
        for (var key in o)
            a.push(o[key]);
        return a;
    };
    return CrawlerFile;
})();
