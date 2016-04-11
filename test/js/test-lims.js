// The ID of the extension we want to talk to.
var lims_chromeapp = "cmmjmcappjhjgpjgpaglpfhjijmhnhhb";

function isFirefox()
{
    return false;
}
function limsChromeAppTCPPrint(host,port,message,callback)
{
    sendMessageToLimsChromeApp({
        type:"tcp_print",
        print_host:host,
        print_port:port,
        print_message:message,
    },callback);
}
function sendMessageToLimsChromeApp(message_content,callback)
{
    if(typeof chrome.runtime.sendMessage!="undefined")
    {
        var port = chrome.runtime.connect(lims_chromeapp);
        port.postMessage(message_content);
        port.onMessage.addListener(function(request, sender, sendResponse){
            callback(request);
        })
        //chrome.runtime.sendMessage(lims_chromeapp, message_content,callback);
        console.log("sent");
    } else if(isFirefox())
    {

    } else
    {
        alert('communication with limsAbc chrome app is not possible');
    }
}
// Make a simple request:
