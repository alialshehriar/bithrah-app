const bcrypt = require('bcryptjs');

async function createHash() {
  const password = 'test123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password hash:', hash);
}

createHash();
