// The ID of the extension we want to talk to.
var lims_extension = "cmmjmcappjhjgpjgpaglpfhjijmhnhhb";

function isFirefox()
{
    return false;
}
function limsExtensionTCPPrint(host,port,message,callback)
{
    sendMessageToLimsExtension({
        type:"tcp_print",
        print_host:host,
        print_port:port,
        print_message:message,
    },callback);
}
function sendMessageToLimsExtension(message_content,callback)
{
    if(typeof chrome.runtime.sendMessage!="undefined")
    {
        chrome.runtime.sendMessage(lims_extension, message_content,callback);
        console.log("sent");
    } else if(isFirefox())
    {

    } else
    {
        alert('communication with limsAbc extension is not possible');
    }
}
// Make a simple request:
