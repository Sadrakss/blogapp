if (process.env.NODE_ENV == 'production') {
module.exports = {mongoURI:'mongodb+srv://teste:teste@cluster0-yjb6q.mongodb.net/blogapp?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI:'mongodb://localhost:27017/blogapp'}

}