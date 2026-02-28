import { redirect } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = await params;
    redirect(`/${username}/posts`);
}

export default page;