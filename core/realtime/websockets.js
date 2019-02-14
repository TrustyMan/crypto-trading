"use strict";

var utils = require("../../libs/utils");

    /**
 * Function defines server events and adds/removes client socket
 * @access public
 * @param {object} io - socket initial object
 * @returns {void}
 */
exports.run = function(io, sessionParameters) {
    io.use(require("express-socket.io-session")(sessionParameters));

    var currentChattingUser = {}; // 현재 나와 Chatting진행중에 있는 사용자.
    var active_users = {}; // Login진행하고 Chatting방에 들어와있는 사용자.

    io.sockets.on("connection", function (socket) {

        socket.emit('login');
        userDAO.getAllUsers(function ("err, results) {
            if(err) {
                socket.emit("connected", { socketId: socket.id, message: results, success: false });
            } else {
                socket.emit("connected", { socketId: socket.id, message: results, success: true });
            }
        });

        socket.on("user", function (data) {
            currentChattingUser[socket.id] = {
                socket: socket
            };

            active_users[socket.id] = {
                socket: socket.id,
                _id: data._id,
                email: data.email,
                username: data.name,
                photo_name: data.photo_name,
                logged: data.logged,
                status: data.status
            };

            
            io.sockets.emit("activeuser", {active: active_users});
        });

        socket.on("sendmessage", function (data) {

            if(data.socketid == "all") {
                var view_msgdata = {sender: data.sender, sendername: data.sendername, senderphotoname: data.senderphotoname, receiver: 'all', message: data.message, created: data.created};
                socket.broadcast.emit("receivemessage", view_msgdata);

                var db_msgdata = { sender: data.sender, receiver: 'all', message: data.message, sendername: data.sendername, created: data.created};
                messageDAO.addMessage(db_msgdata, function (err, success) {});

            } else {
                var view_msgdata = {sender: data.sender, sendername: data.sendername, senderphotoname: data.senderphotoname, receiver: data.receiver, message: data.message, created: data.created};
                currentChattingUser[data.socketid].socket.emit("receivemessage", view_msgdata);

                var db_msgdata = { sender: data.sender, receiver: data.receiver, message: data.message, sendername: data.sendername, created: data.created};
                messageDAO.addMessage(db_msgdata, function (err, success) {});
            }
        });

        socket.on("disconnect", function () {
                
            userDAO.updateUserAfterLog(active_users[socket.id]._id, {logged:0, status:0}, function (err, success) {
                if(success) {
                    delete currentChattingUser[socket.id];
                    delete active_users[socket.id];
                    io.sockets.emit("activeuser", {active: active_users});
                } else {
                    console.log("Error");
                }
            }); 
        });
    });

    //start reading data and sending to client by cron job
    var websocketJob = new cronJob({
        cronTime: config.get("websocketsRestartCronTime"),
        onTick: function() {

            //console.log('CRON worker: ' + cluster.worker.id + ' currentChattingUser: ' + _.size(currentChattingUser));
        },
        start: false
    });

    websocketJob.start();
};