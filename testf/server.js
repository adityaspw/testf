const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path'); 
const FileWatcher = require('./index');


app.get('/',(req,res)=>{
    res.send("Home page");
})
app.get('/logs',(req,res)=>{
    var options = {
        root: path.join(__dirname)
    };
     
    // var fileName = 'index.html';
    // res.sendFile(fileName, options, function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', fileName);
    //     }
    // });
    res.sendFile('index.html',options);
})

const fetch = new FileWatcher("test.txt");
fetch.firstRead();

io.on('connection',(socket)=>{
    fetch.on("process",(data)=>{
        console.log("update");
        socket.emit("update",data);
    })
    let data = fetch.getLastTenLines();
    console.log(data);
    socket.emit("start",data);
})

const port = process.env.Port || 8080;
http.listen(port, function(){
    console.log('listening on localhost');
});
