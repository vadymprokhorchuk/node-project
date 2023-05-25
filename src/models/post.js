const mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const postSchema = new mongoose.Schema({
    postId: { type: Number, unique: true, required: true },
    header: String,
    text: String,
    user: String
});

postSchema.plugin(autoIncrement, {
    model: 'Post',
    field: 'postId',
    startAt: 1,
    incrementBy: 1
});

const Post = mongoose.model('Post', postSchema);

module.exports = {Post, postSchema}