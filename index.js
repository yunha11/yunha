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

app.get('/callback', function(req, res) {
  var auth_code = req.query.code //인증완료 후 뜨는 창 http://localhost:3000/callback?code 뒷부분이 담김
  
  var getTokenUrl = "https://testapi.open-platform.or.kr/oauth/2.0/token"
  //명세서 그대로 입력
  var option = {
      method : "POST",
      url : getTokenUrl,
      headers : {
         "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
      },
      form : {
        code : auth_code,
        client_id : "l7xx6f194aab88fe48f68772afe4554d71a0",
        client_secret : "3802e66aa6eb4ac19659e15d51dff0cd",
        redirect_uri : "http://localhost:3000/callback",
        grant_type : "authorization_code"
      }
  }
  request(option, function(err, res, body){
    if(err) throw err;
    else {
      console.log(body);
    }
  })


  console.log(auth_code);

})

app.listen(3000)