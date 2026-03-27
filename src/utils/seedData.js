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

// ============================================
// HOME PAGE SECTIONS
// ============================================
const homePageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'Build Your Healthcare Career',
    subtitle: 'Professional Healthcare Training Since 2007',
    description: 'Quality education and professional training programs for aspiring healthcare professionals. Get certified and start making a difference.',
    images: [],
    buttons: [
      { text: 'Explore Programs', link: '/care-ed', style: 'primary' },
      { text: 'Contact Us', link: '/contact', style: 'secondary' }
    ],
    trustIndicators: {
      avatarCount: 4,
      text: '500+ Students Graduated'
    },
    isActive: true,
    order: 1
  },
  // Stats Section
  {
    sectionId: 'stats',
    title: 'Our Impact',
    items: [
      { number: 15, suffix: '+', label: 'Years Teaching', icon: 'Award' },
      { number: 100, suffix: '%', label: 'Licensed Instructors', icon: 'BadgeCheck' },
      { number: 500, suffix: '+', label: 'Students Graduated', icon: 'Users' },
      { number: 95, suffix: '%', label: 'Job Placement Rate', icon: 'Star' }
    ],
    isActive: true,
    order: 2
  },
  // Features Section
  {
    sectionId: 'features',
    title: 'Why Study With Us',
    items: [
      { icon: 'Award', title: 'Accredited Programs', description: 'Registered under NB Private Occupational Training Act with licensed instructors.' },
      { icon: 'GraduationCap', title: 'Experienced Faculty', description: 'Learn from licensed RN/LPN professionals with years of practical experience.' },
      { icon: 'Briefcase', title: 'Career Support', description: 'Job placement assistance and guidance to help start your healthcare career.' },
      { icon: 'Users', title: 'Small Class Sizes', description: 'Personalized attention with manageable class sizes for better learning.' },
      { icon: 'Clock', title: 'Flexible Scheduling', description: 'Various program schedules to accommodate different needs and availability.' }
    ],
    isActive: true,
    order: 3
  },
  // Programs Section
  {
    sectionId: 'programs',
    title: 'Healthcare Training Programs',
    subtitle: 'Accredited programs designed to prepare you for a rewarding career in healthcare.',
    description: 'Discover our range of professional healthcare programs',
    items: [
      { icon: 'GraduationCap', title: 'PSW Program', description: 'Approved Personal Support Worker program with comprehensive training, hands-on practicums, and job placement support.', link: '/care-ed', image: null },
      { icon: 'Heart', title: 'First Aid & CPR', description: 'Essential life-saving skills certification for healthcare professionals and caregivers at all levels.', link: '/care-ed', image: null },
      { icon: 'Activity', title: 'Foot Care Training', description: 'Advanced foot care training for nurses specializing in diabetic and geriatric foot care management.', link: '/care-ed', image: null },
      { icon: 'BookOpen', title: 'Specialized Workshops', description: 'Professional development workshops including WHMIS, Safe Food Handling, and safeTalk certification.', link: '/care-ed', image: null }
    ],
    isActive: true,
    order: 4
  },
  // About Section
  {
    sectionId: 'about',
    title: 'Professional Healthcare Education & Training',
    description: 'Care-Ed Learning Center has been providing quality healthcare education and professional training since 2007. Our programs are designed to prepare students for rewarding careers in healthcare.',
    content: 'We offer approved training programs with hands-on practicums, classroom lectures, and professional mentoring. Our goal is to provide research-based knowledge and skill-building opportunities.',
    features: [
      'Licensed RN/LPN Instructors',
      'Approved Training Programs',
      'Hands-on Practicum',
      'Job Placement Support'
    ],
    images: [],
    badge: {
      number: 15,
      suffix: '+',
      label: 'Years Teaching'
    },
    buttons: [
      { text: 'Learn More About Us', link: '/about', style: 'primary' }
    ],
    isActive: true,
    order: 5
  },
  // Testimonials Section
  {
    sectionId: 'testimonials',
    title: 'What Our Students Say',
    description: 'Hear from our graduates who have successfully started their healthcare careers.',
    items: [
      { quote: 'The PSW program at Care-Ed gave me the skills and confidence to start a rewarding career in healthcare. The instructors were amazing!', author: 'Sarah M.', role: 'PSW Graduate, Class of 2023' },
      { quote: 'I completed my First Aid and CPR certification here. The hands-on training and supportive environment made learning easy and enjoyable.', author: 'Michael T.', role: 'Healthcare Professional' },
      { quote: 'The foot care training program was comprehensive and practical. I now feel confident providing specialized care to my patients.', author: 'Jennifer L.', role: 'RN, Foot Care Nurse' }
    ],
    isActive: true,
    order: 6
  },
  // CTA Section
  {
    sectionId: 'cta',
    title: 'Ready to Begin Your Healthcare Career?',
    subtitle: 'Start Your Journey',
    description: 'Join hundreds of graduates who have successfully started their careers in healthcare through our professional training programs.',
    features: [
      { icon: 'GraduationCap', label: 'PSW Program' },
      { icon: 'Heart', label: 'First Aid & CPR' },
      { icon: 'Activity', label: 'Foot Care' },
      { icon: 'BookOpen', label: 'Workshops' }
    ],
    badge: {
      number: 95,
      suffix: '%',
      label: 'Job Placement Rate'
    },
    buttons: [
      { text: 'Contact Us', link: '/contact', style: 'primary' }
    ],
    images: [],
    isActive: true,
    order: 7
  },
  // Bottom CTA Section
  {
    sectionId: 'bottomCta',
    title: 'Enroll in Our Programs Today',
    description: 'Take the first step toward a rewarding career in healthcare. Contact us to learn more about our programs and enrollment.',
    buttons: [
      { text: 'View Programs', link: '/care-ed', style: 'primary' },
      { text: 'Contact Us', link: '/contact', style: 'secondary' }
    ],
    isActive: true,
    order: 8
  }
];

