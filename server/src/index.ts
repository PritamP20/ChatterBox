import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8080});

type RoomSockets = {
    [key: string]: WebSocket[];
};

let allSocket:RoomSockets ={

}

wss.on("connection", (socket)=>{
    console.log("User connected")
    socket.on("error", console.error);
    socket.on("close", ()=>{
        console.log("User disconnected")
    })

    socket.on("close", () => {
        console.log("User disconnected");
        for (const room in allSocket) {
            allSocket[room] = allSocket[room].filter((s) => s !== socket);
            if (allSocket[room].length === 0) {
                delete allSocket[room];
            }
        }
    });

    socket.on("message", (data)=>{
        const obj = JSON.parse(data.toString())
        const room = obj.room;
        const type = obj.type;
        if(type=='join'){
            if (!allSocket[room]) {
                console.log("new room")
                allSocket[room] = [];
            }
            allSocket[room].push(socket);
            console.log("joined")
        }
        if(type=='chat' && allSocket[room] && allSocket[room].includes(socket)){
            const objSend = {
                msg: obj.msg,
                name: obj.name,
                time: obj.time,
                img: obj.img
            }
            // allSocket[room].map(item=>item.send(obj.msg));
            allSocket[room].map(item=>item.send(JSON.stringify(objSend)));

            console.log("chatting")
        }
    })
})
