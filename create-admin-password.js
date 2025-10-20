const bcrypt = require('bcryptjs');

async function createPassword() {
  const password = 'Bithrah@2024';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
}

createPassword();