// ============================================
// ABOUT PAGE SECTIONS
// ============================================
const aboutPageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'About Care-Ed',
    subtitle: 'Excellence in Healthcare Education Since 1987',
    description: 'Professional healthcare education since 2007. We provide quality training programs that prepare students for rewarding careers in healthcare.',
    images: [],
    buttons: [
      { text: 'Contact Us', link: '/contact', style: 'primary' },
      { text: 'View Programs', link: '/care-ed', style: 'secondary' }
    ],
    isActive: true,
    order: 1
  },
  // Mission Section
  {
    sectionId: 'mission',
    title: 'Our Mission',
    description: '"To provide customized, client-sensitive support services and education programs resulting in improved standards, attitudes and services."',
    content: {
      vision: 'Care-Ed Learning Center, established in 2007, is the educational division of Care-ed Inc. We offer approved training programs including Personal Support Worker (PSW), First Aid & CPR, Foot Care Management, and specialized workshops.'
    },
    stats: [
      { number: 15, suffix: '+', label: 'Years Teaching' },
      { number: 100, suffix: '%', label: 'Licensed Instructors' }
    ],
    images: [],
    isActive: true,
    order: 2
  },
  // Values Section
  {
    sectionId: 'values',
    title: 'Our Values',
    subtitle: 'The principles that guide our educational programs.',
    items: [
      { icon: 'GraduationCap', title: 'Quality Education', description: 'We provide research-based knowledge and skill-building opportunities for healthcare professionals.' },
      { icon: 'Target', title: 'Student-Focused', description: 'Our programs are designed to meet the needs of students and prepare them for successful careers.' },
      { icon: 'Users', title: 'Community-Oriented', description: 'We listen and respond to the needs of our community and healthcare industry.' },
      { icon: 'Award', title: 'Excellence', description: 'We maintain rigorous standards through constant evaluation and licensed instructors.' }
    ],
    isActive: true,
    order: 3
  },
  // Timeline Section
  {
    sectionId: 'timeline',
    title: 'Our Journey',
    subtitle: 'A legacy of healthcare education and professional training.',
    items: [
      { year: '1987', title: 'Company Founded', description: 'Care-ed was established by Jean E. Porter Mowatt and Sharon A. O\'Brien.' },
      { year: '1993', title: 'Educational Endowment', description: 'Established an Educational Endowment Fund to support caregiver education.' },
      { year: '2001', title: 'Learn While You Earn', description: 'Launched Employee in Action – Learn While You Earn Program.' },
      { year: '2007', title: 'Care-Ed Learning Center', description: 'Founded Care-Ed Learning Center for professional healthcare training.' },
      { year: 'Today', title: 'Continuing Excellence', description: '15+ years of quality healthcare education and professional training programs.' }
    ],
    isActive: true,
    order: 4
  },
  // Leadership Section
  {
    sectionId: 'leadership',
    title: 'Leadership Team',
    subtitle: 'Dedicated professionals committed to excellence in healthcare education.',
    items: [
      { name: 'Jean E. Porter Mowatt', role: 'President & CEO', bio: 'Communications specialist with 39 years in cablevision and print media. Recipient of the Omer Girard Award for innovation in cable television.', image: null },
      { name: 'Sharon A. O\'Brien (1938-2024)', role: 'Executive Vice-President & CLO', bio: 'RN with social work and gerontology credentials. Developed the PSW program and Foot Care Management Course.', image: null }
    ],
    isActive: true,
    order: 5
  },
  // Location Section
  {
    sectionId: 'location',
    title: 'Location',
    description: 'Conveniently located in Saint John, New Brunswick, serving students from across the region.',
    visitLabel: 'Visit Us',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2825.4832!2d-66.0637!3d45.2715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDE2JzE3LjQiTiA2NsKwMDMnNDUuMyJX!5e0!3m2!1sen!2sca!4v1234567890',
    address: {
      street: '100 Prince Edward St Unit #111',
      city: 'Saint John, NB E2L 4M5'
    },
    phone: '(506) 634-8906',
    tollFree: '1(800) 561-2463',
    areas: [
      { name: 'Saint John' },
      { name: 'Quispamsis' },
      { name: 'Rothesay' },
      { name: 'Grand Bay-Westfield' }
    ],
    isActive: true,
    order: 6
  },
  // Why Choose Section
  {
    sectionId: 'whyChoose',
    title: 'Why Choose Care-Ed?',
    subtitle: 'Discover what makes us the right choice for your healthcare education.',
    items: [
      { title: 'Approved training programs under NB Private Occupational Training Act' },
      { title: 'Licensed RN/LPN instructors with practical experience' },
      { title: 'Hands-on practicum and professional mentoring' },
      { title: 'Gerontology-based approach to education' },
      { title: 'Job placement support for graduates' },
      { title: 'Small class sizes for personalized attention' }
    ],
    images: [],
    isActive: true,
    order: 7
  },
  // CTA Section
  {
    sectionId: 'cta',
    title: 'Ready to Start Your Healthcare Career?',
    description: 'Contact us today to learn more about our programs and enrollment.',
    buttons: [
      { text: 'Contact Us', link: '/contact', style: 'primary' }
    ],
    isActive: true,
    order: 8
  }
];

