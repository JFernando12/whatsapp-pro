var socket = io();

//DOM Elements
let message = document.getElementById("message");
let username = document.getElementById("username");
let btn = document.getElementById('send');
let output = document.getElementById("output");
let actions = document.getElementById("actions");

btn.addEventListener("click", sendMessage)

function sendMessage() {
    if (message.value) {
        const msg = {
            message: message.value,
            number: username.value
        };
        socket.emit("message:local", msg);
        message.value = " ";
    }
}

socket.on("message:noLocal", msg => {
    output.innerHTML += `<p>${msg}</p>`;
})

socket.on("message:local", msg => {
    output.innerHTML += `<p>MyUser: ${msg}</p>`
})