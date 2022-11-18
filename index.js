import db from "./db/db.js";
import app from "./app.js";
import ContainDatabase from "./containDatabase/containDatabase.js";

const PORT = process.env.PORT || 5001;

db.then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    ContainDatabase.checkDB();
  });
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`);
});