// ============================================
// SERVICES PAGE SECTIONS
// ============================================
const servicesPageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'Our Services',
    subtitle: 'Comprehensive Healthcare Services',
    description: 'From personal care to specialized programs, we offer a full range of services to meet your needs.',
    isActive: true,
    order: 1
  },
  // Services Section
  {
    sectionId: 'services',
    title: 'Home Care Services',
    subtitle: 'Professional care services tailored to your individual needs',
    description: 'Professional care services tailored to your individual needs, delivered with compassion and expertise.',
    items: [
      { id: 'home-care', title: 'Home Care Services', description: 'Personalized care in the comfort of your home', icon: 'Home', link: '/services/home-care', features: ['Personal care', 'Meal preparation', 'Light housekeeping'] },
      { id: 'foot-care', title: 'Foot Care Services', description: 'Professional foot care for health and comfort', icon: 'Activity', link: '/services/foot-care', features: ['Nail care', 'Callus treatment', 'Diabetic foot care'] },
      { id: 'personal-support', title: 'Personal Support', description: 'Assistance with daily activities', icon: 'User', link: '/services/personal-support', features: ['Bathing assistance', 'Mobility support', 'Companionship'] },
      { id: 'emergency', title: 'Emergency Response', description: '24/7 emergency care services', icon: 'Phone', link: '/services/emergency-response', features: ['Pendant systems', 'Fall detection', 'Medical alerts'] },
      { id: 'bath-services', title: 'Specialized Bath Services', description: 'Safe and comfortable bathing assistance', icon: 'Droplet', link: '/services/bath-services', features: ['Accessible bathing', 'Safety equipment', 'Personal care'] },
      { id: 'phone-monitoring', title: 'Phone Monitoring', description: 'Regular check-ins for peace of mind', icon: 'MessageCircle', link: '/services/phone-monitoring', features: ['Daily calls', 'Wellness checks', 'Emergency escalation'] }
    ],
    isActive: true,
    order: 2
  },
  // Specialized Section
  {
    sectionId: 'specialized',
    title: 'Specialized Programs',
    subtitle: 'Additional services and programs to support seniors and their families',
    description: 'Additional services and programs to support seniors and their families.',
    items: [
      { id: 'swift', title: 'SWIFT Pre-Planning Service', description: 'Pre-planning for hospital discharge scenarios with support for families and employers.', icon: 'Briefcase', link: '/services/swift-planning' },
      { id: 'consultations', title: 'Consultations', description: 'Assessment for services, family planning, resources, care management, and environmental safety monitoring.', icon: 'BookOpen', link: '/services/consultations' },
      { id: 'workshops', title: 'Workshops', description: 'Educational workshops on elder abuse, caregiver support, depression, Alzheimer\'s, and dementia.', icon: 'Users', link: '/services/workshops' },
      { id: 'end-of-life', title: 'End-of-Life Care Program', description: '5-part National Palliative Care Certificate Program for paraprofessionals and family caregivers.', icon: 'Heart', link: '/services/end-of-life' }
    ],
    isActive: true,
    order: 3
  },
  // Insurance Section
  {
    sectionId: 'insurance',
    title: 'Insurance & Coverage',
    description: 'We work with major insurance providers to make our services accessible.',
    items: [
      { name: 'Blue Cross', description: 'Accepted for eligible services' },
      { name: 'Veterans Affairs', description: 'Coverage for veterans' },
      { name: 'Private Insurance', description: 'Claims processing available' }
    ],
    isActive: true,
    order: 4
  }
];

