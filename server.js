require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;
const port = process.env.PORT;
const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

const app = express();
let db;
let refreshTokens = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/users',(req, res) =>{
    db.collection('users').find().toArray((err,docs) => {
        if (err) {
            console.log(err);
         return res.sendStatus(500);
        }
        res.send(docs)
    })
});

app.get('/users/:id', (req, res) => {
    db.collection('users').findOne({ _id : ObjectID(req.params.id ) }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc)
    })
});

app.post('/users', (req, res) => {
    let user = {
        email: req.body.email
    };
    db.collection('users').insert(user, (err, result) => {
        if (err){
            console.log(err);
         return res.sendStatus(500);
        }
        res.send(user);
    })
});

app.put('/users/:id', (req,res) => {
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

app.delete('/users/:id', (req,res) => {
    db.collection('users').deleteOne(
        { _id: ObjectID(req.params.id) },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        })
});

// Refresh by token
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        console.log(user);
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.username })
        res.json({ accessToken: accessToken })
    })
});

app.post('/login', (req, res) => {
    const username = req.body.name;
    const user = { email: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

function authentificateToken (req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    })
}

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

client.connect((err,database) => {
    if (err) {
        return console.log(err);
    }
    db = database.db('messenger');
    app.listen(port, () => {
        console.log(`Server is listening on port: ${9000}`);
    })
});
