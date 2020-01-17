const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/category')
const category = mongoose.model('categories')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Posts page')
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
        }).catch((err)=>{
            req.flash('error_msg', 'there was an internal error saving category edit ')
            res.redirect('/admin/categories')
        })

    }).catch((err) => {
        req.flash('error_msg', 'there as an error editing category')

    })
})

router.post('/categories/delete',(req,res)=>{
    category.findOneAndRemove({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'category successfully deleted')
        res.redirect('/admin/categories')
    }).catch((err)=>{
        req.flash('error_msg', 'there was an error deleting the category')
        res.redirect('/admin/categories')
    })
})

module.exports = router