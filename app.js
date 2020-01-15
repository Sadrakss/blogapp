// modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
// settings
//settings-bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// settings - Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting - Mongoose
mongoose.connect('mongodb://localhost:27017/blogapp',{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log('connection error!' + err)
})

//public
app.use(express.static(path.join(__dirname, 'public')))
// Middlewares
// app.use((req,res,next)=>{
//     console.log('I am a middleware')
//     next()
// })

// routes
app.use('/admin', admin)
//others
const PORT = 8081
app.listen(PORT, () => {
    console.log('Running server on port 8081!')
})