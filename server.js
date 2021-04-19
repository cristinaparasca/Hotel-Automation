if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}
const express = require("express");
const cors = require("cors");
const db = require("./index");
const app=express();

const corsOptions={
    origin:true
}
app.use('/img',express.static('public/img'))
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const data=require("./config/hardcoded.js");
db.sequelize.sync({force: true})
.then(()=>{
  data.HardcodedDb();
});
//handle production
//app.use(express.static(__dirname+ '/public/'))
//app.use(express.static(dirname + '/public/'))

//app.use("/.*/", (req, res) => res.sendFile(dirname + '/public/index.html'));
//app.use("/available-rooms", (req, res) => res.sendFile(__dirname + '/public/available-rooms.html'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
app.get("/", (req, res) => { res.json({ message: "Hello world!" });});
require('./routes/user.routes.js')(app);
require('./routes/room.routes.js')(app);
require('./routes/reservation.routes')(app);
  
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}.`);
});