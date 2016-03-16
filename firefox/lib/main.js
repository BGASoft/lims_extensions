/* content script reference allows modification to webpage content */
var pageMods = require("sdk/page-mod");
/* used to load files */
var data = require("sdk/self").data;
/* local storage class */
var ss = require('sdk/simple-storage');

var workerarray = [];

/* worker for each open tab */
function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if(index != -1) {
        workerArray.splice(index, 1);
    }
}

exports.main = function() {

	/* toggle button reference */
    var { ToggleButton } = require('sdk/ui/button/toggle');

    /* panel class */
    var panel = require("sdk/panel").Panel({
        height: 330,
        contentURL: data.url("panel.html"),
        contentScriptFile: data.url("panel.js"),
        onHide: handleHide
    });

    /* Create a button */
    var button = ToggleButton({
        id: "show-settings",
        label: "LimsABC connect",
        icon: {
            "16": "./icon-16.png",
            "32": "./icon-32.png",
            "64": "./icon-64.png"
        },
        onChange: handleChange
    });

    /* Show the panel when the user clicks the button. */
    function handleChange(state) {
        if (state.checked) {
            panel.show({
                position: button
            });
        }
    }

    /* hide panel */
    function handleHide() {
        /* hide the popup panel */
        button.state('window', {checked: false});
    }

    /* function called when panel showed */
    panel.on("show", function() {
        /* read from storage set control settings */
        if(ss.storage["script-source"] !== undefined)
            panel.port.emit("load-script", ss.storage["script-source"])	/* send data to panel */
        /* show the popup panel */
        panel.port.emit("showDlg");
    });

    var pageMod = pageMods.PageMod({
        include: ['*'],
        contentScriptWhen: 'ready',
        contentScriptFile:
        [data.url("jquery.min.js"),	data.url("content.js")],
        onAttach: function(worker) {
            /* add tab to array of workers */
            workerarray.push(worker);

            worker.on('detach', function () {
                detachWorker(this, workerarray);
            });

            /*
            you can use worker.port.on to receive messages from
            content script in a similar way to panel.port.on
            */

            panel.port.on("Run", function(val) {
                worker.port.emit('Run', val);
            });
            panel.port.on("store-script", function(val) {
                ss.storage["script-source"]=val;
            });
        }
    });
}
