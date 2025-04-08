const express= require("express");
const app = express();
const PORT = 3000; 
const mongooose = require("./database/mongoose");

app.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
})
