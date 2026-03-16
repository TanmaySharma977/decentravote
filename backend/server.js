require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;

async function seedAdmin() {
  try {
    const exists = await User.findOne({ role: 'admin' });
    if (!exists) {
      await User.create({
        name: 'Admin',
        email: 'admin@decentravote.com',
        password: 'Admin@123',
        role: 'admin',
        status: 'approved',
      });
      console.log('✅ Default admin created');
    }
  } catch (err) {
    console.error('⚠️ seedAdmin error:', err.message);
  }
}

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
});