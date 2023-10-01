const mongoose = require("mongoose")

const connectDB = (url) => {
    return mongoose.connect(url)
        .then(() => console.log('Connected Database successfully'))
        .catch((err) => console.log(err))
}

module.exports = connectDB