var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var jogadores = {};
var rooms = {};

app.get('/', function(req, res) {
   res.send('Server Online');
   //res.sendfile('index.html');
});

var roomno = 1;

io.on("connection", function (client) {  

   	if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    
    client.on("play", function(name){
    	client.join("room-"+roomno);
    	jogadores[client.id] = name;
    	rooms[client.id] = "room-"+roomno;
        console.log("Jogador: " + name + " entrou room-"+roomno);

    });

    client.on("send", function(msg){
    	console.log("Sala: " + rooms[client.id] + " disse: " + msg);
        client.in(rooms[client.id]).emit("chat", jogadores[client.id], msg);
    });
    /*
    setInterval(() => {
  client.in("room-"+roomno).emit("room", jogadores[client.id], roomno);
}, 5000);
    
    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", jogadores[client.id] + " has left the server.");
        delete jogadores[client.id];
    });*/
});

http.listen(3000, function(){
  console.log('Porta para acessar é 3000');
});




