import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'editor'],
    default: 'editor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

// Create admin function
const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('Please add MONGODB_URI to your .env file:');
      console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get admin details from env or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@careed.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = 'System Admin';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', adminEmail);
      console.log('Updating password...');

      existingAdmin.password = adminPassword;
      existingAdmin.role = 'super_admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();

      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      const admin = await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: 'super_admin',
        isActive: true
      });

      console.log('✅ Admin created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:   ', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role:    ', 'super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 You can now login to the admin panel!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 11000) {
      console.log('An admin with this email already exists.');
    }

    process.exit(1);
  }
};

// Run
createAdmin();