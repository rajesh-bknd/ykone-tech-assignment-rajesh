const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
if (process.env.NODE_ENV === "dev") {
    mongoose.set('debug', {color: true})
}

mongoose.connection.on('error', (err) => {
    console.log(`Mongo connect error ${err}`)
    process.exit(-1);
});
let connection = null

exports.connect = () => {
    if (connection === null) {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(result => {
            // console.log(result)
            console.log(`Connected to mongo database`)
        })
        connection = mongoose.connection
    } else {
        return connection
    }
}