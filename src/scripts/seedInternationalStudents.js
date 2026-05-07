import mongoose from 'mongoose';
import Page from '../models/Page.js';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// International Students Pages Seed Data
const internationalStudentsPages = [
  {
    pageId: 'international-students',
    title: 'International Students',
    slug: 'international-students',
    parentCategory: null,
    order: 0,
    isPublished: true,
    seo: {
      metaTitle: 'International Students | Care-Ed Learning Center',
      metaDescription: 'Welcome international students to Care-Ed Learning Center. Find programs, admissions, housing support, and resources for studying healthcare in Canada.',
      ogImage: null,
      canonicalUrl: '/international-students'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Welcome International Students',
        subtitle: 'Your Journey to Healthcare Excellence Starts Here',
        description: 'Care-Ed Learning Center welcomes students from around the world. We provide comprehensive support services to help you succeed in your healthcare education journey in Canada.',
        images: [],
        buttons: [
          { text: 'Explore Programs', link: '/international-students/programs', style: 'primary' },
          { text: 'How to Apply', link: '/international-students/how-to-apply', style: 'secondary' }
        ],
        isActive: true,
        order: 1
      },
      {
        sectionId: 'cardsGrid',
        title: 'Resources for International Students',
        subtitle: 'Everything you need to know about studying with us',
        items: [
          { icon: 'GraduationCap', title: 'Programs', description: 'Explore healthcare programs designed for international students.', link: '/international-students/programs' },
          { icon: 'FileText', title: 'How to Apply', description: 'Step-by-step guide to your application process.', link: '/international-students/how-to-apply' },
          { icon: 'ClipboardCheck', title: 'Admission Requirements', description: 'Check requirements for international applicants.', link: '/international-students/admission-requirements' },
          { icon: 'DollarSign', title: 'Tuition & Fees', description: 'Understand costs, payment options, and refund policies.', link: '/international-students/tuition-fees' },
          { icon: 'Languages', title: 'Language Requirements', description: 'English language proficiency requirements.', link: '/international-students/language-requirements' },
          { icon: 'Home', title: 'Housing Support', description: 'Find accommodation options and support services.', link: '/international-students/housing-support' }
        ],
        columns: 3,
        isActive: true,
        order: 2
      }
    ]
  },
  {
    pageId: 'is-programs',
    title: 'Programs for International Students',
    slug: 'programs',
    parentCategory: 'international-students',
    order: 1,
    isPublished: true,
    seo: {
      metaTitle: 'Programs for International Students | Care-Ed Learning Center',
      metaDescription: 'Explore healthcare training programs available for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/programs'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Programs for International Students',
        subtitle: 'Healthcare Training Programs',
        description: 'Care-Ed Learning Center offers internationally recognized healthcare training programs designed to prepare you for a successful career in the healthcare industry.',
        images: [],
        buttons: [{ text: 'Apply Now', link: '/international-students/how-to-apply', style: 'primary' }],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-apply',
    title: 'How to Apply',
    slug: 'how-to-apply',
    parentCategory: 'international-students',
    order: 2,
    isPublished: true,
    seo: {
      metaTitle: 'How to Apply | International Students | Care-Ed Learning Center',
      metaDescription: 'Step-by-step guide to applying as an international student at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/how-to-apply'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'How to Apply',
        subtitle: 'Your Application Journey',
        description: 'Follow these steps to begin your healthcare education journey at Care-Ed Learning Center.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-admission-requirements',
    title: 'Admission Requirements',
    slug: 'admission-requirements',
    parentCategory: 'international-students',
    order: 3,
    isPublished: true,
    seo: {
      metaTitle: 'Admission Requirements | International Students | Care-Ed Learning Center',
      metaDescription: 'Learn about admission requirements for international students applying to Care-Ed Learning Center healthcare programs.',
      ogImage: null,
      canonicalUrl: '/international-students/admission-requirements'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Admission Requirements',
        subtitle: 'Requirements for International Students',
        description: 'Review the admission requirements for international students. Our admissions team is available to answer any questions about your eligibility.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-tuition-fees',
    title: 'Tuition, Fees & Refund Policy',
    slug: 'tuition-fees',
    parentCategory: 'international-students',
    order: 4,
    isPublished: true,
    seo: {
      metaTitle: 'Tuition & Fees | International Students | Care-Ed Learning Center',
      metaDescription: 'Information about tuition fees, payment options, and refund policies for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/tuition-fees'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Tuition, Fees & Refund Policy',
        subtitle: 'Understanding Your Investment',
        description: 'Learn about tuition costs, additional fees, payment options, and our refund policy for international students.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-language-requirements',
    title: 'Language Requirements',
    slug: 'language-requirements',
    parentCategory: 'international-students',
    order: 5,
    isPublished: true,
    seo: {
      metaTitle: 'Language Requirements | International Students | Care-Ed Learning Center',
      metaDescription: 'English language proficiency requirements for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/language-requirements'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Language Requirements',
        subtitle: 'English Proficiency Standards',
        description: 'All international students must demonstrate English language proficiency to ensure success in our healthcare training programs.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-housing-support',
    title: 'Housing Support',
    slug: 'housing-support',
    parentCategory: 'international-students',
    order: 6,
    isPublished: true,
    seo: {
      metaTitle: 'Housing Support | International Students | Care-Ed Learning Center',
      metaDescription: 'Housing and accommodation support services for international students studying at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/housing-support'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Housing Support',
        subtitle: 'Finding Your Home Away From Home',
        description: 'Finding suitable accommodation is an important part of your study abroad experience. We are here to help you find safe, affordable housing options.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-health-support',
    title: 'Health Support',
    slug: 'health-support',
    parentCategory: 'international-students',
    order: 7,
    isPublished: true,
    seo: {
      metaTitle: 'Health Support | International Students | Care-Ed Learning Center',
      metaDescription: 'Healthcare services, insurance information, and medical support for international students.',
      ogImage: null,
      canonicalUrl: '/international-students/health-support'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Health Support',
        subtitle: 'Your Health Matters',
        description: 'Access healthcare services and understand your health insurance options while studying in Canada.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-mental-health',
    title: 'Mental Health & Crisis Support',
    slug: 'mental-health',
    parentCategory: 'international-students',
    order: 8,
    isPublished: true,
    seo: {
      metaTitle: 'Mental Health Support | International Students | Care-Ed Learning Center',
      metaDescription: 'Mental health and crisis support services for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/mental-health'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Mental Health & Crisis Support',
        subtitle: 'You Are Not Alone',
        description: 'Studying abroad can be challenging. We are committed to supporting your mental health and well-being. Help is available whenever you need it.',
        images: [],
        buttons: [{ text: 'Crisis Helpline', link: 'tel:988', style: 'primary' }],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-social-support',
    title: 'Social & Community Support',
    slug: 'social-support',
    parentCategory: 'international-students',
    order: 9,
    isPublished: true,
    seo: {
      metaTitle: 'Social & Community Support | International Students | Care-Ed Learning Center',
      metaDescription: 'Social and community support resources for international students in Saint John, New Brunswick.',
      ogImage: null,
      canonicalUrl: '/international-students/social-support'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Social & Community Support',
        subtitle: 'Build Your Community',
        description: 'Connect with other students, explore local communities, and make the most of your time in Canada.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-academic-support',
    title: 'Academic & Peer Support',
    slug: 'academic-support',
    parentCategory: 'international-students',
    order: 10,
    isPublished: true,
    seo: {
      metaTitle: 'Academic Support | International Students | Care-Ed Learning Center',
      metaDescription: 'Academic and peer support services for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/academic-support'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Academic & Peer Support',
        subtitle: 'Success Starts with Support',
        description: 'Access tutoring, study resources, and peer support to excel in your healthcare training program.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-immigration',
    title: 'Immigration & Study Permit Resources',
    slug: 'immigration',
    parentCategory: 'international-students',
    order: 11,
    isPublished: true,
    seo: {
      metaTitle: 'Immigration & Study Permit | International Students | Care-Ed Learning Center',
      metaDescription: 'Immigration, visa, and study permit resources for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/immigration'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Immigration & Study Permit Resources',
        subtitle: 'Navigate Your Visa Journey',
        description: 'Important information about study permits, visas, and immigration requirements for studying in Canada.',
        images: [],
        buttons: [{ text: 'IRCC Website', link: 'https://www.canada.ca/en/immigration-refugees-citizenship.html', style: 'secondary' }],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-student-rights',
    title: 'Student Rights & Responsibilities',
    slug: 'student-rights',
    parentCategory: 'international-students',
    order: 12,
    isPublished: true,
    seo: {
      metaTitle: 'Student Rights & Responsibilities | International Students | Care-Ed Learning Center',
      metaDescription: 'Know your rights and responsibilities as an international student at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/student-rights'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Student Rights & Responsibilities',
        subtitle: 'Know Your Rights, Understand Your Responsibilities',
        description: 'Understanding your rights and responsibilities helps create a positive learning environment and ensures you make the most of your educational experience.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-student-advisor',
    title: 'Student Advisor / International Student Contact',
    slug: 'student-advisor',
    parentCategory: 'international-students',
    order: 13,
    isPublished: true,
    seo: {
      metaTitle: 'Student Advisor | International Students | Care-Ed Learning Center',
      metaDescription: 'Contact your dedicated international student advisor at Care-Ed Learning Center for personalized support.',
      ogImage: null,
      canonicalUrl: '/international-students/student-advisor'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Student Advisor',
        subtitle: 'Your Dedicated Support Contact',
        description: 'Your International Student Advisor is here to help you navigate your educational journey. From application to graduation, we are available to answer questions and provide support.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-important-links',
    title: 'Important Links',
    slug: 'important-links',
    parentCategory: 'international-students',
    order: 14,
    isPublished: true,
    seo: {
      metaTitle: 'Important Links | International Students | Care-Ed Learning Center',
      metaDescription: 'Useful links and resources for international students at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/important-links'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Important Links',
        subtitle: 'Useful Resources at Your Fingertips',
        description: 'Quick access to essential resources for international students. Find government services, local resources, and helpful information.',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  },
  {
    pageId: 'is-faq',
    title: 'Frequently Asked Questions',
    slug: 'faq',
    parentCategory: 'international-students',
    order: 15,
    isPublished: true,
    seo: {
      metaTitle: 'FAQ | International Students | Care-Ed Learning Center',
      metaDescription: 'Frequently asked questions from international students about studying at Care-Ed Learning Center.',
      ogImage: null,
      canonicalUrl: '/international-students/faq'
    },
    sections: [
      {
        sectionId: 'hero',
        title: 'Frequently Asked Questions',
        subtitle: 'Answers to Common Questions',
        description: 'Find answers to the most commonly asked questions from international students. Cant find what you are looking for? Contact us!',
        images: [],
        buttons: [],
        isActive: true,
        order: 1
      }
    ]
  }
];

// Seed function
const seedInternationalStudents = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get first admin for metadata
    const admin = await Admin.findOne({ role: 'super_admin' });
    const adminId = admin ? admin._id : null;

    console.log('Seeding International Students pages...');

    for (const pageData of internationalStudentsPages) {
      const existingPage = await Page.findOne({ pageId: pageData.pageId });

      if (existingPage) {
        // Update existing page
        console.log(`Updating page: ${pageData.pageId}`);
        await Page.updateOne(
          { pageId: pageData.pageId },
          {
            $set: {
              title: pageData.title,
              slug: pageData.slug,
              parentCategory: pageData.parentCategory,
              order: pageData.order,
              seo: pageData.seo,
              sections: pageData.sections,
              'metadata.lastUpdated': new Date(),
              ...(adminId && { 'metadata.updatedBy': adminId })
            }
          }
        );
      } else {
        // Create new page
        console.log(`Creating page: ${pageData.pageId}`);
        await Page.create({
          pageId: pageData.pageId,
          title: pageData.title,
          slug: pageData.slug,
          parentCategory: pageData.parentCategory,
          order: pageData.order,
          isPublished: pageData.isPublished,
          seo: pageData.seo,
          sections: pageData.sections,
          metadata: {
            lastUpdated: new Date(),
            updatedBy: adminId
          }
        });
      }
    }

    console.log('International Students pages seeded successfully!');
    console.log(`Total pages: ${internationalStudentsPages.length}`);

    // Verify seeding
    const allPages = await Page.find({ pageId: { $regex: /^(international-students|is-)/ } });
    console.log('Seeded pages:');
    allPages.forEach(page => {
      console.log(` - ${page.pageId}: ${page.title} (${page.slug})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding International Students pages:', error);
    process.exit(1);
  }
};

// Run seed
seedInternationalStudents();