// ============================================
// CARE-ED PAGE SECTIONS
// ============================================
const careEdPageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'Care-Ed Learning Center',
    subtitle: 'Professional Training Since 2007',
    description: 'Professional healthcare education and training programs designed to prepare students for successful careers.',
    badge: {
      text: 'Professional Training Since 2007',
      icon: 'GraduationCap'
    },
    images: [],
    isActive: true,
    order: 1
  },
  // Intro Section
  {
    sectionId: 'intro',
    title: 'Professional Healthcare Education',
    description: 'Care-Ed Learning Center is officially registered under the NB Private Occupational Training Act. We provide comprehensive training programs for individuals seeking careers in healthcare and professional certifications.',
    content: 'Our goal is to provide research-based knowledge and skill-building opportunities that prepare students for rewarding healthcare careers with licensed instructors and hands-on training.',
    stats: [
      { number: 15, suffix: '+', label: 'Years of Training' },
      { number: 100, suffix: '%', label: 'Licensed Instructors' }
    ],
    images: [],
    isActive: true,
    order: 2
  },
  // Programs Section
  {
    sectionId: 'programs',
    title: 'Our Programs',
    subtitle: 'Comprehensive training programs designed to prepare you for a rewarding career in healthcare.',
    items: [
      { id: 'psw', icon: 'GraduationCap', title: 'Personal Support Worker (PSW) Program', description: 'Approved training program with hands-on practicums, classroom lectures, and professional mentoring. Comprehensive preparation for a rewarding career in healthcare.', duration: 'Full Program', certification: 'Provincial PSW Certificate', features: ['Approved training program', 'Hands-on practicum experience', 'Classroom lectures', 'Professional mentoring', 'Job placement support'], prerequisites: ['High School or GED Certificate', 'Current CPR/First Aid Certificate', 'Criminal Record Check', 'Vulnerable Sector Check', 'Dept. of Social Development Record Check'] },
      { id: 'first-aid', icon: 'Heart', title: 'First Aid & CPR Training', description: 'Essential life-saving skills certification for healthcare professionals, caregivers, and anyone interested in emergency preparedness.', duration: 'Various Levels', certification: 'Red Cross Certification', features: ['All certification levels available', 'Healthcare provider level', 'Recertification courses', 'Group training available', 'Certification upon completion'] },
      { id: 'foot-care', icon: 'Users', title: 'Foot Care Management', description: 'Advanced foot care training for nurses specializing in diabetic and geriatric foot care. Requires current nursing registration.', duration: 'Certificate Program', certification: 'Foot Care Certificate', features: ['For registered nurses (RN/LPN)', 'Diabetic foot care', 'Geriatric foot care', 'Hands-on training', 'Certificate upon completion'] }
    ],
    isActive: true,
    order: 3
  },
  // Workshops Section
  {
    sectionId: 'workshops',
    title: 'Workshops',
    subtitle: 'Short, focused workshops to enhance your skills and meet certification requirements.',
    items: [
      { id: 'whmis', title: 'WHMIS', description: 'Workplace Hazardous Materials Information System training for safe handling of hazardous materials.', duration: '3 hours' },
      { id: 'food-safety', title: 'Safe Food Handling', description: 'Essential sanitation and food safety practices for caregivers and healthcare workers.', duration: '3 hours' },
      { id: 'safetalk', title: 'safeTALK', description: 'Suicide warning signs recognition training to help identify and support those at risk.', duration: '3 hours' }
    ],
    isActive: true,
    order: 4
  },
  // Accreditations Section
  {
    sectionId: 'accreditations',
    title: 'Accreditations & Memberships',
    subtitle: 'Registered under NB Private Occupational Training Act with licensed instructors.',
    items: [
      { name: 'NBAPCU', description: 'New Brunswick Association of Personal Care Workers' },
      { name: 'NACC', description: 'National Association of Career Colleges' },
      { name: 'NBHSA', description: 'New Brunswick Health & Safety Association' }
    ],
    isActive: true,
    order: 5
  },
  // Instructors Section
  {
    sectionId: 'instructors',
    title: 'Qualified Instructors',
    description: 'All our instructors hold current RN or LPN licenses and bring years of practical experience to the classroom. We maintain rigorous standards through constant evaluation of our teaching staff.',
    features: ['Current RN/LPN licenses', 'Years of practical experience', 'Ongoing professional development', 'Gerontology expertise', 'Patient-centered teaching approach'],
    images: [],
    isActive: true,
    order: 6
  },
  // CTA Section
  {
    sectionId: 'cta',
    title: 'Ready to Start Your Healthcare Career?',
    description: 'Contact us today to learn more about our programs or to register for an upcoming session.',
    buttons: [
      { text: 'Contact Us', link: '/contact', style: 'primary' },
      { text: '(506) 634-8906', link: 'tel:+15066348906', style: 'secondary' }
    ],
    contactEmail: 'train@seniorwatch.com',
    contactName: 'Heidi',
    isActive: true,
    order: 7
  }
];

