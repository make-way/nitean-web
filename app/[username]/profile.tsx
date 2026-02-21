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
import { TProfileUser } from '@/types';

type SocialKeys =
  | "telegram_link"
  | "linkedin_link"
  | "github_link"
  | "youtube_link"
  | "tiktok_link"
  | "facebook_link";

export default function ProfilePage({user} : {user: TProfileUser}) {
// const socials = [
//   { name: 'Telegram', icon: TelegramLogoIcon, key: 'telegram_link' },
//   { name: 'LinkedIn', icon: LinkedinLogoIcon, key: 'linkedin_link' },
//   { name: 'GitHub', icon: GithubLogoIcon, key: 'github_link' },
//   { name: 'YouTube', icon: YoutubeLogoIcon, key: 'youtube_link' },
//   { name: 'TikTok', icon: TiktokLogoIcon, key: 'tiktok_link' },
//   { name: 'Facebook', icon: FacebookLogoIcon, key: 'facebook_link' },
// ];
const socials: {
  name: string;
  icon: any;
  key: SocialKeys;
}[] = [
  { name: 'Telegram', icon: TelegramLogoIcon, key: 'telegram_link' },
  { name: 'LinkedIn', icon: LinkedinLogoIcon, key: 'linkedin_link' },
  { name: 'GitHub', icon: GithubLogoIcon, key: 'github_link' },
  { name: 'YouTube', icon: YoutubeLogoIcon, key: 'youtube_link' },
  { name: 'TikTok', icon: TiktokLogoIcon, key: 'tiktok_link' },
  { name: 'Facebook', icon: FacebookLogoIcon, key: 'facebook_link' },
];

  return (
    <div className='mx-auto mt-10 max-w-3xl space-y-8'>
      {/* Bio */}
      <p className='leading-relaxed text-gray-700 dark:text-gray-300'>{user.bio ?? "No Bio of this user."}</p>

      <h1 className='text-2xl font-bold uppercase text-gray-700 dark:text-gray-300'>social media</h1>
      {/* Social Buttons */}
      <div className="flex flex-wrap gap-3">
  {socials.map((s, i) => {
    const Icon = s.icon;
    const link = user?.[s.key];

    if (!link) return null;

    return (
      <a key={i} href={link} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-sm border-blue-500 text-blue-600 shadow hover:bg-blue-50 cursor-pointer"
        >
          <Icon className="h-4 w-4" />
          {s.name}
        </Button>
      </a>
    );
  })}
</div>

      <h2 className='text-2xl font-bold uppercase text-gray-700 dark:text-gray-300'>Experience</h2>
      {/* Experience Card */}
      <Card className='rounded-sm border py-0 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-sm bg-blue-100'>
              <span className='font-medium text-blue-500'>MS</span>
            </div>

            <div className='space-y-1'>
              <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>Mangrove Studio</h3>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-blue-600'>Junior Full Stack Developer</span>
                <Badge variant='secondary' className='text-gray-700 dark:text-gray-300'>Jul 2025 - Present</Badge>
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
              <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>Software Engineer Intern</h3>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-blue-600'>NiyAi Data Co, Ltd</span>
                <Badge variant='secondary' className='text-gray-700 dark:text-gray-300'>Aug 2024 - Nov 2024</Badge>
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
