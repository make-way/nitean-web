import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { generateUniqueUsername } from "@/utils/enerateUsername";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }), 
  plugins: [],  
  user: {
		additionalFields: {
			username: {
				type: "string",
				required: true,
				input: false,
			},
			phone_number: {
				type: "string",
				required: false,
				input: true,
			},
			bio: {
				type: "string",
				required: false,
				input: true,
			},
			telegram_link: {
				type: "string",
				required: false,
				input: true,
			},
			linkedin_link: {
				type: "string",
				required: false,
				input: true,
			},
			github_link: {
				type: "string",
				required: false,
				input: true,
			},
			youtube_link: {
				type: "string",
				required: false,
				input: true,
			},
			tiktok_link: {
				type: "string",
				required: false,
				input: true,
			},
			facebook_link: {
				type: "string",
				required: false,
				input: true,
			},
		},
	},
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
				return {
					username: profile.login,
				};
			},
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async (profile) => {
					 const base = profile.given_name || profile.name || profile.email.split("@")[0];
					 const username = await generateUniqueUsername(base);
          return { username };
			},
    },
  },
});
