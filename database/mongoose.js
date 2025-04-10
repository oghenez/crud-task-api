const mongoose = require("mongoose");
mongoose.Promise = globalThis.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/taskmanager',{
   useUnifiedTopology: true})
  .then(() => {
    console.log('DB Connected!')
})
  .catch((error) => {
    console.log(`Error connection to DB: ${error}`)
});
module.exports = mongoose;