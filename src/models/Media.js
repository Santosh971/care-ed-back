import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    default: ''
  },
  folder: {
    type: String,
    enum: ['images', 'icons', 'logos', 'misc'],
    default: 'images'
  },
  resourceType: {
    type: String,
    enum: ['image', 'raw', 'video'],
    default: 'image'
  },
  format: {
    type: String,
    default: ''
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  size: {
    type: Number // in bytes
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries (publicId already has unique index from schema definition)
mediaSchema.index({ folder: 1 });
mediaSchema.index({ uploadedBy: 1 });

// Static method to find by folder
mediaSchema.statics.findByFolder = function(folder, options = {}) {
  const query = { folder };
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 50);
};

// Static method to search
mediaSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $or: [
      { alt: { $regex: searchTerm, $options: 'i' } },
      { filename: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 50);
};

const Media = mongoose.model('Media', mediaSchema);

export default Media;