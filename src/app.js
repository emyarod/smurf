'use strict';

// simple express server
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import Remarkable from 'remarkable';
import cheerio from 'cheerio';
import htmlmin from 'htmlmin';
import { scrape } from './routes/smurfs';

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(`${__dirname}/public`));
app.get('/', (req, res) => {
  res.sendfile('./public/index.html');
});

// POST gets urlencoded bodies
app.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const filePath = `${__dirname}/../status.md`;
  const input = req.body.input;
  const html = fs.readFileSync(`${__dirname}/public/index.html`, 'utf8');
  const $ = cheerio.load(html);

  fs.writeFile(filePath, input, (err) => {
    if (err) throw err;
    const md = new Remarkable();

    scrape().then((value) => {
      const scriptNode = `
        <script>
          const outputDiv = document.getElementById('output');
          outputDiv.innerHTML = '${htmlmin(md.render(value))}';

          const [table] = document.getElementsByTagName('table');
          table.className = 'table';
        </script>`;
      $('body').append(scriptNode);
      // res.send(md.render(value));
      res.send($.html());
    });
  });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
