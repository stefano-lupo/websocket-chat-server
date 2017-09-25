
$(document).ready(function() {

 var ws = new WebSocket('ws://86.43.98.198:3000', 'echo-protocol');

 $("#send").click(function() { 
    var message = $("#message").val();
    ws.send(message);
   
 });

 ws.addEventListener("message", function(e) {
    // The data is simply the message that we're sending back
    var msg = e.data;
    
    $("#chatlog").append("</br>" + msg);
 });
});
