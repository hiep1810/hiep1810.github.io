var io = require('socket.io')(8081);

; //the server object listens on port 8080
const user = [];
io.on('connection', socket => {
    console.log(socket.id);
    socket.on("NGUOI_DANG_KY", username => {
        const isExist = user.some(e => e.ten === user.ten);
        if (isExist) {
            socket.emit('BI-TRUNG');
        }
        else {
            socket.peerId = username.peerId;
            user.push(username);
            user.forEach(element =>{
                console.log(element.peerId);
            });
            socket.emit("DANH-SACH-ONLINE", user);
            console.log(username);
            socket.broadcast.emit("CO-TK-MOI", username);
        }
    })
    socket.on('disconnect', () =>{
        const index = user.findIndex(item => item.peerId === socket.peerId);
        user.splice(index,1);
        io.emit("NGAT-KET-NOI", socket.peerId);
    });
});

