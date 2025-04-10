const mongoose = require("mongoose");

const taskListSchema =  new mongoose.Schema({
    title: {type: String, trim: true, minlength:3}, 
    /**
     * _taskListId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true  } 

      */ 
     });

const taskList = mongoose.model("taskList", taskListSchema);

module.exports = taskList;