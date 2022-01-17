//FOR LIVE SERVER CAPROVER Uncomment it
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://srv-captain--windspeedmonitor-database/mydatabase?authSource=admin",
    {
      user: "windspeedmonitordatabase",
      pass: "%windsp%eedmo#nit$or6da&tabase",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error Connecting to Database");
    console.log(err);
  });

// mongoose
//   .connect(
//     "mongodb+srv://rehan:rehan@cluster0.qhfay.mongodb.net/prject08smartsm?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Connected To MongoDB");
//   })
//   .catch((error) => {
//     console.log("Error while connecting to Database");
//     console.log(error.message);
//   });
