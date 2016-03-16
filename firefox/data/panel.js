/*
    Get the source code text from storage via the addon add to textarea control
*/
self.port.on("load-script", function(val) {
    document.getElementById('code').value = val;
});

/*
    On Run button click send the script text to the addon
*/
self.port.on("showDlg", function(val) {		/* called when popup shown */

    /* on button click handler */
    document.getElementById('run').onclick = function(){
    var script = document.getElementById('code').value;
        self.port.emit("Run", script);
    };

    /* update storage when script text changes */
    document.getElementById('code').onkeyup = function(){
        self.port.emit("store-script", this.value);
    };
});