require("dotenv").config();
const app = require("./src/app");
const {createServer} = require("http")
const connectToDB = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");

const httpServer = createServer(app);



connectToDB();
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost: ${PORT}`);
});
