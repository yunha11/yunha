var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var parser = require('xml2js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rootpwd135!',
  database : 'pjt01'
});

app.use(express.urlencoded());
app.use(express.json());

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


connection.connect();

app.post('/join', function(req, res){
  var name = req.body.name;
  var password = req.body.password;
  var id = req.body.id;
  var accessToken = req.body.accessToken;
  var refreshToken = req.body.refreshToken;
  var userseqnum = req.body.userseqnum;
  var sql = "INSERT INTO pjt01.user (userid, userpassword, username, accessToken, refreshToken, userseqnum) VALUES (?,?,?,?,?,?)"
  connection.query(sql,[id, password, name, accessToken, refreshToken, userseqnum], function (error, results, fields){
    if (error) { throw error; }
    else {
      res.json(1)
    }
  });

})
app.get('/list',function(req, res){
  var accessToken = "d6329762-54a0-4e97-9d37-3c429e56a704";
    var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/transaction_list";
    var qs = 
    "?fintech_use_num=199004071057725906017893" +
    "&inquiry_type=A"+
    "&from_date=20160101"+
    "&to_date=20160101"+
    "&sort_order=A"+
    "&page_index=00001"+
    "&tran_dtime=20190307101010"

    var option = {
        method : "GET",
        url : requestURL+qs,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        var data = JSON.parse(body);
        res.json(data);
    })
})
/*
  var accessToken = "d6329762-54a0-4e97-9d37-3c429e56a704";
  //var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/transaction_list?fintech_use_num=199004071057725906017893&inquiry_type=A&from_date=20160404&to_date=20190302&sort_order=D&page_index=1&tran_dtime=20190307155647&befor_inquiry_trace_info=123&list_tran_seqno=0"
  var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/transaction_list";
  var qs = 
  "?fintech_use_num=199004071057725906017893" +
  "&inquiry_type=A" +
  "&from_date=20161001" +
  "&to_date=20161031" +
  "&sort_order=D" +
  "&page_index=00001" +
  "&tran_dtime=20190307101010" +
  "&list_tran_seqno=0000000000"

  var option = {
    method : "GET",
    url : requestURL+qs,
    headers : {
      "Authorization" : "Bearer " + accessToken
    }
  }
  request(option, function(err, response, body){
    var data = JSON.parse(body);
    res.json(data);
  })
})
*/
//잔액조회
app.get('/balance', function(req, res){
  var accessToken = "d6329762-54a0-4e97-9d37-3c429e56a704"
  var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/balance?fintech_use_num=199004071057725906017893&tran_dtime=20190307164548"
  var option = {
    method : "GET",
    url : requestURL,
    headers : {
      "Authorization" : "Bearer " + accessToken
    }
  }
  request(option, function(err, response, body){
    var data = JSON.parse(body);
    res.json(data);
    
  })
})

app.get('/user', function(req, res){
  var accessToken = "d6329762-54a0-4e97-9d37-3c429e56a704"
  var requestURL = "https://testapi.open-platform.or.kr/user/me?user_seq_no=1100034847"
  var option = {
    method : "GET",
    url : requestURL,
    headers : {
      "Authorization" : "Bearer " + accessToken
    }
  }
  request(option, function(err, response, body){
    res.send(body);
  })
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
  request(option, function(err, response, body){
    if(err) throw err;
    else {
      console.log(body);
      //평문 상태의 body를 json타입으로 바꿔줌
      var accessRequestResult = JSON.parse(body);
      res.render('resultChild', {data : accessRequestResult}); //resultChilde 페이지에 data로 넘겨줌

    }
  })


  console.log(auth_code);

})

app.listen(3000)