// ============================================
// CAREERS PAGE SECTIONS
// ============================================
const careersPageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'Join Our Team',
    subtitle: 'Build Your Career with Care-Ed',
    description: 'Join a team dedicated to making a difference in healthcare education.',
    isActive: true,
    order: 1
  },
  // Positions Section
  {
    sectionId: 'positions',
    title: 'Current Openings',
    items: [
      { id: 'psw', title: 'Personal Support Worker', type: 'Full-time / Part-time', location: 'Greater Saint John', description: 'Provide compassionate care to seniors in their homes or hospital settings. Assist with daily living activities, meal preparation, and wellness promotion.', requirements: ['Current CPR and First Aid Certification', 'PSW Certificate (training available)', 'Access to a car', 'Background checks required'] },
      { id: 'schedule-manager', title: 'Schedule Manager', type: 'Full-time', location: 'Greater Saint John', description: 'Coordinate and manage caregiver schedules to ensure seamless coverage for all clients. Handle scheduling conflicts and communicate with staff and families.', requirements: ['Strong organizational skills', 'Experience in healthcare scheduling preferred', 'Excellent communication skills', 'Proficiency with scheduling software'] },
      { id: 'foot-care-nurse', title: 'Foot Care Nurse', type: 'Full-time / Part-time', location: 'Greater Saint John', description: 'Provide professional foot care services to seniors, including treatment of calluses, corns, and thickened nails. Work in clinic, home, or hospital settings.', requirements: ['Current RN or LPN license', 'Foot Care Management certification preferred', 'Experience in geriatric care', 'Valid driver\'s license'] },
      { id: 'international', title: 'Trained Medical Internationals', type: 'Full-time', location: 'Greater Saint John', description: 'International healthcare professionals looking to gain Canadian work experience in senior care. We provide support and mentorship.', requirements: ['Medical credentials from home country', 'Interest in senior care', 'Valid work permit', 'Good communication skills in English'] },
      { id: 'psw-training', title: 'PSW on-the-job Training for Internationals', type: 'Full-time', location: 'Greater Saint John', description: 'Combined training and employment program for international candidates. Learn while you earn through our Care-Ed Learning Center.', requirements: ['Interest in healthcare career', 'Valid work permit', 'Commitment to complete training', 'Good communication skills'] }
    ],
    isActive: true,
    order: 2
  },
  // Benefits Section
  {
    sectionId: 'benefits',
    title: 'Benefits & Perks',
    items: [
      { title: 'Health Insurance', icon: 'Heart', description: 'Comprehensive health coverage with prescriptions, dental, and vision for full-time employees' },
      { title: 'Family Health Plan', icon: 'Users', description: 'Family health plan available for eligible employees' },
      { title: 'Training Programs', icon: 'GraduationCap', description: 'PSW training and professional development opportunities' },
      { title: 'Flexible Hours', icon: 'Clock', description: 'Part-time or full-time employment options to suit your schedule' },
      { title: 'Supportive Team', icon: 'Users', description: 'Collaborative and supportive work environment' },
      { title: 'Meaningful Work', icon: 'Award', description: 'Make a real difference in people\'s lives every day' }
    ],
    isActive: true,
    order: 3
  },
  // Contact Section
  {
    sectionId: 'contact',
    title: 'Apply Now',
    description: 'Send your resume and cover letter to train@seniorwatch.com',
    content: {
      email: 'train@seniorwatch.com',
      phone: '(506) 634-8906'
    },
    buttons: [
      { text: 'Contact Us', link: '/contact', style: 'primary' }
    ],
    isActive: true,
    order: 4
  }
];

