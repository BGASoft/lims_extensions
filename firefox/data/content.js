self.port.on("Run", function(val) {
    /* attach source to content page */
    $(val).appendTo( "body" );
});