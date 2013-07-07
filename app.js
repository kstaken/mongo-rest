var express = require('express'),
    http = require('http'),
    mongoose = require('mongoose');
    
var app = express()
var server = http.createServer(app)

var resource = require("./resource.js");
var Resource = resource.Resource

var port = process.env.PORT || 8080;
//console.log("HTTP server will listen on port: " + port);
var nodeUser = "nobody";
var nodeGroup = "nogroup";

app.configure(function() {
    //app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
})

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));

    mongoose.connect(resource.datasources['development']);
    server.listen(port);
    console.log('Running in development mode');
    
    process.setgid(nodeGroup);
    process.setuid(nodeUser);
})

app.configure('test', function() {
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));

    mongoose.connect(resource.datasources['test']);
    server.listen(port);
    console.log('Running in test mode');
})

app.get('/api/v1/' + resource.rest_path, function(req, res, next) {
    Resource.find({}, function(err, docs) {
        res.send(docs);
    });
});

app.post('/api/v1/' + resource.rest_path, function(req, res, next) {
    var resource = new Resource(req.body);
    resource.save(function(err) {
        if (!err) {
            res.json(resource)            
        }
        else {
            res.send(err, 422)
        }
        res.end();
    });
});

app.get('/api/v1/' +  resource.rest_path + '/:id', function(req, res, next) {
    Resource.findById(req.params.id, function(err, doc) {
        if (!err) {
            res.json(doc);
        }
        else {
            res.send(err, 404)    
        }
    });
})

app.put('/api/v1/' + resource.rest_path + '/:id', function(req, res, next) {
    Resource.update({_id: req.params.id}, req.body, {upsert: true}, function(err, doc) {        
        if (!err) {
            Resource.findById(req.params.id, function(err, doc) {        
                if (!err) {
                    res.json(doc);            
                } else {
                    res.send(err, 404);
                }
            })                
        } else {                
            res.send(err, 404);
        }        
    });
});

app.delete('/api/v1/' + resource.rest_path + '/:id', function(req, res, next) {    
    Resource.findById(req.params.id, function(err, doc) {        
        if (!err && doc != null) {
            doc.remove(function(err, count) {            
                if (!err) {
                    res.send(200)                    
                } else {                
                    res.send(err, 500)    
                }         
            });    
        } else {                
            res.send(err, 404)    
        }        
    });
});
