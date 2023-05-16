const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const users = [];
const requiredPlayers = 5;

const getDummyUser = (i) => {
  const multiplyer = getRandomFloat(1, 10);
  const points = getRandomInt(1, 1000);
  return { name: `CPU_${i}`, isReady: true, isDummy: true, multiplyer, points };
};

const fillDummyUsers = () => {
  for (let i = 0; i < requiredPlayers; i++) {
    users.push(getDummyUser(i));
  }
};
fillDummyUsers();

io.on("connection", (socket) => {
  if (users.some((item) => item.isDummy)) {
    users.push({
      id: socket.id,
      name: socket.handshake.query.username,
      isReady: false,
    });
    users.splice(
      users.findIndex((item) => item.isDummy),
      1
    );
    io.emit("users_updated", { players: users });
  }
  console.log(`User ${socket.id} is connected`);

  socket.on("disconnect", () => {
    const index = users.findIndex((item) => item.id == socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      users.push(getDummyUser(index));
      io.emit("users_updated", { players: users });
      console.log(`User ${socket.id} is disconnected`);
    }
    if (!users.some(item=>!item.isDummy)) {
      users.splice(0, users.length);
      fillDummyUsers();
    }
  });

  socket.on("update_username", (data) => {
    users.map((item,index) => {
      if (item.id == socket.id) {
        users[index] = {
          ...users[index],
          name: data.username
        }
    }});

    io.emit("users_updated", { players: users });
  });

  socket.on("message", (data) => {
    io.emit("recieve_message", data);
  });

  socket.on("start_game", (data) => {
    users.map((user, index) => {
      if (user.id === socket.id) {
        users[index] = {
          ...user,
          ...data,
          isReady: true,
        };
      }
    });

    const allReady = users.every((user) => user.isReady);

    if (allReady) {
      const guessNumber = getRandomFloat(1, 10);
      let delta = 10;
      let index = 0;
      users.map((item, i) => {
        const guessDelta = Math.abs(item.multiplyer - guessNumber);
        if (guessDelta < delta) {
          delta = guessDelta;
          index = i;
        }
      });

      users[index]["isWinner"] = true;
      io.emit("game_started", { players: users, guessNumber });
    } else {
      io.emit("waiting_for_players");
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running");
});
