const mongoose = require("mongoose");

const taskSchema =  new mongoose.Schema({
    title: {type: String, trim: true, minlength:3}, 
    date: {type: Date, default: Date.now}, 
    taskListId: {type: mongoose.Types.ObjectId, required: true},
   // user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
    priority: {type: String, enum: ['low', 'medium', 'high'], default:"low"},
    status: {type: String, enum: ['pending', 'in_progress', 'done'], default:"pending"}
});

const task = mongoose.model("task", taskSchema);

module.exports = task;