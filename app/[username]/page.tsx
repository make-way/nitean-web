'use client';

import { Oxycons } from '@onimuxha/oxycons';

type ExperienceItemProps = {
  role: string;
  company: string;
  companyLink: string;
  dates: string;
  description: string[];
};

function ExperienceItem({ role, company, companyLink, dates, description }: ExperienceItemProps) {
  return (
    <div className='group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
      {/* Subtle gradient overlay on hover */}
      <div className='absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-950/20' />

      <div className='relative space-y-4'>
        {/* Header */}
        <div className='flex items-start gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-lg font-bold text-white shadow-sm'>
            {company[0]}
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>{role}</h3>
            <div className='mt-1 flex flex-wrap items-center gap-2 text-sm'>
              <a
                href={companyLink}
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
              >
                {company}
              </a>
              <span className='text-gray-400'>•</span>
              <span className='text-gray-600 dark:text-gray-400'>{dates}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className='space-y-2'>
          {description.map((line, i) => (
            <div key={i} className='flex gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
              <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500' />
              <p>{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const socialLinks = [
    {
      label: 'Telegram',
      icon: 'Telegram',
      link: 'https://t.me/rothnak',
      color: 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/30',
    },
    {
      label: 'LinkedIn',
      icon: 'LinkedIn',
      link: 'https://www.linkedin.com/in/rothnak/',
      color: 'hover:bg-blue-50 hover:border-blue-500 dark:hover:bg-blue-950/30',
    },
    {
      label: 'GitHub',
      icon: 'GitHub',
      link: 'https://github.com/rothnak',
      color: 'hover:bg-gray-50 hover:border-gray-400 dark:hover:bg-gray-800',
    },
    {
      label: 'YouTube',
      icon: 'YouTube',
      link: 'https://www.youtube.com/@rothnak',
      color: 'hover:bg-red-50 hover:border-red-400 dark:hover:bg-red-950/30',
    },
    {
      label: 'TikTok',
      icon: 'TikTok',
      link: 'https://www.tiktok.com/@rothnak',
      color: 'hover:bg-gray-50 hover:border-gray-900 dark:hover:bg-gray-800',
    },
    {
      label: 'Facebook',
      icon: 'Facebook',
      link: 'https://www.facebook.com/rothnak',
      color: 'hover:bg-blue-50 hover:border-blue-600 dark:hover:bg-blue-950/30',
    },
    {
      label: 'Instagram',
      icon: 'Instagram',
      link: 'https://www.instagram.com/rothnak',
      color: 'hover:bg-pink-50 hover:border-pink-400 dark:hover:bg-pink-950/30',
    },
  ];

  return (
    <div className='mx-auto max-w-4xl space-y-12'>
      {/* Hero Section */}

      <p className='max-w-3xl text-base leading-relaxed text-gray-700 dark:text-gray-300'>
        I'm a Senior Software Engineer with 6 years of experience in full-stack development, system design, and team leadership. I've worked
        in both local and international environments, including South Korea. I'm also a content creator and host of ITPodcasts, sharing tech
        and career insights on YouTube, TikTok, and Facebook. Let's connect—follow me on social media!
      </p>

      {/* Social Links */}
      <div className='space-y-3'>
        <h2 className='text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>Connect with me</h2>
        <div className='flex flex-wrap gap-3'>
          {socialLinks.map(({ label, icon, link, color }) => (
            <a
              key={label}
              target='_blank'
              href={link}
              rel='noopener noreferrer'
              className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 ${color}`}
            >
              <Oxycons name={icon} size={23} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Experience</h2>
        <div className='space-y-4'>
          <ExperienceItem
            role='Founder, Host, and Content Creator'
            company='ITPodcast'
            companyLink='#'
            dates='2024 - Present'
            description={[
              'I am the Founder and Host of IT Podcast, where I also take on the roles of Content Strategist, Video/Audio Editor, and Social Media Manager.',
              'IT Podcast is dedicated to sharing knowledge and inspiration with young people who are interested in the IT field or dream of becoming IT professionals. The podcast focuses on real experiences from starting at zero to landing a job and building a career with over 5 years of industry experience.',
            ]}
          />

          <ExperienceItem
            role='Senior Software Engineer (Short Term Business Trip)'
            company='Webcash Inc. (Busan S.Korea)'
            companyLink='#'
            dates='2024 - Present'
            description={[
              'Delegated an outsourcing project from the Korea team to the Cambodia team.',
              'Understood assigned responsibilities, technical requirements, and overall workflow.',
              'Created progress reports and delivered weekly presentations.',
            ]}
          />

          <ExperienceItem
            role='Senior Software Engineer'
            company='KOSIGN'
            companyLink='#'
            dates='2017 - Present'
            description={[
              'Led two global projects and one outsourcing project related to web-based accounting systems, with a focus on modules such as Sales, Expenses, Approval, and Banking.',
              'Responsible for analyzing requirements from storyboard to deployment.',
            ]}
          />
        </div>
      </section>
    </div>
  );
}
