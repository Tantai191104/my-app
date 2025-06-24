require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
// import routee
var playersRouter = require("./routes/playerRoute");
const authRouter = require("./routes/auth");
const memberRouter = require("./routes/memberRoute");
const commentRouter = require("./routes/commentRoutes");
const adminRouter = require("./routes/adminRouter");
const { getAllPlayer } = require("./controller/playerController");
var app = express();
const mongoose = require("mongoose");
// view engine setup
const Uri = process.env.MONGO_URI;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const methodOverride = require("method-override");
const accountRouter = require("./routes/accountRoute");
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// error favicon.ico
app.get("/favicon.ico", (req, res) => res.status(204).end());

// express session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// set locals res for render
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// export routes
app.get("/", getAllPlayer);
app.use("/accounts", accountRouter);
app.use("/players", playersRouter);
app.use("/teams", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/member", memberRouter);
app.use("/comments", commentRouter);
// connect mongodb
mongoose.connect(Uri).then((db) => {
  console.log("Connect OK !");
});

// set layout
app.set("layout", "layout");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
