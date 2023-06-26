const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGOOSE_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log("Database connected");
  })
  .catch((err) => {
    console.log({ err: err });
  });

// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     // console.log("Database connected");
//   } catch (error) {
//     console.error("Database connection error:", error);
//   }
// };

// module.exports = connectToDatabase;
