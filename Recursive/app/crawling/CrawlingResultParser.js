var CrawlingParserResult = (function () {
    function CrawlingParserResult() {
        this.files = [];
        this.links = [];
        this.userRegex = [];
        this.mailtos = [];
    }
    return CrawlingParserResult;
})();
var CrawlingResultParser = (function () {
    function CrawlingResultParser() {
    }
    CrawlingResultParser.prototype.parse = function (c) {
        var r = new CrawlingParserResult();
        this.parseHTMLForUserRegex(c, r);
        this.parseForFilesAndLinks(c, r);
        return r;
    };
    CrawlingResultParser.prototype.parseHTMLForUserRegex = function (c, r) {
        if (settings.userFilesRegex != "") {
            var reg = new RegExp(settings.userFilesRegex, 'g');
            var results = c.pageHTML.match(reg);
            if (results)
                results.forEach(function (s) { return r.userRegex.push(s); });
        }
    };
    CrawlingResultParser.prototype.parseForFilesAndLinks = function (c, r) {
        var links = [];
        // Grab all HREF links
        var results = c.pageHTML.match(/href\s*=\s*"([^"]*)/g);
        if (results)
            results.forEach(function (s) { return links.push(s.split("\"")[1]); });
        // And all SRC links
        results = c.pageHTML.match(/src\s*=\s*"([^"]*)/g);
        if (results)
            results.forEach(function (s) { return links.push(s.split("\"")[1]); });
        links.forEach(function (l) {
            var newURL = "";
            // All Bad
            if (l == "" || l == "/" || l == "#") {
                return;
            }
            // Anchors and json / js, probably not a link or file
            var firstChar = l.charAt(0);
            if (firstChar == "#" || firstChar == "{") {
                return;
            }
            else if (l.charAt(0) == "/") {
                newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
            }
            else if (l.charAt(0) == "?") {
                newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
            }
            else if (l.substr(0, 11) == "javascript:") {
                return;
            }
            else if (l.substr(0, 7) == "mailto:") {
                r.mailtos.push(l);
                return;
            }
            else if (l.indexOf("http") != -1 || l.indexOf("https") != -1) {
                newURL = l;
            }
            else {
                newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + "/" + l;
            }
            // Parse the string furthur to see if it is a file
            var f = Helpers.parseUri(newURL).file;
            if (f != "") {
                // Get the extension
                var tmp = f.split(".");
                var extn = tmp[tmp.length - 1].toLowerCase();
                // If its NOT one of a few known server side page types then lets assume its a file
                if (CrawlingResultParser.SERVER_SIDE_PAGE_TYPES.indexOf(extn) == -1) {
                    r.files.push(newURL);
                    return;
                }
            }
            // Else its a link
            r.links.push(newURL);
        });
    };
    CrawlingResultParser.SERVER_SIDE_PAGE_TYPES = ["html", "htm", "php", "asp", "aspx", "shtml", "jspx", "pl", "cgi", "ashx", "mspx"];
    return CrawlingResultParser;
})();
