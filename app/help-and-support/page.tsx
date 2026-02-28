import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Terms of Service - Nitean',
    description:
        'Read the Terms of Service for Nitean — a platform for sharing daily articles, personal experiences, notes, coding insights, and more. Effective February 22, 2026.',

    keywords: ['nitean terms', 'terms of service', 'user agreement', 'platform rules'],

    // Prevent indexing if you really don't want search engines to show this page (usually false for legal pages)
    robots: { index: false, follow: true },

    // Canonical to avoid duplicate content issues
    alternates: {
        canonical: 'https://nitean-web.vercel.app/privacy',
    },

    // Open Graph (Facebook, LinkedIn, Discord, etc.)
    openGraph: {
        title: 'Terms of Service - Nitean',
        description:
            'The official Terms of Service governing use of Nitean — share articles, notes, experiences, and coding insights responsibly.',
        url: 'https://nitean-web.vercel.app/privacy',
        siteName: 'Nitean',
        // Optional: Add an image for rich previews (1200×630 recommended)
        images: [
            {
                url: '/term-of-service.png',
                width: 1200,
                height: 630,
                alt: 'Nitean Terms of Service',
            },
        ],
        locale: 'en_US', // or 'km_KH' if targeting Khmer too
        type: 'website',
    },

    // Twitter/X Cards (falls back to OG, but explicit helps)
    twitter: {
        card: 'summary_large_image',
        title: 'Terms of Service - Nitean',
        description:
            'Read Nitean’s Terms of Service — guidelines for sharing articles, notes, experiences & coding on our platform.',
        images: ['/term-of-service.png'], // same as OG
    },
};

const HelpAndSupport: React.FC = () => {
    return (
        <div className='min-h-screen'>
            <div className='mx-auto max-w-4xl px-4 py-12'>
                <div className="mb-8 flex items-start gap-6">
                    <Link
                        href="/"
                        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-semibold">Terms of Service</h1>
                </div>

                <p className='mb-4'>
                    Welcome to Nitean (the "Service"), a platform for sharing daily articles, experiences, notes, coding insights, and more. These
                    Terms of Service ("Terms") govern your access to and use of https://nitean-web.vercel.app and any related services.
                </p>

                <p className='mb-4'>
                    By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use Nitean.
                </p>

                <p className='mb-4'>We may update these Terms from time to time. Continued use after changes means you accept the updated Terms.</p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>1. Eligibility</h2>
                <p className='mb-4'>
                    You must be at least 13 years old (or the minimum age required in your country) to use the Service. By using Nitean, you confirm
                    that you meet this requirement and have the legal capacity to agree to these Terms.
                </p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>2. User Accounts</h2>
                <p className='mb-4'>
                    Some features (posting articles, commenting, etc.) may require creating an account. You are responsible for keeping your account
                    credentials secure and for all activity under your account.
                </p>
                <p className='mb-4'>You agree to provide accurate information and to update it if it changes.</p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>3. User Content and Conduct</h2>
                <p className='mb-4'>
                    Nitean allows you to post, share, and comment on articles, experiences, notes, and other content ("User Content").
                </p>
                <p className='mb-4'>
                    You retain ownership of your User Content, but by posting it, you grant Nitean a worldwide, non-exclusive, royalty-free license to
                    host, display, distribute, and promote your content on the Service (including in search results, feeds, and related features).
                </p>

                <p className='mb-4'>You agree not to post content that:</p>
                <ul className='mb-4 ml-6 list-disc'>
                    <li>Violates any law or infringes third-party rights (copyright, trademark, privacy, etc.)</li>
                    <li>Is spam, misleading, fraudulent, or contains malware</li>
                    <li>Promotes hate speech, violence, harassment, discrimination, or illegal activities</li>
                    <li>Contains adult material unless clearly marked and appropriate for the context</li>
                    <li>Impersonates others or misrepresents your identity</li>
                </ul>

                <p className='mb-4'>
                    We may (but are not obligated to) review, moderate, remove, or disable access to any User Content that violates these Terms.
                </p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>4. Intellectual Property</h2>
                <p className='mb-4'>
                    The Service (design, code, logos, text not provided by users) is owned by Nitean or its licensors and protected by copyright and
                    other laws.
                </p>
                <p className='mb-4'>You may not copy, modify, distribute, sell, or reverse-engineer any part of the Service without permission.</p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>5. Prohibited Activities</h2>
                <ul className='mb-4 ml-6 list-disc'>
                    <li>Scraping, crawling, or data mining the Service without permission</li>
                    <li>Interfering with the Service or other users (DDoS, hacking attempts, etc.)</li>
                    <li>Using bots or automated means to post or interact excessively</li>
                    <li>Commercial use of the Service without our written permission (e.g., reselling access or content)</li>
                </ul>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>6. Termination</h2>
                <p className='mb-4'>
                    We may suspend or terminate your access at any time, with or without cause, especially for violations of these Terms.
                </p>
                <p className='mb-4'>You may stop using the Service at any time.</p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>7. Disclaimers and Limitation of Liability</h2>
                <p className='mb-4'>
                    The Service is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, or availability of
                    content.
                </p>
                <p className='mb-4'>
                    To the fullest extent permitted by law, Nitean shall not be liable for indirect, incidental, consequential, or punitive damages
                    arising from your use of the Service.
                </p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>8. Indemnification</h2>
                <p className='mb-4'>
                    You agree to indemnify and hold Nitean harmless from any claims, losses, or damages arising from your User Content, violation of
                    these Terms, or misuse of the Service.
                </p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>9. Governing Law</h2>
                <p className='mb-4'>
                    These Terms are governed by the laws of Cambodia (or your applicable jurisdiction if mandatory consumer protections apply).
                </p>

                <h2 className='mt-8 mb-4 text-2xl font-semibold'>10. Changes to the Terms</h2>
                <p className='mb-4'>We may revise these Terms at any time. We will post the updated version here with the effective date.</p>

                <p className='mt-8'>
                    <strong>Last updated:</strong> February 22, 2026
                </p>
                {/* 
            <p className='mt-4'>
            If you have questions about these Terms, contact us at [your email address].
            </p> */}
            </div>
        </div>
    );
};

export default HelpAndSupport;
