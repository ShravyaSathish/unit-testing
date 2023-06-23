const express = require("express");
require("./config/connection");
require("dotenv").config();
const userRouter = require("./router/user");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());
app.use(userRouter);
// let server;
// if (process.env.NODE_ENV !== "test") {
//   const server = app.listen(port, () => {
//     console.log(`Server is up on port ${port}`);
//   });
// }
app.listen(port, () => {
  console.log("Server is up on port..");
});

module.exports = {
  app: app,
  closeServer: () => {
    if (server) {
      server.close();
    }
  },
};
