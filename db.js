var mongoose = require('mongoose');
mongoose.connect('mongodb://kma-test:root@mongodb-818-0.cloudclusters.net/kma-test?authSource=admin');
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection  error:', err.message);
});
db.once('open', function callback() {
    console.log("Connected  to  DB!");
});

var StudentSchema = new mongoose.Schema({
    age: Number,
    name: String,
});

var Student = mongoose.model('nikobikchen', StudentSchema);

for (var i = 0; i < 10; ++i) {
    var s = new Student({
        age: 10 + i,
        name: "Ivan Ivanov" + " number " + i,
    });
    s.save(function (err, movie_db) {
        if (!err) {
            console.log(movie_db._id);
        }
    });
}

exports.getAll = function (callback) {
    Student.find({}, function (err, data) {
        callback(err, data);
    });
};