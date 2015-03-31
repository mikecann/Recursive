/// <reference path="../../app.ts" />

enum CrawlerFileTypes {
    IMAGE,
    BINARY,
    SOUND,
    VIDEO,   
    OTHER,
    USER
}

class CrawlerFile {    
   
    type: CrawlerFileTypes;
    crawler: Crawler;
    fileUrl: string;
    extension: string;
    filename: string;

    constructor (crawler:Crawler, fileUrl:string) {
        this.fileUrl = fileUrl;
        this.crawler = crawler;
        this.filename = Helpers.parseUri(fileUrl).file;
        
        var tmp = this.filename.split(".");
        this.extension = tmp[tmp.length-1].toLowerCase();
        
        if (this.is(["png", "jpg", "gif", "ico", "jpeg"])) this.type = CrawlerFileTypes.IMAGE;
        else if (this.is(["flv", "avi", "wmv", "mp4"])) this.type = CrawlerFileTypes.VIDEO;
        else if (this.is(["wav", "mp3"])) this.type = CrawlerFileTypes.SOUND;   
        else if (this.is(["bin","zip","dat","7z","rar","tar","gz"])) this.type = CrawlerFileTypes.BINARY;
        else {
            //console.log("Unknown file type: "+this.filename);
            this.type = CrawlerFileTypes.OTHER;
        }
    }

    private is(types) : bool {
        return types.indexOf(this.extension) != -1;
    }

    static getAllFilesFromCrawlers(crawlers:Crawler[]) {
        var a: CrawlerFile[] = [];
        crawlers.forEach(c=>a =  a.concat(c.files));   
        return a;
    }

    static getNonDuplicateFileList(files: CrawlerFile[]): CrawlerFile[] {
        var o = {};
        files.forEach(f=>o[f.fileUrl] = f);
        var a: CrawlerFile[] = [];
        for (var key in o) a.push(o[key]);
        return a;
    }
}

