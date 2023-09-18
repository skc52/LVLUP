const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const errorMiddleWare = require("./middleware/error.js")
const Journal = require("./models/journalModel");
const fileUpload = require("express-fileupload")

const app = express();


app.use(cookieParser());
app.use(express.json({limit:"50mb"}));
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
    })
  );

// WHY CORS?? TODO
app.use(cors());


// Create text index on title field of Journal collection
Journal.createIndexes({ title: "text" });

// ROUTE IMPORTS
const user = require("./routers/userRoutes");
const post = require("./routers/postRoutes");
const comment =  require("./routers/commentRoutes");
const notification =  require("./routers/notificationRoutes");
const journal = require("./routers/journalRoutes");
const challenge = require("./routers/challengeRoutes");
const message = require("./routers/messagesRoutes");




app.use("/api/v1", user);
app.use("/api/v1", post);
app.use("/api/v1", comment);
app.use("/api/v1", notification);
app.use("/api/v1", journal);
app.use("/api/v1", challenge);
app.use("/api/v1", message);

//Error middleware
app.use(errorMiddleWare);



module.exports = app;