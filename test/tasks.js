var http = require('http');
var assert = require('assert');
var app = require('../app.js');

function createRecord(options, data, callback) {
    var req = http.request(options, function(res) {
        var body = "";
        res.on("data", function(chunk) {
            body += chunk
        });

        res.on("end", function() {
            var post = JSON.parse(body);
            var id = post['_id'];
            callback(id)    
        });                
    });

    req.write(JSON.stringify(data));
    req.end(); 
}

describe('api v1', function() {
    var data = {'title': 'test title'}
    var options = { port: 8080, path: '/api/v1/resources', method: 'POST', headers: {"content-type": "application/json"}, agent: false };
        
    describe('GET /api/v1/resources', function() {
        it('should return a 200 response', function(done) {
            http.get({path: '/api/v1/resources', port: 8080 }, function(res) {            
                assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);
                done();
            });
        });

        it ('should return JSON', function(done) {
            http.get({path: '/api/v1/resources', port: 8080, agent: false }, function(res) {
                assert.equal(res.headers["content-type"], "application/json; charset=utf-8", 
                    'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
                done();
            });
        });
    });

    
    describe('POST /api/v1/resources', function() {
        it('should return a 200 response code on success', function(done) {
            var req = http.request(options, function(res) {
                assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);
                done();
            })
            req.write(JSON.stringify(data));
            req.end();            
        });

        it('should return JSON', function(done) {
            var req = http.request(options, function(res) {
                assert.equal(res.headers["content-type"], "application/json; charset=utf-8", 
                    'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
                done();
            });
            req.write(JSON.stringify(data));
            req.end();                    
        });

        it('should return correct data', function(done) {
            var req = http.request(options, function(res) {
                var body = "";
                res.on("data", function(chunk) {
                    body += chunk
                });

                res.on("end", function() {
                    var post = JSON.parse(body);                    
                    assert.equal(post.title, data.title, 'Expected: ' + data.title + 'Actual: ' + post.title);
                    done();
                });                  
            });
            req.write(JSON.stringify(data));
            req.end();                    
        });

        it('should return a 422 response code if there is a validation error', function(done) {
            var data = {}
            var req = http.request(options, function(res) {
                assert.equal(res.statusCode, 422, 'Expected: 422 Actual: ' + res.statusCode);
                done();
            });
            req.write(JSON.stringify(data));
            req.end();            
        });
    });

    describe('GET /api/v1/resources/:id', function() {
        it('should return a 200 response code on success', function(done) {
            createRecord(options, data, function(id) {
                http.get({path: '/api/v1/resources/' + id, port: 8080, agent: false }, function(res) {            
                    assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);
                    done();
                });    
            });
        });

        it('should return JSON', function(done) {
            createRecord(options, data, function(id) {
                http.get({path: '/api/v1/resources/' + id, port: 8080, agent: false }, function(res) {            
                    assert.equal(res.headers["content-type"], "application/json; charset=utf-8", 
                        'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
                    done();
                });    
            });                
        });

        it('should return correct data', function(done) {
            createRecord(options, data, function(id) {
                http.get({path: '/api/v1/resources/' + id, port: 8080, agent: false }, function(res) {            
                    var body = "";
                    res.on("data", function(chunk) {
                        body += chunk
                    });

                    res.on("end", function() {
                        var post = JSON.parse(body);                    
                        assert.equal(post.title, data.title, 'Expected: ' + data.title + 'Actual: ' + post.title);
                        done();
                    });                                      
                });    
            });                         
        });

        it('should return a 404 response code if the resource doesnt exist', function(done) {           
            http.get({path: '/api/v1/resources/12345', port: 8080, agent: false }, function(res) {            
                assert.equal(res.statusCode, 404, 'Expected: 404 Actual: ' + res.statusCode);
                done();
            });       
        });
    });

    describe('PUT /api/v1/resources/:id', function() {
        it('should return a 200 response code on success', function(done) {            
            createRecord(options, data, function(id) {                                    
                var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'PUT', 
                    headers: {"content-type": "application/json"}, agent: false }, function(res) {            
                        assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);
                        done();
                });   
                var doc = {'title': 'put title'};
                req.write(JSON.stringify(doc));
                req.end();              
            });                
        });

        it('should return JSON', function(done) {
            createRecord(options, data, function(id) {                                    
                var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'PUT', 
                    headers: {"content-type": "application/json"}, agent: false }, function(res) {            
                        assert.equal(res.headers["content-type"], "application/json; charset=utf-8", 
                            'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
                        done();
                });   
                var doc = {'title': 'put title'};
                req.write(JSON.stringify(doc));
                req.end();  
            })
        });

        it('should return correct data', function(done) {
            createRecord(options, data, function(id) {                                    
                var doc = { 'title': 'put title' };
                var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'PUT', 
                    headers: {"content-type": "application/json"}, agent: false }, function(res) {            
                        var body = "";
                        res.on("data", function(chunk) {
                            body += chunk
                        });

                        res.on("end", function() {
                            var post = JSON.parse(body);                    
                            assert.equal(post.title, doc.title, 'Expected: ' + doc.title + ' Actual: ' + post.title);
                            done();
                        });  
                });   
     
                req.write(JSON.stringify(doc));
                req.end();  
            })
        });

        it('should return a 404 response code if the resource doesnt exist', function(done) {
            var req = http.request({ path: '/api/v1/resources/12345', port: 8080, method: 'PUT', 
                headers: {"content-type": "application/json"}, agent: false }, function(res) {  
                    assert.equal(res.statusCode, 404, 'Expected: 404 Actual: ' + res.statusCode);                                  
                    done();
            });   
            var doc = {'title': 'put title'};
            req.write(JSON.stringify(doc));
            req.end();

        }) 
    });

   describe('DELETE /api/v1/resources/:id', function() {
        it('should return a 200 response code on success', function(done) {
            createRecord(options, data, function(id) {                                    
                var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'DELETE', 
                    agent: false }, function(res) {            
                        assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);
                        done();
                }).end();                
            });
        });

        it('should no longer exist once deleted', function(done) {
            createRecord(options, data, function(id) {                                    
                var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'DELETE', 
                    agent: false }, function(res) {            
                        assert.equal(res.statusCode, 200, 'Expected: 200 Actual: ' + res.statusCode);

                    var req = http.request({ path: '/api/v1/resources/' + id, port: 8080, method: 'DELETE', 
                        agent: false }, function(res) {            
                            assert.equal(res.statusCode, 404, 'Expected: 404 Actual: ' + res.statusCode);
                            done();
                    }).end();                       
                }).end();                 
            });
        });
        
        it('should return a 404 response code if the resource doesnt exist', function(done) {            
            var req = http.request({ path: '/api/v1/resources/12345', port: 8080, method: 'DELETE', 
                agent: false }, function(res) {            
                    assert.equal(res.statusCode, 404, 'Expected: 404 Actual: ' + res.statusCode);
                    done();
            }).end();
        });
    });
});