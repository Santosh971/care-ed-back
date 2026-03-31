import Page from '../models/Page.js';

const legalPagesData = [
  {
    pageId: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'Your privacy is important to us',
    content: `
      <h2>Introduction</h2>
      <p>Care-Ed Learning Center ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>

      <h2>Information We Collect</h2>
      <h3>Personal Information</h3>
      <p>We may collect personal information that you voluntarily provide to us when you:</p>
      <ul>
        <li>Register for our programs or courses</li>
        <li>Fill out contact forms on our website</li>
        <li>Subscribe to our newsletter</li>
        <li>Request information about our services</li>
        <li>Communicate with us via email, phone, or other means</li>
      </ul>
      <p>This information may include your name, email address, phone number, mailing address, educational background, and payment information.</p>

      <h3>Automatically Collected Information</h3>
      <p>When you visit our website, we may automatically collect certain information, including:</p>
      <ul>
        <li>Your IP address and device information</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Pages visited and time spent on pages</li>
        <li>Referring website addresses</li>
      </ul>

      <h2>Cookies and Tracking Technologies</h2>
      <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.</p>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our educational services</li>
        <li>Process your course registrations and payments</li>
        <li>Send you program updates, newsletters, and promotional materials</li>
        <li>Respond to your inquiries and provide customer support</li>
        <li>Analyze website usage to improve user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following situations:</p>
      <ul>
        <li>With service providers who assist us in operating our website and conducting our business</li>
        <li>To comply with legal obligations, court orders, or government requests</li>
        <li>To protect our rights, privacy, safety, or property</li>
        <li>In connection with a merger, acquisition, or sale of assets</li>
      </ul>

      <h2>Data Security</h2>
      <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and receive a copy of your personal data</li>
        <li>Correct inaccurate personal data</li>
        <li>Request deletion of your personal data</li>
        <li>Object to processing of your personal data</li>
        <li>Request restriction of processing</li>
        <li>Request data portability</li>
      </ul>

      <h2>Children's Privacy</h2>
      <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>

      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at:</p>
      <address>
        Care-Ed Learning Center<br>
        100 Prince Edward St Unit #111<br>
        Saint John, NB E2L 4M5<br>
        Email: train@seniorwatch.com<br>
        Phone: (506) 634-8906
      </address>
    `,
    lastUpdated: new Date(),
    isActive: true
  },
  {
    pageId: 'terms-of-service',
    title: 'Terms of Service',
    subtitle: 'Please read these terms carefully',
    content: `
      <h2>Agreement to Terms</h2>
      <p>By accessing or using the Care-Ed Learning Center website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

      <h2>Description of Services</h2>
      <p>Care-Ed Learning Center provides healthcare education and professional training programs, including but not limited to:</p>
      <ul>
        <li>Personal Support Worker (PSW) certification programs</li>
        <li>CPR and First Aid training courses</li>
        <li>Foot Care training programs</li>
        <li>Professional development workshops</li>
        <li>Continuing education courses</li>
      </ul>

      <h2>Registration and Enrollment</h2>
      <h3>Eligibility</h3>
      <p>To enroll in our programs, you must:</p>
      <ul>
        <li>Be at least 18 years of age or have parental/guardian consent</li>
        <li>Provide accurate and complete registration information</li>
        <li>Meet any program-specific prerequisites</li>
        <li>Have the legal capacity to enter into a binding agreement</li>
      </ul>

      <h3>Payment Terms</h3>
      <p>Program fees must be paid in full before the start of the course unless other arrangements have been made. We accept various payment methods including credit cards, debit cards, and electronic transfers. All fees are in Canadian dollars.</p>

      <h2>Cancellation and Refund Policy</h2>
      <h3>Student Cancellation</h3>
      <ul>
        <li>Cancellations made more than 14 days before the course start date will receive a full refund minus a $50 administrative fee</li>
        <li>Cancellations made 7-14 days before the course start date will receive a 50% refund</li>
        <li>Cancellations made less than 7 days before the course start date are non-refundable</li>
        <li>No refunds are provided after the course has started</li>
      </ul>

      <h3>Course Cancellation</h3>
      <p>We reserve the right to cancel or reschedule courses due to insufficient enrollment or unforeseen circumstances. In such cases, students will be offered a full refund or the opportunity to transfer to another session.</p>

      <h2>Academic Policies</h2>
      <h3>Attendance</h3>
      <p>Regular attendance is required for all courses. Students must attend a minimum of 80% of scheduled classes to receive certification. Absences must be reported in advance when possible.</p>

      <h3>Academic Integrity</h3>
      <p>Students are expected to maintain academic integrity throughout their studies. Cheating, plagiarism, or other forms of academic dishonesty may result in disciplinary action, including expulsion without refund.</p>

      <h3>Certification</h3>
      <p>Certificates are issued upon successful completion of all course requirements. Replacement certificates may be obtained for a fee of $25.</p>

      <h2>Intellectual Property</h2>
      <p>All content on our website, including text, graphics, logos, images, and course materials, is the property of Care-Ed Learning Center and is protected by Canadian and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>

      <h2>User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our services for any unlawful purpose</li>
        <li>Submit false or misleading information</li>
        <li>Interfere with or disrupt our services or servers</li>
        <li>Attempt to gain unauthorized access to any portion of our systems</li>
        <li>Harass, abuse, or harm other students or staff</li>
        <li>Violate any applicable laws or regulations</li>
      </ul>

      <h2>Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Care-Ed Learning Center shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from:</p>
      <ul>
        <li>Your use or inability to use our services</li>
        <li>Any conduct or content of any third party</li>
        <li>Any content obtained from our services</li>
        <li>Unauthorized access to your data</li>
      </ul>

      <h2>Indemnification</h2>
      <p>You agree to indemnify, defend, and hold harmless Care-Ed Learning Center and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of our services or violation of these Terms.</p>

      <h2>Privacy</h2>
      <p>Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

      <h2>Modifications to Terms</h2>
      <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.</p>

      <h2>Governing Law</h2>
      <p>These Terms shall be governed by and construed in accordance with the laws of the Province of New Brunswick and the federal laws of Canada, without regard to conflict of law principles.</p>

      <h2>Contact Information</h2>
      <p>For questions about these Terms of Service, please contact us:</p>
      <address>
        Care-Ed Learning Center<br>
        100 Prince Edward St Unit #111<br>
        Saint John, NB E2L 4M5<br>
        Email: train@seniorwatch.com<br>
        Phone: (506) 634-8906
      </address>
    `,
    lastUpdated: new Date(),
    isActive: true
  }
];

// Seed legal pages
const seedLegalPages = async () => {
  console.log('[seedLegalPages] Seeding legal pages...');

  for (const pageData of legalPagesData) {
    try {
      const existingPage = await Page.findOne({ pageId: pageData.pageId });

      if (!existingPage) {
        await Page.create({
          ...pageData,
          sections: [],
          metadata: {
            lastUpdated: new Date()
          }
        });
        console.log(`[seedLegalPages] Created page: ${pageData.pageId}`);
      } else {
        console.log(`[seedLegalPages] Page already exists: ${pageData.pageId}`);
      }
    } catch (error) {
      console.error(`[seedLegalPages] Error creating page ${pageData.pageId}:`, error);
    }
  }

  console.log('[seedLegalPages] Legal pages seeding complete');
};

export default seedLegalPages;