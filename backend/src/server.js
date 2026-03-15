require('dotenv').config();
const app  = require('./src/app');
const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;

async function seedAdmin() {
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    await User.create({
      name: 'Admin',
      email: 'admin@decentravote.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'approved',
    });
    console.log('✅ Default admin created (admin@decentravote.com / Admin@123)');
  }
}

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});