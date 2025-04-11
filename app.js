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
    .then((list) => { res.status(200).send(list) })
    .catch((error) => { console.log(error) })
});
/**
 * Get a tasklist
 * http://localhost:3000/tasklist/tasklistId => {tasklist}, etc]
 */
app.get("/tasklist/:tasklistId", (req, res) => {
  let tasklistId = req.params.tasklistId;
  taskList.find({ _id: tasklistId })
    .then((list) => { res.status(200).send(list) })
    .catch((error) => { console.log(error) })
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
      return res.status(404).send({ message: 'Document not found' });
    }

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Get all task list
 * http://localhost:3000/tasklist => {title:"some title"}
 */
app.post("/tasklist", (req, res) => {
  let tasklistObj = { "title": req.body.title };
  taskList(tasklistObj)
    .save()
    .then((list) => { res.status(201).send(list); console.log('tasklist saved') })
    .catch((error) => { console.log(error) })
});
//
// TASK
//
/**
* Get all tasks from a taskList
* http://localhost:3000//tasklist/:id/tasks => [{task},{task}, etc]
*/
function validateTasks(req,res){
  if (!req.body.title || req.body.title.length==0) {
    return res.status(400).json({ message: 'Title is required and cannot be empty in the request body' });
  }
  if (req.body.priority || req.body.title.priority==0) {
    return res.status(400).json({ message: 'Priority is required in the body parameter' });
  }
  if ("low,high,medium".indexOf(req.body.priority)==-1) {
    return res.status(400).json({ message: 'Priority is invalid, it should be either low,high or medium' });
  } 
  if (req.body.status && "pending,completed,in_progress".indexOf(req.body.status)==-1) {
    return res.status(400).json({ message: 'Status is invalid, it should be either pending,completed or in_progress' });
  } 
  if (!req.body.taskListId) {
    return res.status(400).json({ message: 'TaskListId is required in the request url' });
  }
}
app.get("/tasklist/:id/tasks", (req, res) => {
  task.find({ taskListId: req.params.id })
    .then((tasks) => { res.status(200).send(tasks) })
    .catch((error) => { console.log(error) })
});

/**
 * Save a task
 * http://localhost:3000/tasklist/:id/tasks => {title:"some title"}
 */
app.post("/tasklist/:id/tasks", (req, res) => {
  validateTasks()
 // create the insert object
  let taskObj = {
    "title": req.body.title, "date": new Date(),
    "taskListId": req.params.id, /** get id from url */
    "priority": (req.body.priority)? req.body.priority:"low", 
    "status": (req.body.status)? req.body.status:"pending",
  };
  task(taskObj)
    .save()
    .then((item) => { res.status(201).send(item); console.log('task saved') })
    .catch((error) => { 
      console.log(error);
      res.status(500).json({status:"Error",message:`failed to insert task.${error}`});  })
});
/**
 * Get a task from a Tasklist
 * http://localhost:3000//tasklist/:tasklistId/tasks/:taskid => {tasklist}, etc]
 */ 
app.get("/tasklist/:tasklistId/tasks/:taskid", (req, res) => {
 
  task.find({tasklistid:req.params.tlId,_id:req.params.taskid,})
      .then((list) => {res.status(200).send(list)})
      .catch((error) => { console.log(error)})
});
/**
 * Update a task in  a Tasklist
 * http://localhost:3000/tasklist/pdate => {json body including id}
 */
app.put('/tasklist/:tasklistId/tasks/:taskid', async (req, res) => {
  validateTasks(req,res)
  let taskid = req.params.taskid;
  if (!taskid) {
    return res.status(400).json({ message: 'TaskID is required in the url parameter' });
  }

  try {
    const updatedDocument = await task.findOneAndUpdate(
      {tasklistid:req.params.tlId,_id:req.params.taskid}, {
      $set:req.body,
        new: true, // Return the updated document
      runValidators: true, // Run Mongoose validators
    });

    if (!updatedDocument) {
      return res.status(404).send({ message: 'Document not found' });
    }

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * Delete a task
 * http://localhost:3000/tasklist/:tasklistId/tasks/:taskid => {id:"some id"}
 */
// Delete route
app.delete('/tasklist/:tasklistId/tasks/:taskid', async (req, res) => {
  
  if (!req.params.taskid) {
    return res.status(400).json({ error: 'Task ID is required in the request url.' });
  }

  if (!req.params.tasklistId) {
    return res.status(400).json({ error: 'TaskList ID is required in the request url.' });
  }
  try {
    const result = await task.findOneAndDelete({taskListId:req.params.tasklistId,_id:req.params.taskid},);

    if (!result) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.status(200).json({ message: 'Item successfully deleted.' , item:result});
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'An error occurred while deleting the item.' });
  }
});
//
// LISTEN
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
