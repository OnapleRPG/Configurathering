'use strict';
var git = require("../controllers/gitController");
var list = require("../controllers/list");
var storyController = require("../controllers/storyController");

var url = require("url");
module.exports = function(app) {
    app.route("/git/notify").post(git.notify);
    app.route("/storyteller").get(storyController.display).post(storyController.insert);
    app.route("/storyteller/list").get(storyController.list);
    app.route('/list/:file').get(list.list);
    app.route("/git/sendfile/:file").post(git.sendfile);
};
