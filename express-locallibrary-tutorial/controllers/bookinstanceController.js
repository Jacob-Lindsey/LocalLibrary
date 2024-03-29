const { body, validationResult } = require('express-validator');
var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');

exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec(function(err, list_bookinstances) {
            if (err) {
                return next(err);
            }
            res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
        });
};

exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function(err, bookinstance) {
            if (err) {
                return next(err);
            }
            if (bookinstance==null) {
                var err = new Error('Book copy not found');
            }
            res.render('bookinstance_detail', { title: 'Copy: ' +bookinstance.book.title, bookinstance: bookinstance });
        })
};

exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title')
        .exec(function (err, books) {
            if (err) {
                return next(err);
            }
            res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
        });
};

exports.bookinstance_create_post = [
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        var bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            });
        
        if (!errors.isEmpty()) {
            Book.find({}, 'title')
                .exec(function(err, books) {
                    if (err) {
                        return next(arr);
                    }
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), booksinstance: bookinstance });
                });
                return;
        } else {
            bookinstance.save(function(err) {
                if (err) {
                    return next(arr);
                }
                res.redirect(bookinstance.url);
            });
        }
    }
];

exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET')
};

exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST')
};

exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET')
};

exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST')
};