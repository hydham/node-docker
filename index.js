const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
let { RedisStore } = require("connect-redis");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");

let redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});
redisClient.connect().catch(console.error);

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/admin`;

const connectDbWithRetries = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("DB connection successful"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectDbWithRetries, 5000);
    });
};

connectDbWithRetries();

app.enable("trust proxy");

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 100000,
    },
  })
);

app.use(cors({}));
app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi there!</h2>");
  console.log("your here");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is running");
});
