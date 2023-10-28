const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()

const path = require('path')
const serveStatic = require('serve-static')

const shelflifeRoutes = require('./src/routes/shelflifeRoutes')
const shoppingListRoutes = require('./src/routes/shoppingListRoutes')
const shoppingListHistoryRoutes = require('./src/routes/shoppingListHistoryRoutes')
const authRoutes = require('./src/routes/authRoutes')
const { requireAuth } = require('./middleware/authMiddleware')
const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', (err) => {
  //console.error(`DB connection error: ${err.message}`)
})

// Middleware
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())




app.use(serveStatic(path.join(__dirname, '../frontend/dist')))

// Set the Content-Type header for .jsx files
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'application/javascript')
  }
  next()
})




// Routes
app.use('/shelflife',requireAuth, shelflifeRoutes)
app.use('/shoppingList',requireAuth, shoppingListRoutes)
app.use('/shoppingHistory',requireAuth, shoppingListHistoryRoutes)

// Authentication
app.use('/', authRoutes)

// Start the server
app.listen(port, () => {
  //console.log(`Server running on port ${port}`)
})
