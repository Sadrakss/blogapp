// modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/post')
const post = mongoose.model('posts')
const category = mongoose.model('categories')
// settings
//settings - sessions
app.use(session({
    secret: 'cursonodejs',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
// settings - Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})
//settings-bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// settings - Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting - Mongoose
mongoose.connect('mongodb://localhost:27017/blogapp', {
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
app.get('/', (req, res) => {
    post.find().populate('category')
    .sort({ date: 'desc' })
    .then((posts) => {
        res.render('index', { posts: posts })
        console.log()
    }).catch((err) => {
        req.flash('error_msg', 'There was an internal error')
        res.redirect('/404')
    })
})

app.get('/post/:slug', (req, res) => {
    post.findOne({ slug: req.params.slug }).then((post) => {
        if (post) {
            res.render('post/index', { post: post })
        } else {
            req.flash('error_msg', 'This post does not exist')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'There was an internal error')
        res.redirect('/')
    })
})
app.get('/categories', (req, res) => {
    category.find().then((categories) => {
        res.render('categories/index', { categories: categories })
    }).catch((err) => {
        req.flash('error_msg', 'there was an internal error listing categories')
        res.redirect('/')
    })
})

app.get('/categories/:slug', (req, res) => {
    category.findOne({ slug: req.params.slug }).then((category) => {
        if (category) {
            post.find({ category: category._id }).then((posts) => {
                res.render('categories/posts', { posts: posts, category: category })
            }).catch((err) => {
                req.flash('error_msg', 'There was an inernal error when listing posts in this categories')
                res.redirect('/')
            })
        } else {
            req.flash('error_msg', 'this category does not exist')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', 'there was an internal error when listing posts in this category')
        res.redirect('/')
    })
})

app.get('/404', (req, res) => {
    res.send('Error 404!')
})

app.use('/admin', admin)
//others
const PORT = 8081
app.listen(PORT, () => {
    console.log('Running server on port 8081!')
})