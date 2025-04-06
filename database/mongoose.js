const mongoose = require("mongoose");
mongoose.Promise = globalThis.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/taskmanager')
  .then(() => {
    console.log('DB Connected!')
})
  .catch((error) => {
    console.log(error)
});
module.exports = mongoose;