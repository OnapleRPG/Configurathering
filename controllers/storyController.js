var path = require("path");
var DialogueSchema = require("../schema/dialogueShema");
exports.display = function (req, res) {
    res.sendFile(path.resolve("views/storyteller.html"));
};
exports.list = function (req, res) {
    DialogueSchema.Dialogue.find(function (err, piscines) {
        if (err) {
            res.send(err);
        }
        res.json(piscines)
    })
};
exports.insert = function (req, res) {
    console.log(req.body);
    res.send("ok")
}
