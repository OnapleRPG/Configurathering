var express = require('express');
var path = require('path');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

port = process.env.PORT || 3000;

var routes = require("./routes/configRoute");

routes(app);

var mongoose = require('mongoose');
// Ces options sont recommandées par mLab pour une connexion à la base
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

//URL de notre base
var urlmongo = "mongodb://web:naldis2*@ds151631.mlab.com:51631/configurathring";

// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});


app.use(express.static("public"));
app.listen(port);


