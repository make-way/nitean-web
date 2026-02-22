import Header from '@/components/Header';
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='mx-auto max-w-4xl px-4 py-12'>
        <h1 className='mb-6 text-4xl font-bold'>Privacy Policy</h1>

        <p className='mb-4'>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our
          website built with Next.js, Tailwind CSS, and TypeScript (the "Service").
        </p>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Information We Collect</h2>
        <p className='mb-4'>We may collect the following types of information:</p>
        <ul className='mb-4 ml-6 list-disc'>
          <li>Personal information you provide, such as name and email.</li>
          <li>Non-personal information, such as browser type, device, and usage data.</li>
          <li>Cookies and tracking technologies to improve user experience.</li>
        </ul>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>How We Use Your Information</h2>
        <p className='mb-4'>We use the collected information to:</p>
        <ul className='mb-4 ml-6 list-disc'>
          <li>Provide and maintain our Service.</li>
          <li>Improve, personalize, and enhance user experience.</li>
          <li>Communicate with you, including sending updates and newsletters.</li>
          <li>Analyze usage and trends to optimize our website.</li>
        </ul>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Cookies</h2>
        <p className='mb-4'>
          Our website uses cookies to improve your experience. You can choose to disable cookies in your browser settings, but some features
          may not function properly.
        </p>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Third-Party Services</h2>
        <p className='mb-4'>
          We may use third-party services (e.g., analytics, payment processors) that collect information to help us improve our Service.
          These services have their own privacy policies.
        </p>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Data Security</h2>
        <p className='mb-4'>
          We implement reasonable security measures to protect your information. However, no method of transmission or storage is 100%
          secure, and we cannot guarantee absolute security.
        </p>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Your Rights</h2>
        <p className='mb-4'>Depending on your location, you may have the right to:</p>
        <ul className='mb-4 ml-6 list-disc'>
          <li>Access the information we hold about you.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Withdraw consent where applicable.</li>
        </ul>

        <h2 className='mt-8 mb-4 text-2xl font-semibold'>Changes to This Privacy Policy</h2>
        <p className='mb-4'>
          We may update this Privacy Policy from time to time. Updates will be posted on this page with the date of the last revision.
        </p>

        <p className='mt-8'>
          <strong>Last updated:</strong> February 22, 2026
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
