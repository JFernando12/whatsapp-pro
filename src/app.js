const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Client } = require("whatsapp-web.js");
const client = new Client();
const qrcode = require("qrcode-terminal");
const path = require("path");
const { Server } = require("socket.io");
const io = new Server(server);

//CONFIGURACIÓN DEL PUERTO
app.set("port", 3000);

//MIDLEWARES
app.use(cors())

//CONFIGURAIÓN DE WHATSAPP
client.on("qr", (qr) => {
    qrcode.generate(qr, {small: true});
})

client.on("ready", () => {
    console.log("Client is ready!")
})

const listenMessage = () => {
    client.on("message", msg => {
        console.log(msg.from, msg.body);
        if(msg.from != "status@broadcast") {
            io.emit("message:noLocal", `${msg.from}: ${msg.body}`) //Cuando recibimos un mensaje lo enviamos a main.js para que lo muestre en pantalla
        }
    })
}

const sendMessage = (to, msg) => {
    client.sendMessage(to, msg)
}

listenMessage();

client.initialize();


// CONFIGURACIÓN DE WEBSOCKETS
io.on("connection", (socket) => {
    console.log("User Connected: ", socket.id)
    socket.on("disconnect", () => {
        console.log("User diconnected: ")
    })
    socket.on("message:local", (msg) => { //Recibo el valor del navegador.
        sendMessage(`521${msg.number}@c.us`, msg.message); //Envío el msj.
        io.emit("message:local", msg.message); //Devuelvo el valor al navegador para que lo muestre.
    })
})

//ARCHIVOS ESTATICOS
app.use(express.static(path.resolve(__dirname, "public")))

//INICIALIZACIÓN DEL SERVIDOR
server.listen(app.get("port"), () => {
    console.log("Server on port: ", app.get("port"))
})