import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Recommendation {
    reviewerId: string;
    firstName: string;
    lastName: string;
    email: string;
    institution: string | null;
    score: number;
    matchedKeywords: string[];
    expertise: string;
}

export const recommendReviewers = async (paperId: string) => {
    // 1. Fetch paper details
    const paper = await prisma.paper.findUnique({
        where: { id: paperId }
    });

    if (!paper) {
        throw new Error('Paper not found');
    }

    // 2. Fetch all reviewers
    const reviewers = await prisma.reviewer.findMany();

    // 3. Simple matching algorithm
    // We'll normalize text and count keyword overlaps between paper title/authors and reviewer expertise
    const paperText = (paper.title + ' ' + paper.authors).toLowerCase();

    const recommendations: Recommendation[] = reviewers.map((reviewer) => {
        const expertiseKeywords = reviewer.expertise.toLowerCase().split(',').map(k => k.trim());
        const matchedKeywords: string[] = [];
        let score = 0;

        expertiseKeywords.forEach(keyword => {
            if (paperText.includes(keyword)) {
                score += 10; // Basic keyword match
                matchedKeywords.push(keyword);
            }

            // Bonus: Check for partial matches or semantic bits
            // In a real app, you'd use TF-IDF or vector embeddings
        });

        // Add some weight for rating
        score += reviewer.rating * 2;

        return {
            reviewerId: reviewer.id,
            firstName: reviewer.firstName,
            lastName: reviewer.lastName,
            email: reviewer.email,
            institution: reviewer.institution,
            score: Math.round(score),
            matchedKeywords,
            expertise: reviewer.expertise
        };
    });

    // 4. Sort by score descending
    return recommendations
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Return top 5
};
