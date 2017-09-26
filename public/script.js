$(document).ready(function () {
    var ws;
    var name, avatar;

    $("#join").submit(function( event ) {
        event.preventDefault();

        // Save credentials
        name = $("#name").val();
        avatar = $("#avatar").val();
      
        // Connnect to Server
        ws =  new WebSocket('ws://localhost:3000', 'echo-protocol');

        // Send join messgae  
        ws.onopen = function() {
            var message = {
                name: name,
                avatar: avatar,
                message: "joined the chatroom.",
                date: new Date()
            }
            ws.send(JSON.stringify(message));
        };

        // Allow messages to be sent
        $("#message").prop('disabled', false);
        $("#send-button").removeClass("disabled btn-danger").addClass("btn-success");

        // Add Listener for receiving messages
        ws.addEventListener("message", function (e) {
            var msg = JSON.parse(e.data);
            if(Array.isArray(msg)) {
                msg.forEach(function (message) {
                    addMessage(message);   
                });
            } else {
                addMessage(msg);
            }

            // Scroll to bottom of chat div
            $('#chat-div').scrollTop($('#chat-div')[0].scrollHeight);
        });
    });

    // Add listener for sending messages
    $("#send").submit(function( event ) {
        event.preventDefault();

        // Package up the message object
        var message = {
            name: name,
            avatar: avatar,
            message: $("#message").val(),
            date: new Date()
        }

        // Send the message object (serialized as a string)
        ws.send(JSON.stringify(message));
    });  

    // Some markup for the messages
    function addMessage(message) {
        $("#chatlog").append('<li id="message-li">'
            + '<div><img id="avatar-pic" src="'
            + "  " + message.avatar + '">' 
            + "<h4>" + message.name + "</h4>"
            + '<p id="date-string">' + new Date(message.date).toLocaleTimeString() + "</p></div>" 
            + message.message 
            + "<hr>"   
            + "</li>"
        );
    }
});