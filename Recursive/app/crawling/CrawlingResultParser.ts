/// <reference path="../../app.ts" />

class CrawlingParserResult {
    files = new string[];
    links = new string[];
    userRegex = new string[];
    mailtos = new string[];
}

class CrawlingResultParser {

    public static SERVER_SIDE_PAGE_TYPES = ["html", "htm", "php", "asp", "aspx", "shtml", "jspx", "pl", "cgi", "ashx", "mspx"];

    parse(c: Crawler) : CrawlingParserResult {
        var r = new CrawlingParserResult();
        this.parseHTMLForUserRegex(c,r);
        this.parseForFilesAndLinks(c,r);
        return r;
    }

    private parseHTMLForUserRegex(c:Crawler, r:CrawlingParserResult) {      
        if (settings.userFilesRegex != "") {   
            var reg = new RegExp(settings.userFilesRegex,'g');
            var results = c.pageHTML.match(reg);
            if(results) results.forEach(s=>r.userRegex.push(s));            
        }  
    }

    private parseForFilesAndLinks(c:Crawler, r:CrawlingParserResult) {

        var links = new string[];

        // Grab all HREF links
        var results = c.pageHTML.match(/href\s*=\s*"([^"]*)/g);
        if (results) results.forEach(s=>links.push(s.split("\"")[1]));

        // And all SRC links
        results = c.pageHTML.match(/src\s*=\s*"([^"]*)/g);
        if (results) results.forEach(s=>links.push(s.split("\"")[1]));

        links.forEach(l => {

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

            // Domain roots need to have the absolute path applied
            else if (l.charAt(0) == "/") {
                newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
            }

            // Query strings need to be rooted
            else if (l.charAt(0) == "?") {
                newURL = c.parsedUrl.protocol + "://" + c.parsedUrl.host + l;
            }

            // No parsing JS
            else if (l.substr(0, 11) == "javascript:") {
                return;
            }

            // Mailtos could be interesting
            else if (l.substr(0, 7) == "mailto:") {
                r.mailtos.push(l);
                return;
            }

            // If its not a familiar protocol then lets just try to recurse into it anyway
            else if (l.indexOf("http") != -1 || l.indexOf("https") != -1) {
                newURL = l;
            }

            // If all else fails, lets just try to parse it from the root of our parent
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

    }

}