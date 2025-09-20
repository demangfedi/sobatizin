const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const installService = require('./installService');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const requireInstallToken = (req, res, next) => {
  const expectedToken = process.env.INSTALL_API_KEY;
  if (!expectedToken) {
    return next();
  }

  const providedToken = req.headers['x-install-token'] || req.query.install_token;
  if (providedToken !== expectedToken) {
    return res.status(401).json({ message: 'Token instalasi tidak valid.' });
  }

  return next();
};

router.use(helmet({
  contentSecurityPolicy: false,
}));
router.use('/install', limiter);

router.get('/install/status', (req, res) => {
  const status = installService.getInstallationStatus();
  res.json(status);
});

router.get('/install/prerequisites', async (req, res, next) => {
  try {
    const checks = await installService.getPrerequisites();
    res.json({ checks });
  } catch (error) {
    next(error);
  }
});

router.post('/install', requireInstallToken, async (req, res, next) => {
  try {
    const status = await installService.performInstallation(req.body);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.use((error, req, res, next) => {
  const statusCode = error.status || 400;
  res.status(statusCode).json({ message: error.message || 'Terjadi kesalahan pada server instalasi.' });
});

module.exports = router;
