'use server';

import { getAllMembers } from '../services/member';

/**
 * Action: Fetch all members for the UI.
 */
export async function getAllMembersAction() {
  try {
    const members = await getAllMembers();
    return { 
      success: true, 
      data: members.map((member, index) => ({
        id: index + 1, // Display rank/index
        dbId: member.id,
        name: member.name,
        username: member.username,
        avatar: member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
        posts: member._count.posts,
        followers: 0, // Placeholder for now as it's not in schema
        createdAt: member.createdAt,
      })) 
    };
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return { success: false, message: 'Failed to fetch members' };
  }
}
