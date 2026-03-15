const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/decentravote');

  const collection = mongoose.connection.collection('users');
  await collection.deleteOne({ email: 'admin@decentravote.com' });

  const hash = await bcrypt.hash('Admin@123', 10);
  await collection.insertOne({
    name: 'Admin',
    email: 'admin@decentravote.com',
    password: hash,
    role: 'admin',
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Admin created!');
  console.log('   Email:    admin@decentravote.com');
  console.log('   Password: Admin@123');
  await mongoose.disconnect();
}

createAdmin().catch(console.error);