"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var pg = require("pg");
var Sequelize = require("sequelize");
var Restful = require('new-sequelize-restful');
var cors = require('cors');

var connection = new Sequelize('carservice2', 'postgres', 'password',//db-name, owner in db, password in db
    {
        host: 'localhost',
        dialect: 'postgres'
        //logging: true
    });

connection.authenticate().then(function(){
    console.log('connect to db');
}).catch(function(err){
    console.log('connection error '+ err);
});
var app = express();

app.use('/', express.static(__dirname));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(cors());
app.all(/\/api\//, (new Restful(connection)).route());
app.get("/", function(req, res){
    res.sendFile('index.html', {root: __dirname});
    console.log('strawberry banana and hello')
})


//model auth
var Auth = connection.define('authentic', {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    role: Sequelize.STRING,
    idUser: Sequelize.STRING
});
Auth.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});
//model client
var Client = connection.define('clients', {
    name: Sequelize.STRING,
    cars: Sequelize.ARRAY(Sequelize.TEXT),
    logo: Sequelize.STRING
});
Client.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});
//model master
var Master = connection.define('masters', {
    "companyName": Sequelize.STRING,
    "mechanics": Sequelize.BOOLEAN,
    "mounting": Sequelize.BOOLEAN,
    "carWash": Sequelize.BOOLEAN,
    "towTruck": Sequelize.BOOLEAN,
    "chosenPlace": Sequelize.JSON(Sequelize.TEXT),
    "house": Sequelize.STRING,
    "companyTelephone": Sequelize.STRING,
    "startTime": Sequelize.STRING,
    "lastTime": Sequelize.STRING,
    "managerName": Sequelize.STRING,
    "managerTelephone": Sequelize.STRING,
    "directorName": Sequelize.STRING,
    "cars": Sequelize.ARRAY(Sequelize.TEXT),
    "services": Sequelize.ARRAY(Sequelize.TEXT),
    "logo": Sequelize.STRING,
    "categories": Sequelize.JSON(Sequelize.TEXT),
    "rate": Sequelize.FLOAT
});
Master.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});
//model comments
var Comment = connection.define("comments", {
    "comment": Sequelize.TEXT,
    "userName": Sequelize.STRING,
    "userId": Sequelize.STRING,
    "date": Sequelize.DATE,
    "masterId": Sequelize.STRING,
    "masterName": Sequelize.STRING,
    "rate": Sequelize.STRING
});
Comment.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});

//model tenders
var Tender = connection.define("tenders", {
    "idUser": Sequelize.STRING,
    "userName": Sequelize.STRING,
    "chosenPlace": Sequelize.JSON(Sequelize.TEXT),
    "bicycle": Sequelize.BOOLEAN,
    "passCar": Sequelize.BOOLEAN,
    "lorry": Sequelize.BOOLEAN,
    "bus": Sequelize.BOOLEAN,
    "moped": Sequelize.BOOLEAN,
    "car": Sequelize.STRING,
    "service": Sequelize.STRING,
    "sum": Sequelize.STRING,
    "date": Sequelize.DATE,
    "comment": Sequelize.STRING
});
Tender.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});
//model commentsTender
var CommentsTender = connection.define("commentstender", {
    "comment": Sequelize.TEXT,
    "masterName":Sequelize.STRING,
    "masterId": Sequelize.STRING,
    "date": Sequelize.DATE,
    "idTender": Sequelize.STRING
});
CommentsTender.sync().then(function(){
    console.log('Success');
}).catch(function(err){
    console.log('success error '+ err);
});
app.post('/getcomments', function(req, res){
    //console.log(req.body.id);
    Comment.findAll({where: {
        masterId: req.body.id
    }}).then(function(comment){
        res.json(comment);
    })
});

app.post('/commentstenders', function(req,res){
    CommentsTender.findAll({where: {
        idTender: req.body.id
    }}).then(function(comment){
        res.json(comment);
    })
});

app.post('/getclientbyid', function(req, res){
    Auth.findAll({where: {
        idUser: req.body.id,
        role: req.body.role
    }}).then(function(result){
        res.json(result);
    })

});


app.post('/getmechanicsbyall', function(req, res){
    var car = req.body.cars;
    var service = req.body.services;
    var address = req.body.chosenPlace;
    var category = req.body.categories;
   // var key = Master.getDataValue(category);
    Master.findAll({where: {
        cars: {$contains :car},
        services: {$contains :service},
        "chosenPlace.FormattedAddress": {$like :"%" + address.FormattedAddress},
        "categories": {
            [category]: "true"
    },
        mechanics: req.body.mechanics
    }}).then(function(result){
        res.json(result);
    })
});

app.post('/getmountingbyall', function(req, res){
    var car = req.body.cars;
    var service = req.body.services;
    var address = req.body.chosenPlace;
    var category = req.body.categories;
    // var key = Master.getDataValue(category);
    Master.findAll({where: {
        cars: {$contains :car},
        services: {$contains :service},
        "chosenPlace.FormattedAddress": {$like :"%" + address.FormattedAddress},
        "categories": {
            [category]: "true"
        },
        mounting: req.body.mounting
    }}).then(function(result){
        res.json(result);
    })
});

app.post('/getcarwashbyall', function(req, res){
    var car = req.body.cars;
    var service = req.body.services;
    var address = req.body.chosenPlace;
    var category = req.body.categories;
    // var key = Master.getDataValue(category);
    Master.findAll({where: {
        cars: {$contains :car},
        services: {$contains :service},
        "chosenPlace.FormattedAddress": {$like :"%" + address.FormattedAddress},
        "categories": {
            [category]: "true"
        },
        carWash: req.body.carWash
    }}).then(function(result){
        res.json(result);
    })
});

app.post('/gettowtruckbyall', function(req, res){
    var car = req.body.cars;
    var service = req.body.services;
    var address = req.body.chosenPlace;
    var category = req.body.categories;
    // var key = Master.getDataValue(category);
    Master.findAll({where: {
        cars: {$contains :car},
        services: {$contains :service},
        "chosenPlace.FormattedAddress": {$like :"%" + address.FormattedAddress},
        "categories": {
            [category]: "true"
        },
        towTruck: req.body.towTruck
    }}).then(function(result){
        res.json(result);
    })
})

app.post('/getrate', function(req, res){
    Master.update({
            rate: req.body.rate
        },{where:
        {id : req.body.id }
        }).then(function(result){
            res.json(result);
        })
})
//app.post('/getmastersbycars', function(req, res){
//    var car = req.body.cars;
//    Master.findAll({where: {
//        cars: {$contains :car},
//        mechanics: req.body.mechanics
//    }}).then(function(result){
//        res.json(result);
//    })
//
//})
//app.post('/getmastersbyservice', function(req, res){
//    var service = req.body.services;
//    Master.findAll({where: {
//        services: {$contains :service},
//        mechanics: req.body.mechanics
//    }}).then(function(result){
//        res.json(result);
//    })
//
//})

app.listen(process.env.PORT||5000, function(){
    console.log("listen on server 5000");
})