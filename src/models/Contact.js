import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
    default: 'Contact Form Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  inquiryType: {
    type: String,
    enum: ['general', 'programs', 'services', 'careers', 'partnership', 'other'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social', 'other'],
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ inquiryType: 1 });

// Static method to get counts by status
contactSchema.statics.getCountsByStatus = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;