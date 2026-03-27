import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Page from '../models/Page.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@careed.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    // Create admin
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: 'System Admin',
      role: 'super_admin',
      isActive: true
    });

    console.log('Admin user created:', admin.email);
    return admin;
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
};

// Home page sections
const homePageSections = [
  {
    sectionId: 'hero',
    title: 'Care-Ed Learning Center',
    subtitle: 'Excellence in Healthcare Education',
    description: 'Professional healthcare training programs designed to prepare you for a rewarding career in caregiving. Join thousands of successful graduates serving communities across New Brunswick.',
    content: {
      ctaPrimary: { text: 'Explore Programs', link: '/care-ed' },
      ctaSecondary: { text: 'Contact Us', link: '/contact' }
    },
    images: [{ url: '/src/assets/images/home.jpg', alt: 'Healthcare training facility' }],
    isActive: true,
    order: 1
  },
  {
    sectionId: 'programs',
    title: 'Our Programs',
    subtitle: 'Comprehensive Healthcare Training',
    description: 'Discover our range of professional healthcare programs',
    items: [
      {
        id: 'psw',
        title: 'Personal Support Worker',
        description: 'Comprehensive training for a rewarding career in personal care',
        icon: 'Heart',
        link: '/care-ed'
      },
      {
        id: 'first-aid',
        title: 'First Aid & CPR',
        description: 'Essential life-saving skills and certification',
        icon: 'Shield',
        link: '/care-ed'
      },
      {
        id: 'foot-care',
        title: 'Foot Care Management',
        description: 'Specialized training in professional foot care',
        icon: 'Activity',
        link: '/services'
      },
      {
        id: 'workshops',
        title: 'Professional Workshops',
        description: 'Continuing education and skill development',
        icon: 'GraduationCap',
        link: '/care-ed'
      }
    ],
    isActive: true,
    order: 2
  },
  {
    sectionId: 'stats',
    title: 'Our Impact',
    items: [
      { label: 'Years Experience', value: 15, suffix: '+' },
      { label: 'Licensed Programs', value: 100, suffix: '%' },
      { label: 'Graduates', value: 500, suffix: '+' },
      { label: 'Placement Rate', value: 95, suffix: '%' }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'features',
    title: 'Why Choose Care-Ed',
    subtitle: 'Your Success is Our Priority',
    items: [
      {
        title: 'Quality Education',
        description: 'Our curriculum meets all provincial standards',
        icon: 'Award'
      },
      {
        title: 'Student-Focused',
        description: 'Small class sizes ensure personalized attention',
        icon: 'Users'
      },
      {
        title: 'Community-Oriented',
        description: 'Strong ties to local healthcare providers',
        icon: 'Heart'
      },
      {
        title: 'Excellence',
        description: 'Proven track record of graduate success',
        icon: 'Star'
      }
    ],
    isActive: true,
    order: 4
  },
  {
    sectionId: 'testimonials',
    title: 'What Our Students Say',
    items: [
      {
        name: 'Sarah M.',
        role: 'PSW Graduate',
        content: 'Care-Ed gave me the skills and confidence to start my career. The instructors were incredibly supportive.',
        rating: 5
      },
      {
        name: 'John D.',
        role: 'First Aid Instructor',
        content: 'The hands-on training prepared me perfectly for real-world situations.',
        rating: 5
      },
      {
        name: 'Maria L.',
        role: 'Healthcare Professional',
        content: 'Best decision I ever made was enrolling at Care-Ed. Highly recommend!',
        rating: 5
      }
    ],
    isActive: true,
    order: 5
  },
  {
    sectionId: 'cta',
    title: 'Ready to Start Your Healthcare Career?',
    description: 'Join our next cohort and begin your journey towards a rewarding career in healthcare.',
    buttons: [
      { text: 'Apply Now', link: '/care-ed', style: 'primary' },
      { text: 'Contact Us', link: '/contact', style: 'secondary' }
    ],
    isActive: true,
    order: 6
  }
];

// About page sections
const aboutPageSections = [
  {
    sectionId: 'hero',
    title: 'About Care-Ed',
    subtitle: 'Excellence in Healthcare Education Since 1987',
    images: [{ url: '/src/assets/images/about.jpg', alt: 'Care-Ed team' }],
    isActive: true,
    order: 1
  },
  {
    sectionId: 'mission',
    title: 'Our Mission',
    description: 'To provide high-quality healthcare education that empowers individuals to serve their communities with compassion and professionalism.',
    content: {
      vision: 'To be the leading healthcare education provider in New Brunswick, recognized for excellence in training and graduate outcomes.'
    },
    isActive: true,
    order: 2
  },
  {
    sectionId: 'timeline',
    title: 'Our Journey',
    items: [
      { year: '1987', title: 'Founded', description: 'Care-Ed Learning Center established in Saint John' },
      { year: '1995', title: 'Expansion', description: 'Added PSW certification programs' },
      { year: '2005', title: 'Accreditation', description: 'Received provincial accreditation' },
      { year: '2015', title: 'Growth', description: 'Expanded to multiple training locations' },
      { year: '2024', title: 'Today', description: 'Leading healthcare education provider' }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'leadership',
    title: 'Our Leadership Team',
    items: [
      {
        name: 'Jean E. Porter Mowatt',
        role: 'President & CEO',
        image: '/src/assets/images/president.png',
        bio: 'With over 30 years of healthcare education experience...'
      },
      {
        name: 'Sharon A. O\'Brien',
        role: 'Chief Learning Officer',
        image: '/src/assets/images/clo.png',
        bio: 'Specialized in curriculum development...'
      }
    ],
    isActive: true,
    order: 4
  },
  {
    sectionId: 'values',
    title: 'Our Values',
    items: [
      { title: 'Quality Education', icon: 'BookOpen', description: 'Meeting the highest standards' },
      { title: 'Student-Focused', icon: 'Users', description: 'Your success is our priority' },
      { title: 'Community-Oriented', icon: 'Heart', description: 'Serving New Brunswick' },
      { title: 'Excellence', icon: 'Award', description: 'Striving for the best' }
    ],
    isActive: true,
    order: 5
  }
];

// Services page sections
const servicesPageSections = [
  {
    sectionId: 'hero',
    title: 'Our Services',
    subtitle: 'Comprehensive Healthcare Services',
    description: 'From personal care to specialized programs, we offer a full range of services to meet your needs.',
    isActive: true,
    order: 1
  },
  {
    sectionId: 'services',
    title: 'Home Care Services',
    items: [
      {
        id: 'home-care',
        title: 'Home Care Services',
        description: 'Personalized care in the comfort of your home',
        icon: 'Home',
        link: '/services/home-care',
        features: ['Personal care', 'Meal preparation', 'Light housekeeping']
      },
      {
        id: 'foot-care',
        title: 'Foot Care Services',
        description: 'Professional foot care for health and comfort',
        icon: 'Activity',
        link: '/services/foot-care',
        features: ['Nail care', 'Callus treatment', 'Diabetic foot care']
      },
      {
        id: 'personal-support',
        title: 'Personal Support',
        description: 'Assistance with daily activities',
        icon: 'User',
        link: '/services/personal-support',
        features: ['Bathing assistance', 'Mobility support', 'Companionship']
      },
      {
        id: 'emergency',
        title: 'Emergency Response',
        description: '24/7 emergency care services',
        icon: 'Phone',
        link: '/services/emergency-response',
        features: ['Pendant systems', 'Fall detection', 'Medical alerts']
      },
      {
        id: 'bath-services',
        title: 'Specialized Bath Services',
        description: 'Safe and comfortable bathing assistance',
        icon: 'Droplet',
        link: '/services/bath-services',
        features: ['Accessible bathing', 'Safety equipment', 'Personal care']
      },
      {
        id: 'phone-monitoring',
        title: 'Phone Monitoring',
        description: 'Regular check-ins for peace of mind',
        icon: 'MessageCircle',
        link: '/services/phone-monitoring',
        features: ['Daily calls', 'Wellness checks', 'Emergency escalation']
      }
    ],
    isActive: true,
    order: 2
  },
  {
    sectionId: 'specialized',
    title: 'Specialized Programs',
    items: [
      {
        id: 'swift',
        title: 'SWIFT Program',
        description: 'Short-term intervention for seniors',
        icon: 'Zap'
      },
      {
        id: 'consultations',
        title: 'Professional Consultations',
        description: 'Expert healthcare consultations',
        icon: 'Users'
      },
      {
        id: 'workshops',
        title: 'Caregiver Workshops',
        description: 'Training for family caregivers',
        icon: 'BookOpen'
      },
      {
        id: 'end-of-life',
        title: 'End-of-Life Care',
        description: 'Compassionate palliative support',
        icon: 'Heart'
      }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'insurance',
    title: 'Insurance Partners',
    description: 'We work with major insurance providers to make our services accessible.',
    items: [
      { name: 'Medavie Blue Cross' },
      { name: 'Blue Cross' },
      { name: 'Veterans Affairs Canada' },
      { name: 'Workers Compensation' }
    ],
    isActive: true,
    order: 4
  }
];

// Care-Ed page sections
const careEdPageSections = [
  {
    sectionId: 'hero',
    title: 'Care-Ed Programs',
    subtitle: 'Professional Healthcare Training',
    description: 'Comprehensive programs designed to launch your healthcare career.',
    isActive: true,
    order: 1
  },
  {
    sectionId: 'programs',
    title: 'Our Educational Programs',
    items: [
      {
        id: 'psw',
        title: 'Personal Support Worker Program',
        description: 'Comprehensive PSW certification training',
        duration: '6 months',
        certification: 'Provincial PSW Certificate',
        features: ['Theory & Practical', 'Clinical Placement', 'Job Assistance']
      },
      {
        id: 'first-aid',
        title: 'First Aid & CPR Certification',
        description: 'Essential life-saving skills',
        duration: '1-2 days',
        certification: 'Red Cross Certification',
        features: ['Hands-on Training', 'All Levels Available', 'Renewal Courses']
      },
      {
        id: 'foot-care',
        title: 'Foot Care Management',
        description: 'Specialized foot care training',
        duration: '4 weeks',
        certification: 'Foot Care Certificate',
        features: ['Theory & Practice', 'Equipment Training', 'Ongoing Support']
      }
    ],
    isActive: true,
    order: 2
  },
  {
    sectionId: 'workshops',
    title: 'Professional Workshops',
    items: [
      {
        id: 'whmis',
        title: 'WHMIS Training',
        description: 'Workplace Hazardous Materials Information System',
        duration: 'Half day'
      },
      {
        id: 'food-safety',
        title: 'Safe Food Handling',
        description: 'Food safety certification for healthcare workers',
        duration: '1 day'
      },
      {
        id: 'safetalk',
        title: 'safeTALK',
        description: 'Suicide alertness training',
        duration: 'Half day'
      }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'accreditations',
    title: 'Accreditations & Partnerships',
    items: [
      { name: 'NBAPCU', description: 'New Brunswick Association of Personal Care Workers' },
      { name: 'NACC', description: 'National Association of Career Colleges' },
      { name: 'NBHSA', description: 'New Brunswick Health & Safety Association' }
    ],
    isActive: true,
    order: 4
  }
];

// Careers page sections
const careersPageSections = [
  {
    sectionId: 'hero',
    title: 'Join Our Team',
    subtitle: 'Build Your Career with Care-Ed',
    description: 'Join a team dedicated to making a difference in healthcare education.',
    isActive: true,
    order: 1
  },
  {
    sectionId: 'positions',
    title: 'Current Openings',
    items: [
      {
        id: 'psw-instructor',
        title: 'PSW Instructor',
        type: 'Full-time',
        location: 'Saint John, NB',
        requirements: ['PSW Certificate', '3+ years experience', 'Teaching experience preferred']
      },
      {
        id: 'clinical-supervisor',
        title: 'Clinical Supervisor',
        type: 'Full-time',
        location: 'Saint John, NB',
        requirements: ['RN or RPN designation', 'Supervisory experience', 'Strong communication skills']
      },
      {
        id: 'program-coordinator',
        title: 'Program Coordinator',
        type: 'Full-time',
        location: 'Saint John, NB',
        requirements: ['Administrative experience', 'Healthcare background', 'Organizational skills']
      }
    ],
    isActive: true,
    order: 2
  },
  {
    sectionId: 'benefits',
    title: 'Benefits & Perks',
    items: [
      { title: 'Competitive Salary', icon: 'DollarSign' },
      { title: 'Health Benefits', icon: 'Heart' },
      { title: 'Professional Development', icon: 'BookOpen' },
      { title: 'Flexible Scheduling', icon: 'Calendar' },
      { title: 'Supportive Team', icon: 'Users' },
      { title: 'Meaningful Work', icon: 'Award' }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'contact',
    title: 'Apply Now',
    description: 'Send your resume and cover letter to careers@careed.com',
    content: {
      email: 'careers@careed.com',
      phone: '(506) 635-1234'
    },
    isActive: true,
    order: 4
  }
];

// Contact page sections
const contactPageSections = [
  {
    sectionId: 'hero',
    title: 'Contact Us',
    subtitle: 'Get in Touch',
    description: 'We\'re here to answer your questions about our programs and services.',
    isActive: true,
    order: 1
  },
  {
    sectionId: 'info',
    title: 'Contact Information',
    items: [
      { label: 'Address', value: '123 Care Way, Saint John, NB E2K 0A1', icon: 'MapPin' },
      { label: 'Phone', value: '(506) 635-1234', icon: 'Phone' },
      { label: 'Email', value: 'info@careed.com', icon: 'Mail' },
      { label: 'Fax', value: '(506) 635-1235', icon: 'FileText' }
    ],
    isActive: true,
    order: 2
  },
  {
    sectionId: 'hours',
    title: 'Office Hours',
    items: [
      { days: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
      { days: 'Saturday', hours: '9:00 AM - 12:00 PM' },
      { days: 'Sunday', hours: 'Closed' }
    ],
    isActive: true,
    order: 3
  },
  {
    sectionId: 'areas',
    title: 'Service Areas',
    items: [
      { name: 'Saint John' },
      { name: 'Moncton' },
      { name: 'Fredericton' },
      { name: 'Rothesay' },
      { name: 'Quispamsis' }
    ],
    isActive: true,
    order: 4
  }
];

// Global sections (navbar, footer)
const globalSections = [
  {
    sectionId: 'navbar',
    title: 'Navigation',
    content: {
      links: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Programs', path: '/care-ed' },
        { label: 'Services', path: '/services' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' }
      ],
      ctaButton: { text: 'Enroll Now', link: '/care-ed' },
      contactInfo: {
        phone: '(506) 635-1234',
        email: 'info@careed.com'
      }
    },
    isActive: true,
    order: 1
  },
  {
    sectionId: 'footer',
    title: 'Footer',
    content: {
      companyInfo: {
        name: 'Care-Ed Learning Center',
        description: 'Professional healthcare education and training in New Brunswick.',
        address: '123 Care Way, Saint John, NB E2K 0A1'
      },
      quickLinks: [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Programs', path: '/care-ed' },
        { label: 'Services', path: '/services' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' }
      ],
      programs: [
        { label: 'PSW Program', path: '/care-ed' },
        { label: 'First Aid/CPR', path: '/care-ed' },
        { label: 'Foot Care', path: '/services/foot-care' }
      ],
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/careed' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/careed' }
      ],
      copyright: '© 2024 Care-Ed Learning Center. All rights reserved.'
    },
    isActive: true,
    order: 2
  }
];

// Seed all pages
const seedPages = async (admin) => {
  try {
    const pages = [
      { pageId: 'home', title: 'Home', sections: homePageSections },
      { pageId: 'about', title: 'About Us', sections: aboutPageSections },
      { pageId: 'services', title: 'Services', sections: servicesPageSections },
      { pageId: 'care-ed', title: 'Care-Ed Programs', sections: careEdPageSections },
      { pageId: 'careers', title: 'Careers', sections: careersPageSections },
      { pageId: 'contact', title: 'Contact', sections: contactPageSections },
      { pageId: 'global', title: 'Global Elements', sections: globalSections }
    ];

    for (const pageData of pages) {
      const existingPage = await Page.findOne({ pageId: pageData.pageId });

      if (existingPage) {
        console.log(`Page ${pageData.pageId} already exists, updating...`);
        existingPage.sections = pageData.sections;
        existingPage.metadata.lastUpdated = new Date();
        existingPage.metadata.updatedBy = admin._id;
        await existingPage.save();
      } else {
        console.log(`Creating page ${pageData.pageId}...`);
        await Page.create({
          ...pageData,
          metadata: {
            lastUpdated: new Date(),
            updatedBy: admin._id
          }
        });
      }
    }

    console.log('All pages seeded successfully');
  } catch (error) {
    console.error('Error seeding pages:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    await connectDB();

    // Seed admin
    const admin = await seedAdmin();

    // Seed pages
    await seedPages(admin);

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nAdmin credentials:');
    console.log(`Email: ${admin.email}`);
    console.log('Password: [As set in environment variables]');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
seedDatabase();

export { seedDatabase, seedAdmin, seedPages };