var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var parser = require('xml2js');

var bodyParser = require('body-parser')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rootpwd135!',
  database : 'pjt01'
});

connection.connect();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static('public'));


app.get('/home', function(req, res) {
    res.render('home');
})

app.get('/signup', function(req,res) {
    res.render('signup');
})

app.listen(3000)