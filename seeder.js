const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
// const Bootcamp = require("./models/Bootcamp");
// const Course = require("./models/Course");

// const Review = require("./models/Review");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Products");
// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, "utf-8")
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, "utf-8")
);
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
// );

// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
// );
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
// );

// Import into DB
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    await User.create(users);
    await Category.create(categories);

    await Product.create(products);
    // await Review.create(reviews);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // await Bootcamp.deleteMany();
    // await Course.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    // await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
//node seeder -i
if (process.argv[2] === "-i") {
  importData();
  //node seeder -d
} else if (process.argv[2] === "-d") {
  deleteData();
}
