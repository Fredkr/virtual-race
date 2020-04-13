import mongoose from 'mongoose';

const URL = 'mongodb://localhost:27017/virtualrace';
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

export default function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        const db = mongoose.connection;

        db.on('error', function (err) {
            console.log('Failed to connect to database');
            reject();
        });

        db.once('open', function () {
            console.log("Connected to database");
            resolve();
        });
    });
};
