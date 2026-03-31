import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  images: [{
    url: String,
    alt: String,
    publicId: String
  }],
  buttons: [{
    text: String,
    link: String,
    style: String
  }],
  trustIndicators: {
    avatarCount: {
      type: Number,
      default: 4
    },
    text: {
      type: String,
      default: '500+ Students Graduated'
    }
  },
  badge: {
    number: {
      type: Number,
      default: 15
    },
    suffix: {
      type: String,
      default: '+'
    },
    label: {
      type: String,
      default: 'Years Teaching'
    }
  },
  features: [{
    type: mongoose.Schema.Types.Mixed
  }],
  stats: [{
    number: {
      type: Number,
      default: 0
    },
    suffix: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }],
  items: [{
    type: mongoose.Schema.Types.Mixed
  }],
  // Location section fields
  areas: [{
    type: mongoose.Schema.Types.Mixed
  }],
  visitLabel: {
    type: String,
    default: ''
  },
  mapEmbedUrl: {
    type: String,
    default: ''
  },
  address: {
    street: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  phone: {
    type: String,
    default: ''
  },
  tollFree: {
    type: String,
    default: ''
  },
  // Contact info fields
  contactEmail: {
    type: String,
    default: ''
  },
  contactName: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  // Fields for legal pages (privacy-policy, terms-of-service)
  subtitle: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sections: [sectionSchema],
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }
}, {
  timestamps: true
});

// Method to get a specific section
pageSchema.methods.getSection = function(sectionId) {
  return this.sections.find(section => section.sectionId === sectionId);
};

// Method to update a specific section
pageSchema.methods.updateSection = function(sectionId, data) {
  const sectionIndex = this.sections.findIndex(
    section => section.sectionId === sectionId
  );

  if (sectionIndex > -1) {
    // Update existing section
    Object.assign(this.sections[sectionIndex], data);
  } else {
    // Add new section
    this.sections.push({ sectionId, ...data });
  }

  this.metadata.lastUpdated = new Date();
  return this;
};

// Static method to find page by pageId
pageSchema.statics.findByPageId = function(pageId) {
  return this.findOne({ pageId });
};

const Page = mongoose.model('Page', pageSchema);

export default Page;