function getConfiguredAdminToken() {
  return process.env.ADMIN_TOKEN || process.env.ADMIN_SECRET || 'admin-secret';
}

function requireAdmin(req, res, next) {
  const expectedToken = getConfiguredAdminToken();
  const token = req.headers['x-admin-token'] || req.headers['authorization'];
  if (!expectedToken) {
    return next();
  }
  if (!token) {
    return res.status(401).json({ message: 'Admin token dibutuhkan.' });
  }
  const sanitizedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  if (sanitizedToken !== expectedToken) {
    return res.status(403).json({ message: 'Token admin tidak valid.' });
  }
  return next();
}

module.exports = {
  requireAdmin,
  getConfiguredAdminToken
};