// ============================================
// CONTACT PAGE SECTIONS
// ============================================
const contactPageSections = [
  // Hero Section
  {
    sectionId: 'hero',
    title: 'Contact Us',
    subtitle: 'Get in Touch',
    description: 'We\'re here to help. Reach out to us for any questions about our training programs, enrollment, or career opportunities.',
    images: [],
    isActive: true,
    order: 1
  },
  // Info Section
  {
    sectionId: 'info',
    title: 'Contact Information',
    items: [
      { label: 'Address', value: '100 Prince Edward St Unit #111, Saint John, NB E2L 4M5', icon: 'MapPin', link: 'https://maps.google.com/?q=100+Prince+Edward+St+Saint+John+NB' },
      { label: 'Phone', value: '(506) 634-8906', icon: 'Phone', link: 'tel:+15066348906' },
      { label: 'Toll-Free', value: '1(800) 561-2463', icon: 'Phone', link: 'tel:+18005612463' },
      { label: 'Email', value: 'train@seniorwatch.com', icon: 'Mail', link: 'mailto:train@seniorwatch.com' }
    ],
    isActive: true,
    order: 2
  },
  // Hours Section
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
  // Areas Section
  {
    sectionId: 'areas',
    title: 'Serving Students From',
    description: 'We welcome students from the Greater Saint John area and surrounding communities:',
    items: [
      { name: 'Saint John' },
      { name: 'Moncton' },
      { name: 'Fredericton' },
      { name: 'Rothesay' },
      { name: 'Quispamsis' }
    ],
    isActive: true,
    order: 4
  },
  // Quick Contact Section
  {
    sectionId: 'quickContact',
    title: 'Quick Contact',
    description: 'Have questions about our programs? Our team is ready to help you get started on your healthcare career.',
    items: [
      { icon: 'Phone', title: 'Call Us', subtitle: 'For immediate assistance', value: '(506) 634-8906', link: 'tel:+15066348906' },
      { icon: 'Mail', title: 'Email Us', subtitle: 'For general inquiries', value: 'train@seniorwatch.com', link: 'mailto:train@seniorwatch.com' },
      { icon: 'MapPin', title: 'Visit Us', subtitle: 'At our office location', value: 'Get Directions', link: 'https://maps.google.com/?q=100+Prince+Edward+St+Saint+John+NB' }
    ],
    isActive: true,
    order: 5
  },
  // CTA Section
  {
    sectionId: 'cta',
    title: 'Start Your Healthcare Career',
    description: 'Whether you\'re interested in our PSW program, certification courses, or have questions about enrollment, we\'d love to hear from you.',
    buttons: [
      { text: '(506) 634-8906', link: 'tel:+15066348906', style: 'primary' }
    ],
    isActive: true,
    order: 6
  }
];

