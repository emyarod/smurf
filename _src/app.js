import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import Remarkable from 'remarkable';
import { scrape } from './routes/smurfs';
import routes from './routes/index';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// POST gets urlencoded bodies
app.post('/', (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const filePath = `${__dirname}/status.md`;
  const input = req.body.input;

  fs.writeFile(filePath, input, (err) => {
    if (err) throw err;
    const md = new Remarkable();

    scrape().then((value) => {
      const marked = md.render(value);
      if (!marked.indexOf('<table>')) {
        res.render('index', { output: `<table class="table table-hover">${marked.slice(7)}` });
      } else {
        res.render('index', { output: marked });
      }
    });
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
