/**
 * Run this once to generate the bcrypt hash for your admin password, then
 * paste the output into ADMIN_PASSWORD_HASH in .env.local
 *
 * Usage: node scripts/hash-password.js "your-chosen-password"
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to your .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
