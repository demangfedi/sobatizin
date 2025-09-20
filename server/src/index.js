const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { getConfiguredAdminToken } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    adminAuthConfigured: Boolean(getConfiguredAdminToken())
  });
});

app.use(routes);

const port = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Sobat Izin API listening on port ${port}`);
  });
}

module.exports = app;
