
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

io.on('connection', function(socket){
  console.log('new user');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.removeAllListeners('find');
    socket.removeAllListeners('check');
    socket.removeAllListeners('message');
    socket.removeAllListeners('match');
    socket.removeAllListeners('turn');
  });

  socket.on('find', function(){
    let rkey = 'room ' + room;
    var timeup;

    socket.join( rkey, () => {
      let num = io.sockets.adapter.rooms[rkey].length;
      io.to(`${socket.id}`).emit("turn", num-1);
      if (num == 2) {
        room++;
        io.to(rkey).emit('match', rkey);
        setTimeout(() => {
          console.log("start from " + socket.id);
          io.to(rkey).emit('start', Date.now());
          timeup = setInterval(() => {
            io.to(rkey).emit('timeup');
          }, 30000)
        }, 3000)
      }
    });

    socket.on('check', (cord) => {
      clearInterval(timeup);
      socket.broadcast.to(rkey).emit('check pliz', cord);
      timeup = setInterval(() => {
        io.to(rkey).emit('timeup');
      }, 30000)
    })

    socket.on('message', (text) => {
      socket.broadcast.to(rkey).emit('message', text);
    })
  })
});

app.get('/', function(req, res){
  res.send('<h1>Omae wa mou shindeiru!</h1>');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});