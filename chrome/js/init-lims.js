function send_udp_message(host,port,message) {
    var current_socket_id=0;
    chrome.sockets.udp.create({}, function(createInfo) {
        current_socket_id=createInfo.socketId;
        chrome.sockets.udp.send(current_socket_id,message,
        host, port, function(sendInfo){
            console.log("sent " + sendInfo.bytesSent);
        });
    });
}
function send_tcp_message(host,port,message) {
    var current_socket_id=0;
    chrome.sockets.tcp.create({}, function(createInfo) {
        current_socket_id=createInfo.socketId;
        chrome.sockets.tcp.connect(current_socket_id,
        host, port, function(){
            chrome.sockets.tcp.send(current_socket_id, message, function(sendInfo){
                console.log("sent " + sendInfo.bytesSent);
                chrome.sockets.tcp.disconnect(current_socket_id);
            });
        });
    });
}
function tcp_print_message(host,port,message)
{
    send_tcp_message(host,port,message);
}
function listen_for_messages()
{
    chrome.runtime.onMessageExternal.addListener(
      function(message, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log(message);
        if(typeof message.type!="undefined")
        {
            switch(message.type)
            {
                case "tcp_print":
                    if(typeof message.print_host!="undefined" && typeof message.print_port!="undefined" && typeof message.print_message!="undefined")
                    {
                        tcp_print_message(message.print_host,message.print_port,message.print_message);
                    }
                    break;
            }
        }
      });
      console.log('listening started!');
}
(function() {
    listen_for_messages();
})();
