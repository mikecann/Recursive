declare function webkitRequestFullScreen();

class TopBarController {

    view: JQuery;

    constructor (elementId: string) {

        this.view = $("#" + elementId);

        graph.stateChanged.add(()=>this.onGraphStateChanged());

        // Grab the url and slam it in as the search 
        var q = (<any>Helpers.parseUri(window.location.href)).queryKey.url;
        if (q) $('#urlInput').attr('value', q); 

        this.view.find("#goBtn").click((e) => {
            this.onGoButtonClicked();
            e.preventDefault();
        });

        $("#settingsBtn").tooltip();
        $("#fullscreenBtn").tooltip();
        $("#resetBtn").tooltip();

        $("#settingsBtn").click(() => {
            settingsModal.open()
        });

        $("#resetBtn").click(() => {
            renderer.reset();
            graph.reset();
        });

        $("#fullscreenBtn").click(() => {
            var d: any = document;
            var de: any = document.documentElement;
     
            if (d.webkitIsFullScreen) {
                d.webkitCancelFullScreen();
            }
            else {                
                de.webkitRequestFullScreen();
            }
        });

        $(".alert-container")[0].onselect = e=> false;

    }
   
    private onGraphStateChanged() {
        $("#goBtn").removeClass("btn-success").removeClass("btn-warning").find("i").removeClass("icon-pause").removeClass("icon-globe").removeClass("icon-play");
        if (graph.state == CrawlGraphState.RUNNING) {
            $("#goBtn").addClass("btn-warning").find("i").addClass("icon-pause");
        }
        else if (graph.state == CrawlGraphState.PAUSED) {
            $("#goBtn").addClass("btn-success").find("i").addClass("icon-play");
        }
        else if (graph.state == CrawlGraphState.FINISHED) {
            var alert = $('<div class="alert alert-success offset4 span3"><button type="button" class="close" data-dismiss="alert">×</button><strong>Success!</strong> The recurse has finished :)</div>');   
            $("#goBtn").addClass("btn-success").find("i").addClass("icon-globe");         
            $(".alert-container").append(alert);
            alert.delay(2000).fadeOut(2000, function () { $(this).remove() });
        }
        else {
            $("#goBtn").addClass("btn-success").find("i").addClass("icon-globe");
        }
    }

    private onGoButtonClicked() {
        var url: string = $("#urlInput").val();
        if (graph.state==CrawlGraphState.RUNNING) {
            graph.pause();
        }
        else if (graph.state == CrawlGraphState.PAUSED) {
            if (graph.root.url != url) {
                renderer.reset();
                graph.reset();
                graph.start(url);
            }
            else {
                graph.resume();
            }
        }
        else {
            renderer.reset();
            graph.reset();
            graph.start(url);                
        }
    }
}

