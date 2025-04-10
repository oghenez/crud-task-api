const express = require("express");
const app = express();
const PORT = 3000;
const mongooose = require("./database/mongoose");
const taskList = require("./database/models/taskList.js");
const task = require("./database/models/task.js");
/** 
 * CORS - Cross Origin Request Security
 * Backend - http://localhost:3000
 * Frontend - http://localhost:4000
 */
app.use((req, res, next) => {
       // Website you wish to allow to connect
       res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
       // Request methods you wish to allow
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
       // Request headers you wish to allow
       res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
       // Set to true if you need the website to include cookies in the requests sent
       res.setHeader('Access-Control-Allow-Credentials', true);
       // Pass to next layer of middleware
       next();
});
app.use(express.json());
// ROUTES
/**
 * Get all task list
 * http://localhost:3000/tasklist => [{tasklist},{tasklist}, etc]
 */ 
app.get("/tasklist", (req, res) => {
    taskList.find({})
        .then((list) => {res.status(200).send(list)})
        .catch((error) => { console.log(error)})
});
/**
 * Get a tasklist
 * http://localhost:3000/tasklist/tasklistId => {tasklist}, etc]
 */ 
app.get("/tasklist/:tasklistId", (req, res) => {
    let tasklistId=req.params.tasklistId;
    taskList.find({_id:tasklistId})
        .then((list) => {res.status(200).send(list)})
        .catch((error) => { console.log(error)})
});
/**
 * Delete a tasklist
 * http://localhost:3000/tasklist/delete => {id:"some id"}
 */ 
// Delete route
app.delete('/tasklist', async (req, res) => {
    const itemId = req.body.id;
  
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required in the request body.' });
    }
  
    try {
      const result = await taskList.findByIdAndDelete(itemId);
  
      if (!result) {
        return res.status(404).json({ error: 'Item not found.' });
      }
  
      res.status(200).json({ message: 'Item successfully deleted.' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'An error occurred while deleting the item.' });
    }
  });
/**
 * Update a tasklist
 * http://localhost:3000/tasklist/pdate => {json body including id}
 */ 
app.put('/tasklist', async (req, res) => {
    const { id, ...updateData } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'ID is required in the request body' });
    }
  
    try {
      const updatedDocument = await taskList.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators
      });
  
      if (!updatedDocument) {
        return res.status(404).send({message:'Document not found'});
      }
  
      res.status(200).json(updatedDocument);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
// app.put("/tasklist", (req, res) => {
//    // let tasklistObj = {"title":req.body.title};
//     taskList.findOneAndUpdate({_id:req.params.tasklistId})
//     .then((list) => {res.status(201).send(list)})
//     .catch((error) => { console.log(error)})
// });
/**
 * Get all task list
 * http://localhost:3000/tasklist => {title:"some title"}
 */ 
app.post("/tasklist", (req, res) => {
    let tasklistObj = {"title":req.body.title};
    taskList(tasklistObj)
    .save()
    .then((list) => {res.status(201).send(list);console.log('tasklist saved')})
    .catch((error) => { console.log(error)})
});

// LISTEN
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
