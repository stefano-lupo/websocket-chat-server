var http = require('http');
var server = http.createServer(function (request, response) { });

server.listen(3000, function () {
    console.log((new Date()) + ': Server is listening on port 3000');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({ httpServer: server });

var id = 0;
var clients = new Map();
var messages = [];

function sendToAllClients(message) {
    clients.forEach(function(client) {
        client.sendUTF(message);
    })
}

wsServer.on('request', function (r) {
    // Envoked when client connects, send them all previous messages
    var connection = r.accept('echo-protocol', r.origin);
    connection.id = id++;
    clients.set(id, connection);
    console.log((new Date()) + ' Connection accepted [' + connection.id + ']');

    messages.forEach(function(message) {
       connection.sendUTF(message);
    });

    // Envoked when a message is sent
    connection.on('message', function (message) {
        var msgString = message.utf8Data;
        messages.push(msgString);
        sendToAllClients(msgString);
    });

    // Envoked when client disconnects
    connection.on('close', function (reasonCode, description) {
        message = {
		name: 'Server',
		avatar: "http://www.iconhot.com/icon/png/rrze/720/server-multiple.png",
		message: connection.remoteAddress + ' has left the chat room',
		date: new Date()
	}
	sendToAllClients(JSON.stringify(message));
	clients.delete(connection.id);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
