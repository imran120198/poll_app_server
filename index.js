const express = require("express");
const database = require("./Models/index");
const { PollRouter } = require("./Routes/Polls.routes");
const { userRouter } = require("./Routes/User.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Polling Server");
});

app.use("/polls", PollRouter);
app.use("/user", userRouter);

database.sequelize.sync().then(() => {
  app.listen(8000, () => {
    console.log("Server is running at 8000");
  });
});
