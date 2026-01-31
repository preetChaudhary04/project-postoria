const app = require("./src/app");
const connectDb = require("./src/db/db");
require("dotenv").config();

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`listening to port...`);
});
