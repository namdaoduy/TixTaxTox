
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io').listen(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

var room = 0;
var timeup = {};

let removeAll = (socket) => {
  var events = ['check','message','end game'];
  for (var e of events) {
    socket.removeAllListeners(e);
  }
}

io.on('connection', function(socket){
  console.log('new user');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('find', () => {
    var rkey = 'room ' + room;

    socket.join( rkey, () => {
      var num = io.sockets.adapter.rooms[rkey].length;
      io.to(`${socket.id}`).emit("turn", num-1);
      if (num == 2) {
        console.log("match by " + socket.id)
        room++;
        io.to(rkey).emit('match', rkey);
        setTimeout(() => {
          io.to(rkey).emit('start', Date.now());
          timeup[rkey] = setInterval(() => {
            io.to(rkey).emit('timeup');
          }, 30000)
        }, 5000)
      }
    });

    socket.on('check', (cord) => {
      clearInterval(timeup[rkey]);
      timeup[rkey] = setInterval(() => {
        io.to(rkey).emit('timeup');
      }, 30000)
      socket.broadcast.to(rkey).emit('check pliz', cord);
    })

    socket.on('message', (text) => {
      socket.to(rkey).emit('message to', text);
    })

    socket.on('disconnect', () => {
      io.to(rkey).emit('player disconnect');
      clearInterval(timeup[rkey]);
    })

    socket.on('end game', () => {
      socket.leave(rkey);
      removeAll(socket);
    })

  })
});

app.get('/', function(req, res){
  res.send('<h1>Omae wa mou shindeiru!</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
