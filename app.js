import express from "express";
import session from "express-session"
import passport from "passport";
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import methodOverride from "method-override";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.APP_PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session({}));
app.use(methodOverride('_method'))

// S-T-A-R-T: EXTERNAL FUNCTIONS

const renderPage = (res, pageName, additionalParams = {}) => {
  const defaultParams = { currentPage: pageName };
  const mergedParams = { ...defaultParams, ...additionalParams };
  res.render(pageName, mergedParams);
};

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// E-N-D: EXTERNAL FUNCTIONS

app.get("/", (_req, res) => renderPage(res, "index"));
app.get("/login", (_req, res) => renderPage(res, "login"));
app.get("/signup", (_req, res) => renderPage(res, "signup"));
app.get("/chat", checkAuth, (_req, res) => renderPage(res, "chat"));
app.get("/about-us", (_req, res) => renderPage(res, "about-us"));

app.get('*', (_req, res) => {
  res.status(404);
  renderPage(res, "utils/404");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
