require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require("cookie-parser")
const app = express()

const {checkUser} = require('./middleware/authentication')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const commentRouter = require('./routes/comment')
const tagsRouter = require('./routes/tags')
// database connect
const connectDB = require('./db/connect')
// tinymce editor static files
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// public static files
app.use(express.static(path.join(__dirname, 'public')))
// Pug init
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
// Express json parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Routers Middleware
app.use('*', checkUser)
// Routers
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)
app.use('/tags', tagsRouter)

app.all('*', (req, res) => {
  res.render('error', {
    message: "The content you were looking for was not found.",
  })
})

// Server
const port = process.env.PORT || 3000;
const runDatabase = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

runDatabase()