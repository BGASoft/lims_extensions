function stringToBinary(str)
{
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++)
        bufView[i] = str.charCodeAt(i);
    return buf;
}
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
function send_tcp_message(host,port,message,communication_port) {
    var current_socket_id=0;
    chrome.sockets.tcp.create({}, function(createInfo) {
        current_socket_id=createInfo.socketId;
        chrome.sockets.tcp.connect(current_socket_id,
        host, port, function(result){
            if (result === 0) {
                chrome.sockets.tcp.send(current_socket_id, stringToBinary(message), function(sendInfo){
                    console.log(sendInfo);
                    if(sendInfo.bytesSent!=undefined && sendInfo.bytesSent>0)
                    {
                        console.log("sent " + sendInfo.bytesSent);
                        chrome.sockets.tcp.disconnect(current_socket_id);
                        if(communication_port!=undefined)
                            communication_port.postMessage({status: true});
                    } else
                    {
                        if(communication_port!=undefined)
                            communication_port.postMessage({status: false});
                    }
                });
            } else
                if(communication_port!=undefined)
                    communication_port.postMessage({status: false});

        });
    });
    console.log('response sent');
}
function tcp_print_message(host,port,message,communication_port)
{
    send_tcp_message(host,port,message,communication_port);
}
function listen_for_messages()
{
    chrome.runtime.onMessageExternal.addListener(
        function(message, sender, sendResponse) {
            console.log(sender);
            console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
            console.log(message);
            if(typeof message.type!="undefined")
            {
                switch(message.type)
                {
                    case "tcp_print":
                        if(typeof message.print_host!="undefined" && typeof message.print_port!="undefined" && typeof message.print_message!="undefined")
                            tcp_print_message(message.print_host,parseInt(message.print_port),message.print_message);
                        break;
                }
            }
        }
    );
    chrome.runtime.onConnectExternal.addListener(function(communication_port) {
        communication_port.onMessage.addListener(function(message) {
            //console.log(sender);
            //console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
            console.log(message);
            if(typeof message.type!="undefined")
            {
                switch(message.type)
                {
                    case "tcp_print":
                        if(typeof message.print_host!="undefined" && typeof message.print_port!="undefined" && typeof message.print_message!="undefined")
                            tcp_print_message(message.print_host,parseInt(message.print_port),message.print_message,communication_port);
                        break;
                }
            }
        });
    });
}
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('background.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
(function() {
    listen_for_messages();
})();
