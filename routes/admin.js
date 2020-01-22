const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/category')
const category = mongoose.model('categories')
require('../models/post')
const post = mongoose.model('posts')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/categories', (req, res) => {
    category.find().sort({ date: 'desc' }).then((categories) => {
        res.render('admin/categories', { categories: categories })
    }).catch((err) => {
        req.flash('error_msg', 'There was an error listing the categories')
        res.redirect('/admin')
    })

})
router.get('/categories/add', (req, res) => {
    res.render('admin/addcategories')
})
router.post('/categories/new', (req, res) => {
    var error = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ text: 'invalid name' })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({ text: 'invalid slug' })
    }
    if (req.body.name.length < 2) {
        error.push({ text: 'small name' })
    }
    if (error.length > 0) {
        res.render('admin/addcategories', { error: error })
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new category(newCategory).save().then(() => {
            req.flash('success_msg', 'succesfully created category')
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('error_msg', 'there was an error saving category, please try again')
            res.redirect('/admin')
        })
    }
})

router.get('/categories/edit/:id', (req, res) => {
    category.findOne({ _id: req.params.id }).then((category) => {
        res.render('admin/editcategories', { category: category })
    }).catch((err) => {
        req.flash('error_msg', 'This category does not exists')
        res.redirect('/admin/categories')
    })
})

router.post('/categories/edit', (req, res) => {
    category.findOne({ _id: req.body.id }).then((category) => {
        category.name = req.body.name
        category.slug = req.body.slug

        category.save().then(() => {
            req.flash('success_msg', 'successfully edited category')
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('error_msg', 'there was an internal error saving category edit ')
            res.redirect('/admin/categories')
        })

    }).catch((err) => {
        req.flash('error_msg', 'there as an error editing category')

    })
})

router.post('/categories/delete', (req, res) => {
    category.findOneAndRemove({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'category successfully deleted')
        res.redirect('/admin/categories')
    }).catch((err) => {
        req.flash('error_msg', 'there was an error deleting the category')
        res.redirect('/admin/categories')
    })
})

router.get('/posts', (req, res) => {
    post.find()
        .populate('category')
        .sort({ date: 'desc' })
        .then((posts) => {
            res.render('admin/posts', { posts: posts })
        }).catch((err) => {
            req.flash('error_msg', 'there was an error listing the posts')
            res.redirect('/admin')
        })
})

router.get('/posts/add', (req, res) => {
    category.find().then((categories) => {
        res.render('admin/addpost', { categories: categories })
    }).catch((err) => {
        req.flash('error_msg', 'there was an error loading the form')
        res.redirect('/admin')
    })
})

router.post('/posts/new', (req, res) => {
    var error = []

    if (req.body.category == '0') {
        error.push({ text: "invalid category, register a category!" })
    }
    if (error.length > 0) {
        res.render('admin/addpost', { error: error })
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new post(newPost).save().then(() => {
            req.flash('success_msg', 'post created successfully')
            res.redirect('/admin/posts')
        }).catch((err) => {
            req.flash('error_msg', 'there was an error saving the post')
            res.redirect('/admin/posts')
        })
    }
})

router.get('/posts/edit/:id', (req, res) => {
    post.findOne({ _id: req.params.id }).then((post) => {
        category.find().then((categories) => {
            res.render('admin/editposts', { categories: categories, post: post })
        }).catch((err) => {
            req.flash('error_msg', 'there was an error listing the categories')
            res.redirect('/admin/posts')
        })
    }).catch((err) => {
        req.flash('error_msg', 'there was an error loadind edit form')
        res.redirect('/admin/posts')
    })
})

router.post('/post/edit', (req, res) => {
    post.findOne({ _id: req.body.id }).then((post) => {
        post.title = req.body.title
        post.slug = req.body.slug
        post.description = req.body.description
        post.content = req.body.content
        
        post.save().then(()=>{
            req.flash('success_msg','Post edited successfully')
            res.redirect('/admin/posts')
        }).catch((err)=>{
            req.flash('error_msg','There was an error editing the post')
            res.redirect('/admin/posts')
        })

    }).catch((err) => {
        // console.log(err) Depurar erro
        req.flash('error_msg', 'there was an error saving the edit')
        res.redirect('/admin/posts')
    })
})

module.exports = router