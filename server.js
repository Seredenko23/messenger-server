var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var users = [
    {
        id: 1,
        email: 'user1@gmail.com'
    },
    {
        id: 2,
        email: 'user2@gmail.com'
    },
    {
        id: 3,
        email: 'user3@gmail.com'
    },

];

app.get('/', function (req, res) {
    res.send('Hello API');
})

app.get('/users', function(req, res){
    res.send(users)
})

app.get('/users/:id', function (req, res) {
    console.log(req.params);
    var user = users.find(function (user) {
        return user.id === Number(req.params.id)
    });
    res.send(user)
})

app.post('/users', function (req, res) {
    var user = {
        email: req.body.email
    };
    db.collection('users').insert(user, function (err, result) {
        if (err){
            console.log(err);
            res.sendStatus(500);
        }
        res.send(user);
    })
    /*res.send(user);*/
})

app.put('/users/:id',function (req,res) {
    var user = users.find(function (user) {
        return user.id === Number(req.params.id)
    });
    user.email = req.body.email;
    res.sendStatus(200);
})

app.delete('/users/:id',function (req,res) {
    users = users.filter(function (user) {
        return user.id !== Number(req.params.id);
    })
    res.sendStatus(200);
})

MongoClient.connect('mongodb+srv://Admin:123456qwerty@cluster0-baetd.mongodb.net', function (err,database) {
    if (err) {
        return console.log(err);    
    }
    db = database.db('messenger');
    console.log(database)
    app.listen(9000, function () {
        console.log("We did it!");
    })
})