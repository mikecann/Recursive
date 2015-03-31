var CrawlerFileTypes;
(function (CrawlerFileTypes) {
    CrawlerFileTypes._map = [];
    CrawlerFileTypes._map[0] = "IMAGE";
    CrawlerFileTypes.IMAGE = 0;
    CrawlerFileTypes._map[1] = "BINARY";
    CrawlerFileTypes.BINARY = 1;
    CrawlerFileTypes._map[2] = "SOUND";
    CrawlerFileTypes.SOUND = 2;
    CrawlerFileTypes._map[3] = "VIDEO";
    CrawlerFileTypes.VIDEO = 3;
    CrawlerFileTypes._map[4] = "OTHER";
    CrawlerFileTypes.OTHER = 4;
    CrawlerFileTypes._map[5] = "USER";
    CrawlerFileTypes.USER = 5;
})(CrawlerFileTypes || (CrawlerFileTypes = {}));
var CrawlerFile = (function () {
    function CrawlerFile(crawler, fileUrl) {
        this.fileUrl = fileUrl;
        this.crawler = crawler;
        this.filename = Helpers.parseUri(fileUrl).file;
        var tmp = this.filename.split(".");
        this.extension = tmp[tmp.length - 1].toLowerCase();
        if(this.is([
            "png", 
            "jpg", 
            "gif", 
            "ico", 
            "jpeg"
        ])) {
            this.type = CrawlerFileTypes.IMAGE;
        } else {
            if(this.is([
                "flv", 
                "avi", 
                "wmv", 
                "mp4"
            ])) {
                this.type = CrawlerFileTypes.VIDEO;
            } else {
                if(this.is([
                    "wav", 
                    "mp3"
                ])) {
                    this.type = CrawlerFileTypes.SOUND;
                } else {
                    if(this.is([
                        "bin", 
                        "zip", 
                        "dat", 
                        "7z", 
                        "rar", 
                        "tar", 
                        "gz"
                    ])) {
                        this.type = CrawlerFileTypes.BINARY;
                    } else {
                        this.type = CrawlerFileTypes.OTHER;
                    }
                }
            }
        }
    }
    CrawlerFile.prototype.is = function (types) {
        return types.indexOf(this.extension) != -1;
    };
    CrawlerFile.getAllFilesFromCrawlers = function getAllFilesFromCrawlers(crawlers) {
        var a = [];
        crawlers.forEach(function (c) {
            return a = a.concat(c.files);
        });
        return a;
    }
    CrawlerFile.getNonDuplicateFileList = function getNonDuplicateFileList(files) {
        var o = {
        };
        files.forEach(function (f) {
            return o[f.fileUrl] = f;
        });
        var a = [];
        for(var key in o) {
            a.push(o[key]);
        }
        return a;
    }
    return CrawlerFile;
})();
//@ sourceMappingURL=CrawlerFile.js.map
