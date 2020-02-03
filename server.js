const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();
let db;

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
    db.collection('users').find().toArray(function (err,docs) {
        if (err) {
            console.log(err);
         return res.sendStatus(500);
        }
        res.send(docs)
    })
})

app.get('/users/:id', function (req, res) {
    db.collection('users').findOne({ _id : ObjectID(req.params.id ) }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc)
    })
})

app.post('/users', function (req, res) {
    var user = {
        email: req.body.email
    };
    console.log(db.collection('users'));
    db.collection('users').insert(user, function (err, result) {
        if (err){
            console.log(err);
         return res.sendStatus(500);
        }
        res.send(user);
    })
    /*res.send(user);*/
})

app.put('/users/:id', function (req,res) {
    db.collection('users').update(
        { _id: ObjectID(req.params.id) },
        { email: req.body.email },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});

app.delete('/users/:id',function (req,res) {
    db.collection('users').deleteOne(
        { _id: ObjectID(req.params.id) },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
        )
})

MongoClient.connect('mongodb+srv://Admin:123456qwerty@cluster0-baetd.mongodb.net', function (err,database) {
            if (err) {
                return console.log(err);
            }
    db = database.db('messenger');
    app.listen(9000, function () {
        console.log("We did it!");
    })
})