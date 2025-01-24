const mongoose  = require('mongoose');

function createDb(){
    mongoose.connect('mongodb://127.0.0.1:27017/enovetion-DB')
       .then(() => console.log('Connected to MongoDB'))
       .catch((err) => console.error('Could not connect to MongoDB', err));
}
createDb()

module.exports = createDb;