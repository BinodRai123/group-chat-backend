require("dotenv").config();
const app = require("./src/app");
const {createServer} = require("http")
const connectToDB = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");

const httpServer = createServer(app);



connectToDB();
initSocketServer(httpServer);

httpServer.listen(3000,'0.0.0.0', () => {
  console.log("Server running on http://localhost:3000");
});
