require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var ObjectId = require('mongoose').Types.ObjectId;

let bookSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'missing required field title'] },
    commentcount: { type: Number, default: 0 },
    comments: [String]
}, { versionKey: false });

let Book = mongoose.model(`books`, bookSchema);

const createAndSaveBook = async (bookObject) => {
    try {
        const newBook = new Book(bookObject);
        let response = await newBook.save();
        return { _id: response._id, title: response.title };
    } catch (error) {

        if (error.name === "ValidationError") {
            for (field in error.errors) {
                return { error: error.errors[field].message }
            }
        }

        return error;
    }
};

const getBooks = async (filter = {}) => {
    try {
        let response = await Book.find(filter);

        if (response.length <= 0) {
            return { error: 'no book exists' }
        }

        return response;
    } catch (error) {
        return error;
    }
};

const removeById = async (id) => {
    if (!id) {
        return { error: 'no book exists' };
    }
    try {
        let found = await Book.findById(id);
        if (!found) {
            return { error: 'no book exists' };
        }
        let response = await Book.findByIdAndRemove(id);
        return 'delete successful';
    } catch (error) {
        return { error: 'could not delete' }
    }
};

const removeAll = async () => {
    try {
        let found = await Book.find({});
        if (found.length <= 0) {
            return { error: 'no book exists' };
        }
        let response = await Book.deleteMany({});
        return 'complete delete successful'
    } catch (error) {
        return { error: 'could not delete' }
    }
};

const addComment = async (id, comment) => {

    if (!comment) {
        return { error: 'missing required field comment' }
    }

    try {
        let found = await Book.findById(id);
        if (!found) {
            return { error: 'no book exists' };
        }

        found.comments.push(comment)
        found.commentcount = (found.comments.length)
        let response = await found.save();
        return response;
    } catch (error) {
        return error;
    }
}

exports.Book = Book;
exports.createAndSaveBook = createAndSaveBook;
exports.getBooks = getBooks;
exports.removeById = removeById;
exports.removeAll = removeAll;
exports.addComment = addComment;