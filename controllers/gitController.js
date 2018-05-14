const USER = '';
const PASS = '';
const REPO = 'github.com/Ylinor/Configuration';

var fs = require("fs");

const git = require('simple-git/promise');
const remote = `https://${USER}:${PASS}@${REPO}`;

const serverdir = "../forger-server-1.12/config";

var path = require('path');

exports.notify = function (req,res) {

    git(serverdir).checkIsRepo()
        .then(isRepo => !isRepo && initialiseRepo(git))
        .then(() => pull(serverdir).then(()=>console.log("pull finish"))
            .catch((error)=> console.log(error)));

};
exports.edit = function (req,res) {

    git("./config").checkIsRepo()
        .then(isRepo => !isRepo && initialiseRepo(git,"./config"))
        .then(()=> pull("./config"))
        .catch((error)=>  console.log(error));
  res.sendFile(path.resolve("views/storyteller.html"))
};
exports.sendfile = function(req,res){
    var file =req.params.file;
    var content = req.body;
    var buffer = new Buffer(JSON.stringify(content));
    var filePath = path.join('./config/',file + ".conf" );
    fs.open(filePath, 'w', function(err, fd) {
        if (err) {
            throw 'error opening file: ' + err;
        }

        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd, function () {
                console.log('file written');
                commit("./config",`update ${file}`,file + ".conf" )
                    .then(push("./config")
                        .then(()=> res.send("ok"))
                        .catch((error)=>res.send(error)));
            })
        });
    })


};
function commit(dir,message,files){
   return git(dir).commit(message,files)
}

function push(dir) {
   return git(dir).silent(true)
        .push('origin','master')
}
function pull(dir) {
  return  git(dir).silent(true)
        .pull('origin','master')

}
function initialiseRepo (git,dir) {
    return git(dir).init()
        .then(() => git(dir).addRemote('origin', remote))


}