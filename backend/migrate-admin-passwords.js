// migrate-admin-passwords.js
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const res = await pool.query('SELECT id, username, password FROM adminlar');
    for (const row of res.rows) {
      const pass = row.password || '';
      const looksLikeBcrypt = pass.startsWith('$2a$') || pass.startsWith('$2b$') || pass.startsWith('$2y$');
      if (!looksLikeBcrypt) {
        const hashed = await bcrypt.hash(pass, 10);
        await pool.query('UPDATE adminlar SET password=$1 WHERE id=$2', [hashed, row.id]);
        console.log(`Migrated admin id=${row.id} (${row.username})`);
      } else {
        console.log(`Already hashed admin id=${row.id} (${row.username})`);
      }
    }
    console.log('Migration completed.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
})();
