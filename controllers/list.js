var fs = require("fs");
var path = require('path');

var parseHocon = require("hoconjs/build/hoconjs");

exports.list = function(req,res){
    var file =req.params.file;

    var filePath = path.join('./config/',file + ".conf" );
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            data = data.replace(/\'/g, "\\\'");
            var obj = parseHocon(data);
            console.log(obj);
            res.send(JSON.stringify(obj))
        } else {
            console.log(err);
            res.send("")
        }
    });


}

