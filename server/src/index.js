const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Install service listening on port ${port}`);
  });
}

module.exports = app;
