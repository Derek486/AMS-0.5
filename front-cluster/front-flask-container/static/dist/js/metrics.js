var socket = io();
const currentUrl = window.location.href;
const token = localStorage.getItem('token') || currentUrl.split('/').pop();

socket.on('toggle_data', (msg) => {
  const message = JSON.parse(msg)
  const input = document.getElementById(`:r${message.motorId}:${message.type}`)
  input.checked = message.isSending
})

socket.on("disconnect", () => {
  socket.emit("disconnect_token", token)
});


function toggleSending(e, motorId, type) {
  const isSending = e.target.checked
  socket.emit('send_data', JSON.stringify({ motorId, type, isSending }))
}