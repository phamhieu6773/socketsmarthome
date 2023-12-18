const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mqtt = require("mqtt");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  const client = mqtt.connect("mqtt://broker.hivemq.com");
  client.on("connect", function () {
    console.log("Client subscribed ");
    client.subscribe("nhomSmartHome/#");
    client.on("message", function (topic, message) {
      if (topic === "nhomSmartHome/quat") {
        console.log("topic ", topic);
        socket.emit("receive_fan", message.toString());
      }
      if (topic === "nhomSmartHome/den") {
        console.log("topic ", topic);
        socket.emit("receive_led", message.toString());
      }
      if (topic === "nhomSmartHome/quatTocDo") {
        console.log("topic ", topic);
        socket.emit("receive_fanSpeed", message.toString());
      }

      if (topic === "nhomSmartHome/denDoSang") {
        console.log("topic ", topic);
        socket.emit("receive_ledChange", message.toString());
      }
      if (topic === "nhomSmartHome/baoChay") {
        console.log("topic ", topic);
        socket.emit("receive_fire", message.toString());
      }
      if (topic === "nhomSmartHome/mayBom") {
        console.log("topic ", topic);
        socket.emit("receive_pump", message.toString());
      }
      if (topic === "nhomSmartHome/khiGa") {
        console.log("topic ", topic);
        socket.emit("receive_gas", message.toString());
      }
      // socket.emit("receive_message", message.toString());
    });
    // client.on("message", function (topic, message) {
    //   socket.emit("receive_fan", message.toString());
    // })
    socket.on("send_fan", (data) => {
      console.log("send_fan", data);
      client.publish("nhomSmartHome/quat", data);
    });
    socket.on("send_led", (data) => {
      console.log("send_led", data);
      client.publish("nhomSmartHome/den", data);
    });
    socket.on("send_fanSpeed", (data) => {
      console.log("send_fanSpeed", data);
      client.publish("nhomSmartHome/quatTocDo", data);
    });

    socket.on("send_ledChange", (data) => {
      console.log("send_ledChange", data);
      client.publish("nhomSmartHome/denDoSang", data);
    });
    socket.on("send_rgbChange", (data) => {
      console.log("send_rgbChange", data);
      client.publish("nhomSmartHome/rgb", data);
    });
    socket.on("send_pump", (data) => {
      console.log("send_pump", data);
      client.publish("nhomSmartHome/mayBom", data);
    });
    socket.on("send_message", (data) => {
      console.log("send_message", data);
      // client.unsubscribe("Shirish");
      client.publish("Shirish", data);
    });
  });

  //   socket.on("join_room", (data) => {
  //     console.log("join_room", data);
  //     socket.join(data);
  //   });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
