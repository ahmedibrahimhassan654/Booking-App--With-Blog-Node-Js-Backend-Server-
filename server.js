const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

//Route files
// const bootcamps = require("./routes/bootcamps");
// const courses = require("./routes/courses");

// const reviews = require("./routes/reviews");
const auth = require("./routes/auth");
const users = require("./routes/users");
const categories = require("./routes/categories");
const products = require("./routes/products");
const photo = require("./routes/cloudinary");
const items = require("./routes/items");
const bookingItems = require("./routes/bookingItems");
const blogCat = require("./routes/Blog Routes/blogCat");
const blogPost = require("./routes/Blog Routes/postRoutes");

const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // File uploading
// app.use(fileupload({ useTempFiles: true }));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/categories", categories);
app.use("/api/v1/products", products);
app.use("/api/v1/photo", photo);
app.use("/api/v1/item", items);
app.use("/api/v1/booking", bookingItems);
app.use("/api/v1/blogCat", blogCat);
app.use("/api/v1/post", blogPost);

// app.use("/api/v1/courses", courses);
// app.use("/api/v1/reviews", reviews);

app.use(errorHandler);
//404 error
app.use("*", (req, res) => {
  console.log(req.originalUrl);
  res.status(404).json({
    message: `${req.originalUrl} - Route Not Found`,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
