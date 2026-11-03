require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const connectDB = require('./config/db');
const { attachCurrentUser } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

connectDB();

// View engine (server-rendered pages)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing + static assets
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session-based auth (express-session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Flash messages for bid / auction notifications (connect-flash)
app.use(flash());
app.use(attachCurrentUser);

// Routes
app.get('/', (req, res) => res.redirect('/items'));
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

// 404 + error handlers
app.use((req, res) => res.status(404).render('404', { title: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('404', { title: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auction platform running on http://localhost:${PORT}`));
