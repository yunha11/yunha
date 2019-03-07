var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'rootpwd135!',
    database : 'pjt01'
});

connection.connect();

connection.query('SELECT * FROM pjt01.user', function( error, result, fields){
    if (error) throw error;
    console.log(result);
});

connection.end();