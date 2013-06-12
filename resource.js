var mongoose = require('mongoose');

module.exports.rest_path = "resources"; 
module.exports.datasources = {
    "production": 'mongodb://localhost/resources',
    "development": 'mongodb://localhost/resources_development',
    "test": 'mongodb://localhost/resources_test'
}

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Resource = new Schema({
    title: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});

module.exports.Resource = mongoose.model('Resource', Resource);

