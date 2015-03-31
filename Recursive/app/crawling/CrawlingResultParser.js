var CrawlingParserResult = (function () {
    function CrawlingParserResult() {
        this.files = new Array();
        this.links = new Array();
        this.userRegex = new Array();
        this.mailtos = new Array();
    }
    return CrawlingParserResult;
})();
var CrawlingResultParser = (function () {
    function CrawlingResultParser() { }
    CrawlingResultParser.SERVER_SIDE_PAGE_TYPES = [
        "html", 
        "htm", 
        "php", 
        "asp", 
        "aspx", 
        "shtml", 
        "jspx", 
        "pl", 
        "cgi", 
        "ashx", 
        "mspx"
    ];
    CrawlingResultParser.prototype.parse = function (c) {
        var r = new CrawlingParserResult();
        this.parseHTMLForUserRegex(c, r);
        this.parseForFilesAndLinks(c, r);
        return r;
    };
    CrawlingResultParser.prototype.parseHTMLForUserRegex = function (c, r) {
        if(settings.userFilesRegex != "") {
            var reg = new RegExp(settings.userFilesRegex, 'g');
            var results = c.pageHTML.match(reg);
            if(results) {
                results.forEach(function (s) {
                    return r.userRegex.push(s);
                });
            }
        }
    };
    CrawlingResultParser.prototype.parseForFilesAndLinks = function (c, r) {
        var links = new Array();
        var results = c.pageHTML.match(/href\s*=\s*"([^"]*)/g);
        if(results) {
            results.forEach(function (s) {
                return links.push(s.split("\"")[1]);
            });
        }
        results = c.pageHTML.match(/src\s*=\s*"([^"]*)/g);
        if(results) {
            results.forEach(function (s) {
                return links.push(s.split("\"")[1]);
            });
        }
        links.forEach(function (l) {
            var newURL = "";
            if(l == "" || l == "/" || l == "#") {
                return;
            }
            var firstChar = l.charAt(0);
            if(firstChar == "#" || firstChar == "{") {
                return;
            } else {
                if(l.charAt(0) == "/") {
                    newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
                } else {
                    if(l.charAt(0) == "?") {
                        newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
                    } else {
                        if(l.substr(0, 11) == "javascript:") {
                            return;
                        } else {
                            if(l.substr(0, 7) == "mailto:") {
                                r.mailtos.push(l);
                                return;
                            } else {
                                if(l.indexOf("http") != -1 || l.indexOf("https") != -1) {
                                    newURL = l;
                                } else {
                                    newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + "/" + l;
                                }
                            }
                        }
                    }
                }
            }
            var f = Helpers.parseUri(newURL).file;
            if(f != "") {
                var tmp = f.split(".");
                var extn = tmp[tmp.length - 1].toLowerCase();
                if(CrawlingResultParser.SERVER_SIDE_PAGE_TYPES.indexOf(extn) == -1) {
                    r.files.push(newURL);
                    return;
                }
            }
            r.links.push(newURL);
        });
    };
    return CrawlingResultParser;
})();
//@ sourceMappingURL=CrawlingResultParser.js.map
