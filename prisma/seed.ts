import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const user = await prisma.user.create({
    data: {
      email: 'demo@pargochest.com',
      name: 'Demo User',
      password: 'demo123', // In production, this should be hashed
    },
  });

  console.log('✅ Created demo user:', user.email);

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Tutorials',
        description: 'Educational and tutorial videos',
        color: '#3B82F6',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        description: 'Fun and entertaining content',
        color: '#EF4444',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Music',
        description: 'Music videos and performances',
        color: '#8B5CF6',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.length);

  const video = await prisma.video.create({
    data: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Sample Tutorial Video',
      description: 'A great tutorial on web development',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: 600,
      channel: 'Tech Channel',
      channelUrl: 'https://youtube.com/channel/example',
      watchStatus: 'IN_PROGRESS',
      watchProgress: 120,
      isFavorite: true,
      tags: ['javascript', 'tutorial', 'webdev'],
      userId: user.id,
      categoryId: categories[0].id,
      notes: {
        create: [
          {
            content: 'Important: Remember to use async/await properly',
            timestamp: 45,
          },
          {
            content: 'Great explanation of closures at this point',
            timestamp: 180,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample video with notes');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
