const fs = require('fs');
const EventEmitter = require('events');
// const bf = require('buffer')
// const buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);
const buffer = new Buffer.alloc(10000000);
// const MAX_LINE = 10;


class FileWatcher extends EventEmitter{
    constructor(fileName){
        super();
        this.fileName = fileName;
        this.lastTenLines = [];
    }
    getLastTenLines(){
        return this.lastTenLines;
    }
    getUpdates(curr,prev){
       const fetch = this;
       fs.open(this.fileName,(err,fd)=>{
        if(err) throw err;
        let wholeFile = '';
        let fileArr = [];
        fs.read(fd,buffer,0,buffer.length,prev.size,(err,bytesRead)=>{
            if(err) throw err;
            if(bytesRead>0){
                wholeFile = buffer.slice(0,bytesRead).toString();
                fileArr = wholeFile.split("\n").slice(1);
                // if(fileArr.length>=MAX_LINE){
                //     fileArr.slice(-10).forEach((elem)=>{
                //         this.lastTenLines.push(elem);
                //     })
                // }else{
                //     fileArr.forEach((elem)=>{
                //         if(this.lastTenLines.length==MAX_LINE){
                //             this.lastTenLines.shift;
                //         }
                //         this.lastTenLines.push(elem);
                //     })
                // }
                fetch.emit("process",fileArr);
            }
        })
    })

    }
    firstRead(){
       const fetch = this;
        fs.open(this.fileName,(err,fd)=>{
            if(err) throw err;
            let wholeFile = '';
            let fileArr = [];
            fs.read(fd,buffer,0,buffer.length,0,(err,bytesRead)=>{
                if(err) throw err;
                if(bytesRead>0){
                    wholeFile = buffer.slice(0,bytesRead).toString();
                    fileArr = wholeFile.split("\n");
                    this.lastTenLines = [];
                    fileArr.slice(-10).forEach((elem)=>{
                        this.lastTenLines.push(elem);
                    })
                    
                }
                fs.close(fd);
            })
            fs.watchFile(this.fileName,{"interval":1000},(curr,prev)=>{
                fetch.getUpdates(curr,prev);
            })
        })
    }
}

module.exports = FileWatcher;