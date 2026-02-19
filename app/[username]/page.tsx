'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FacebookLogoIcon,
  TelegramLogoIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  YoutubeLogoIcon,
  TiktokLogoIcon,
} from '@phosphor-icons/react';

export default function ProfilePage() {
  const socials = [
    { name: 'Telegram', icon: TelegramLogoIcon },
    { name: 'LinkedIn', icon: LinkedinLogoIcon },
    { name: 'GitHub', icon: GithubLogoIcon },
    { name: 'YouTube', icon: YoutubeLogoIcon },
    { name: 'TikTok', icon: TiktokLogoIcon },
    { name: 'Facebook', icon: FacebookLogoIcon },
  ];

  return (
    <div className='mx-auto mt-10 max-w-3xl space-y-8'>
      {/* Bio */}
      <p className='leading-relaxed text-gray-700'>I am a student at Computer Science. Currently explore on Java (Java Spring boot)</p>

      <h1 className='text-2xl font-bold uppercase'>social media</h1>
      {/* Social Buttons */}
      <div className='flex flex-wrap gap-3'>
        {socials.map((s, i) => {
          const Icon = s.icon;
          return (
            <Button
              key={i}
              variant='outline'
              className='flex cursor-pointer items-center gap-2 rounded-sm border-blue-500 text-blue-600 shadow hover:bg-blue-50'
            >
              <Icon className='h-4 w-4' />
              {s.name}
            </Button>
          );
        })}
      </div>

      <h2 className='text-2xl font-bold uppercase'>Experience</h2>
      {/* Experience Card */}
      <Card className='rounded-sm border py-0 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-sm bg-blue-100'>
              <span className='font-medium text-blue-500'>MS</span>
            </div>

            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>Mangrove Studio</h3>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-blue-600'>Junior Full Stack Developer</span>
                <Badge variant='secondary'>Jul 2025 - Present</Badge>
              </div>
            </div>
          </div>

          <p className='leading-relaxed text-gray-600'>
            Maintain, monitor, and optimize web applications to ensure high availability, performance, and a smooth user experience Refactor
            and modernize legacy websites and systems based on design specifications, business needs, and user requirements Design, develop,
            and maintain scalable web systems and internal tools using modern technologies Build and integrate RESTful APIs and backend
            services to support frontend Manage server environments, deployments, and configurations Monitor application logs, performance,
            and errors; troubleshoot and resolve production issues
          </p>
        </CardContent>
      </Card>
      <Card className='rounded-sm border py-0 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-sm bg-blue-100'>
              <span className='font-medium text-blue-500'>N</span>
            </div>

            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>Software Engineer Intern</h3>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-blue-600'>NiyAi Data Co, Ltd</span>
                <Badge variant='secondary'>Aug 2024 - Nov 2024</Badge>
              </div>
            </div>
          </div>

          <p className='leading-relaxed text-gray-600'>
            - Develop application in full stack 
            - Smoke test with Laravel Dusk - Scraping data from open source website for dictionary by
            using Python and some useful framework of Python - Convert images text to text by OCR with Python - Testing the Web Speech API
            in Khmer - Use GPT and service API to help reviewing and managing content to make sure it's appropriate and follows the rules. -
            Analyze and implement the Database table structure based on Business Requirement Documents - Doing load testing with JMeter -
            Learning and research Flutter for mobile app
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