// ============================================
// GLOBAL SECTIONS (Navbar, Footer, Branding)
// ============================================
const globalSections = [
  // Branding Section
  {
    sectionId: 'branding',
    title: 'Branding',
    content: {
      siteName: 'Care-Ed Learning Center',
      logo: { url: '', alt: 'Care-Ed Logo', publicId: '' },
      logoLight: { url: '', alt: 'Care-Ed Logo Light', publicId: '' },
      favicon: { url: '', publicId: '' }
    },
    isActive: true,
    order: 0
  },
  // Navbar Section
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
        phone: '(506) 634-8906',
        email: 'train@seniorwatch.com'
      },
      tagline: 'Professional Healthcare Training Since 2007'
    },
    isActive: true,
    order: 1
  },
  // Footer Section
  {
    sectionId: 'footer',
    title: 'Footer',
    content: {
      companyInfo: {
        name: 'Care-Ed Learning Center',
        description: 'Professional healthcare education and training since 2007. Building careers through quality education.',
        address: '100 Prince Edward St, Saint John, NB'
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
        { label: 'CPR & First Aid', path: '/care-ed' },
        { label: 'Foot Care Training', path: '/care-ed' }
      ],
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/careed' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/careed' }
      ],
      contactInfo: {
        phone: '(506) 634-8906',
        email: 'train@seniorwatch.com',
        address: '100 Prince Edward St, Saint John, NB'
      },
      copyright: '© {year} Care-Ed Inc. All rights reserved.',
      privacyLink: '/privacy',
      termsLink: '/terms'
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

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Seeded Pages:');
    console.log('   - Home (8 sections)');
    console.log('   - About (8 sections)');
    console.log('   - Services (4 sections)');
    console.log('   - Care-Ed (7 sections)');
    console.log('   - Careers (4 sections)');
    console.log('   - Contact (6 sections)');
    console.log('   - Global (3 sections)');
    console.log('\n👤 Admin credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log('   Password: [As set in environment variables]');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
seedDatabase();

export { seedDatabase, seedAdmin, seedPages };