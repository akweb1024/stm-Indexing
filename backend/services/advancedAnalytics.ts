import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AdvancedAnalytics {
    overview: {
        totalPapers: number;
        indexedPapers: number;
        indexingTrend: number; // percentage change from last period
        avgTimeToIndex: number; // days
    };
    citationMetrics: {
        totalCitations: number; // simulated
        hIndex: number; // simulated
        i10Index: number; // simulated
        avgCitationsPerPaper: number;
    };
    indexingTrends: {
        month: string;
        indexed: number;
        notIndexed: number;
    }[];
    topPapers: {
        id: string;
        title: string;
        citations: number; // simulated
        indexingStatus: string;
    }[];
    databaseCoverage: {
        name: string;
        journalsIndexed: number;
        totalJournals: number;
        coverage: number;
    }[];
}

export const getAdvancedAnalytics = async (tenantId: string): Promise<AdvancedAnalytics> => {
    // Fetch all papers for the tenant
    const papers = await prisma.paper.findMany({
        where: { tenantId },
        orderBy: { pubDate: 'desc' }
    });

    const journals = await prisma.journal.findMany({
        where: { tenantId }
    });

    const totalPapers = papers.length;
    const indexedPapers = papers.filter(p => p.indexingStatus === 'INDEXED').length;

    // Simulate citation data (in production, fetch from external APIs)
    const simulatedCitations = papers.map(p => Math.floor(Math.random() * 50));
    const totalCitations = simulatedCitations.reduce((a, b) => a + b, 0);

    // H-index calculation (simplified simulation)
    const sortedCitations = simulatedCitations.sort((a, b) => b - a);
    let hIndex = 0;
    for (let i = 0; i < sortedCitations.length; i++) {
        if (sortedCitations[i] >= i + 1) {
            hIndex = i + 1;
        } else {
            break;
        }
    }

    // i10-index (papers with at least 10 citations)
    const i10Index = simulatedCitations.filter(c => c >= 10).length;

    // Indexing trends (last 6 months)
    const trends = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        const monthPapers = papers.filter(p => {
            const pDate = new Date(p.createdAt);
            return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
        });

        trends.push({
            month: monthName,
            indexed: monthPapers.filter(p => p.indexingStatus === 'INDEXED').length,
            notIndexed: monthPapers.filter(p => p.indexingStatus !== 'INDEXED').length
        });
    }

    // Top papers by citations (simulated)
    const topPapers = papers.slice(0, 5).map((p, i) => ({
        id: p.id,
        title: p.title,
        citations: simulatedCitations[i] || 0,
        indexingStatus: p.indexingStatus
    })).sort((a, b) => b.citations - a.citations);

    // Database coverage
    const databases = await prisma.databaseConfig.findMany({
        where: { tenantId }
    });

    const databaseCoverage = await Promise.all(databases.map(async (db) => {
        const applications = await prisma.databaseApplication.findMany({
            where: {
                databaseConfigId: db.id,
                status: 'ACCEPTED'
            }
        });

        return {
            name: db.name,
            journalsIndexed: applications.length,
            totalJournals: journals.length,
            coverage: journals.length > 0 ? (applications.length / journals.length) * 100 : 0
        };
    }));

    return {
        overview: {
            totalPapers,
            indexedPapers,
            indexingTrend: totalPapers > 0 ? ((indexedPapers / totalPapers) * 100) : 0,
            avgTimeToIndex: 7 // simulated
        },
        citationMetrics: {
            totalCitations,
            hIndex,
            i10Index,
            avgCitationsPerPaper: totalPapers > 0 ? totalCitations / totalPapers : 0
        },
        indexingTrends: trends,
        topPapers,
        databaseCoverage
    };
};
