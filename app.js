const express = require('express');
const bodyParser = require('body-parser');
const helmet  = require('helmet');

const app = express();
const port = process.env.PORT || 9000;


app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.use(helmet());

app.get('/', (req, res) => {
  res.render('index', { foo:'index' });
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  res.render('index', { foo:id });
});

app.listen(port, '', err => {
  if(err) return console.log(err);
  console.log(`Listening at http://localhost:${port}`);
});
