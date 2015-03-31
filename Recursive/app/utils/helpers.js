var Helpers = (function () {
    function Helpers() { }
    Helpers.p1 = new TSM.vec2();
    Helpers.p2 = new TSM.vec2();
    Helpers.p3 = new TSM.vec2();
    Helpers.p4 = new TSM.vec2();
    Helpers.p5 = new TSM.vec2();
    Helpers.options = {
        strictMode: false,
        key: [
            "source", 
            "protocol", 
            "authority", 
            "userInfo", 
            "user", 
            "password", 
            "host", 
            "port", 
            "relative", 
            "path", 
            "directory", 
            "file", 
            "query", 
            "anchor"
        ],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };
    Helpers.shuffleArray = function shuffleArray(myArray) {
        var i = myArray.length;
        if(i == 0) {
            return false;
        }
        while(--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempi = myArray[i];
            var tempj = myArray[j];
            myArray[i] = tempj;
            myArray[j] = tempi;
        }
    }
    Helpers.randomString = function randomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    Helpers.parseUri = function parseUri(str) {
        var o = this.options;
        var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
        var uri = {
        };
        var i = 14;
        while(i--) {
            uri[o.key[i]] = m[i] || "";
        }
        uri[o.q.name] = {
        };
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if($1) {
                uri[o.q.name][$1] = $2;
            }
        });
        return uri;
    }
    Helpers.makeDocumentFragment = function makeDocumentFragment(htmlText) {
        var range = document.createRange();
        var frag = range.createContextualFragment(htmlText);
        var d = document.createElement('div');
        d.appendChild(frag);
        return d;
    }
    return Helpers;
})();
//@ sourceMappingURL=helpers.js.map
