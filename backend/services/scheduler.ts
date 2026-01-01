import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { verifyGoogleScholarIndexing } from './scholarVerifier';

const prisma = new PrismaClient();

// Schedule: Run every day at 2 AM
const DAILY_SCHEDULE = '0 2 * * *';

// Schedule: Run every Monday at 3 AM
const WEEKLY_SCHEDULE = '0 3 * * 1';

export const startScheduledTasks = () => {
    console.log('🕐 Starting scheduled tasks...');

    // Daily: Verify papers that haven't been checked in 7 days
    cron.schedule(DAILY_SCHEDULE, async () => {
        console.log('📅 Running daily Google Scholar verification...');
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const papersToVerify = await prisma.paper.findMany({
                where: {
                    OR: [
                        { indexingStatus: 'NOT_INDEXED' },
                        {
                            updatedAt: { lt: sevenDaysAgo },
                            indexingStatus: { not: 'INDEXED' }
                        }
                    ]
                },
                take: 50 // Limit to avoid rate limiting
            });

            console.log(`Found ${papersToVerify.length} papers to verify`);

            for (const paper of papersToVerify) {
                try {
                    await verifyGoogleScholarIndexing(paper.id);
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`Failed to verify paper ${paper.id}:`, error);
                }
            }

            console.log('✅ Daily verification completed');
        } catch (error) {
            console.error('❌ Daily verification failed:', error);
        }
    });

    // Weekly: Generate analytics reports
    cron.schedule(WEEKLY_SCHEDULE, async () => {
        console.log('📊 Running weekly analytics generation...');
        try {
            const journals = await prisma.journal.findMany();

            for (const journal of journals) {
                const papers = await prisma.paper.findMany({
                    where: { journalId: journal.id }
                });

                const indexedCount = papers.filter(p => p.indexingStatus === 'INDEXED').length;
                const indexingRate = papers.length > 0 ? (indexedCount / papers.length) * 100 : 0;

                console.log(`Journal ${journal.name}: ${indexingRate.toFixed(1)}% indexed`);
            }

            console.log('✅ Weekly analytics completed');
        } catch (error) {
            console.error('❌ Weekly analytics failed:', error);
        }
    });

    // Manual trigger for testing (every minute in development)
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Manual triggers available');
    }

    console.log('✅ Scheduled tasks initialized');
};

// Manual trigger function for testing
export const triggerManualVerification = async () => {
    console.log('🔄 Manual verification triggered');

    const papers = await prisma.paper.findMany({
        where: { indexingStatus: 'NOT_INDEXED' },
        take: 5
    });

    for (const paper of papers) {
        try {
            await verifyGoogleScholarIndexing(paper.id);
        } catch (error) {
            console.error(`Failed to verify ${paper.id}:`, error);
        }
    }

    return { verified: papers.length };
};
