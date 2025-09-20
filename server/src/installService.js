const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const storageDir = path.join(__dirname, '..', 'storage');
const storageFile = path.join(storageDir, 'install-status.json');
const templateDir = path.join(__dirname, '..', 'templates');

const ensureStorage = () => {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (!fs.existsSync(storageFile)) {
    fs.writeFileSync(storageFile, JSON.stringify({ installed: false }, null, 2), 'utf-8');
  }
};

const readStatus = () => {
  try {
    ensureStorage();
    const raw = fs.readFileSync(storageFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return { installed: false };
  }
};

const writeStatus = (status) => {
  ensureStorage();
  fs.writeFileSync(storageFile, JSON.stringify(status, null, 2));
};

const buildChecklistItem = (key, label, passed, message) => ({
  key,
  label,
  passed,
  message,
});

const checkNodeVersion = () => {
  const requiredMajor = Number(process.env.MIN_NODE_VERSION_MAJOR || 18);
  const major = Number(process.versions?.node?.split?.('.')?.[0] || 0);
  const passed = major >= requiredMajor;
  const message = passed
    ? `Node.js ${process.version} memenuhi minimal ${requiredMajor}.x`
    : `Node.js ${process.version} di bawah minimal ${requiredMajor}.x - perbarui runtime Node.js.`;

  return buildChecklistItem('node-version', 'Versi Node.js', passed, message);
};

const checkPhpVersion = () => {
  const requiredPhp = process.env.MIN_PHP_VERSION || '8.1';
  const currentPhp = process.env.CURRENT_PHP_VERSION || '8.2 (placeholder)';
  const passed = true; // placeholder
  const message = `Versi PHP saat ini ${currentPhp}. Pastikan minimal ${requiredPhp} di server produksi.`;

  return buildChecklistItem('php-version', 'Versi PHP', passed, message);
};

const resolveTemplateAvailability = () => {
  const templatePath = process.env.INSTALL_TEMPLATE_DIR || templateDir;
  const exists = fs.existsSync(templatePath);
  const message = exists
    ? 'Template aplikasi ditemukan. Wizard dapat melanjutkan proses instalasi.'
    : 'Template aplikasi tidak ditemukan. Pastikan folder template telah diunggah.';

  return buildChecklistItem('template', 'Template Aplikasi', exists, message);
};

const createConnection = async (config) => {
  return mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });
};

const checkDatabaseAccess = async (config) => {
  if (!config.host || !config.user) {
    return buildChecklistItem(
      'database-access',
      'Akses Database',
      false,
      'Konfigurasi host dan kredensial database belum lengkap.'
    );
  }

  let connection;
  try {
    connection = await createConnection(config);
    await connection.query('SELECT 1 + 1 AS result');
    return buildChecklistItem('database-access', 'Akses Database', true, 'Koneksi ke database berhasil.');
  } catch (error) {
    const message =
      error?.code === 'ENOTFOUND'
        ? 'Host database tidak dapat dijangkau.'
        : `Koneksi database gagal: ${error.message}`;
    return buildChecklistItem('database-access', 'Akses Database', false, message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getPrerequisites = async (overrides = {}) => {
  const defaultDb = {
    host: process.env.INSTALL_DB_HOST,
    port: Number(process.env.INSTALL_DB_PORT) || 3306,
    user: process.env.INSTALL_DB_ROOT_USER,
    password: process.env.INSTALL_DB_ROOT_PASSWORD,
  };

  const dbConfig = { ...defaultDb, ...overrides.database };

  const [nodeCheck, phpCheck, templateCheck, dbCheck] = await Promise.all([
    Promise.resolve(checkNodeVersion()),
    Promise.resolve(checkPhpVersion()),
    Promise.resolve(resolveTemplateAvailability()),
    checkDatabaseAccess(dbConfig),
  ]);

  return [nodeCheck, phpCheck, templateCheck, dbCheck];
};

const ensureDatabase = async (databaseConfig) => {
  const { name, user, password, masterUser, masterPassword, host, port } = databaseConfig;
  if (!masterUser || !masterPassword) {
    return {
      createdDatabase: false,
      createdUser: false,
      message: 'Kredensial master database tidak tersedia. Melewati pembuatan database otomatis.',
    };
  }

  let connection;
  try {
    connection = await createConnection({
      host,
      port,
      user: masterUser,
      password: masterPassword,
    });

    if (name) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``);
    }

    if (user) {
      await connection.query(`CREATE USER IF NOT EXISTS \`${user}\`@'%' IDENTIFIED BY ?`, [password || '']);
      await connection.query(`GRANT ALL PRIVILEGES ON \`${name}\`.* TO \`${user}\`@'%'`);
    }

    return {
      createdDatabase: Boolean(name),
      createdUser: Boolean(user),
      message: 'Database dan pengguna berhasil diverifikasi/dibuat.',
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const validatePayload = (payload) => {
  if (!payload?.site?.name) {
    throw new Error('Nama website wajib diisi.');
  }

  if (!payload?.admin?.username || !payload?.admin?.password) {
    throw new Error('Kredensial admin wajib diisi.');
  }

  if (!payload?.database?.host || !payload?.database?.name || !payload?.database?.user) {
    throw new Error('Konfigurasi database tidak lengkap.');
  }
};

const performInstallation = async (payload) => {
  validatePayload(payload);

  const prereq = await getPrerequisites(payload);
  const failed = prereq.filter((item) => !item.passed);
  if (failed.length) {
    const messages = failed.map((item) => `- ${item.label}: ${item.message}`).join('\n');
    throw new Error(`Prasyarat belum terpenuhi:\n${messages}`);
  }

  const dbAccess = await checkDatabaseAccess({
    host: payload.database.host,
    port: payload.database.port || 3306,
    user: payload.database.user,
    password: payload.database.password,
  });

  if (!dbAccess.passed) {
    throw new Error(dbAccess.message);
  }

  const creationResult = await ensureDatabase(payload.database);

  const status = {
    installed: true,
    installedAt: new Date().toISOString(),
    site: payload.site,
    admin: { username: payload.admin.username },
    database: {
      host: payload.database.host,
      name: payload.database.name,
      user: payload.database.user,
    },
    meta: creationResult,
  };

  writeStatus(status);
  return status;
};

module.exports = {
  performInstallation,
  getPrerequisites,
  getInstallationStatus: readStatus,
};
