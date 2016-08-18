'use strict';

// simple express server
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import Remarkable from 'remarkable';
import { scrape } from './routes/smurfs';
import routes from './routes/index';

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.use(express.static(`${__dirname}/public`));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// POST gets urlencoded bodies
app.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const filePath = `${__dirname}/../status.md`;
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

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
