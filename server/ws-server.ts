import { WebSocketServer, WebSocket } from 'ws';
import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
    }),
});
const PORT = Number(process.env.WS_PORT) || 3001;

const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 WebSocket server started on port ${PORT}`);

// Keep track of online users
const onlineUsers = new Map<string, WebSocket>();

wss.on('connection', (ws, req) => {
    let currentUserId: string | null = null;

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data.toString());

            if (message.type === 'AUTH') {
                const userId = message.userId;
                if (userId) {
                    currentUserId = userId;
                    onlineUsers.set(userId, ws);
                    console.log(`👤 User connected: ${userId}`);
                    
                    // Mark user as online in database
                    await prisma.user.update({
                        where: { id: userId },
                        data: { lastSeen: new Date() }
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error handling message:', error);
        }
    });

    // Send a heartbeat every 30 seconds
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    ws.on('close', () => {
        clearInterval(interval);
        if (currentUserId) {
            onlineUsers.delete(currentUserId);
            console.log(`👋 User disconnected: ${currentUserId}`);
        }
    });

    ws.on('pong', async () => {
        if (currentUserId) {
            // Update last seen on every pong to keep them "online"
            await prisma.user.update({
                where: { id: currentUserId },
                data: { lastSeen: new Date() }
            });
        }
    });

    ws.on('error', (error) => {
        console.error('🔌 WebSocket error:', error);
    });
});

process.on('SIGTERM', () => {
    wss.close(() => {
        prisma.$disconnect();
        process.exit(0);
    });
});
