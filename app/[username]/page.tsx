import React from 'react';
import ProfilePage from './profile';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) notFound();
  
  return (
    <div>
      <ProfilePage user={user} />
    </div>
  );
};

export default page;
