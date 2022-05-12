const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


app.use(require("cookie-parser")("secret"));
app.use(require("express-session")({ cookie: { maxAge: null } }));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      username: function () {
        const user = JSON.parse(localStorage.getItem("user"));
        return user["username"];
      },
    },
  })
);


app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));


//For all clients connect



const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


