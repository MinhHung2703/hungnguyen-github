require('dotenv').config()
require('express-async-errors')

// Express
const express = require('express')
const app = express()

// Rest of Package
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Database
const connectDB = require('./db/connectDB')

// routers
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoutes')
const productRoute = require('./routes/productRoutes')
const reviewRoute = require('./routes/reviewRoutes')
// Middleware
const NotFoundMiddlerware = require('./middlewares/not-found')
const errorHandleMiddlerware = require('./middlewares/error-handler')

// app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
// app.use(cors())

app.use(express.static('./public'))
app.use(fileUpload({ useTempFiles: true }))

app.get('/', (req, res) => {
    console.log(req.signedCookies);
    res.send('e-commerce-api')
});

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send('e-commerce api')
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/reviews', reviewRoute)

app.use(NotFoundMiddlerware)
app.use(errorHandleMiddlerware)

const port = process.env.PORT || 5000
const start = async () => {
    try {
        // connect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server started on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()