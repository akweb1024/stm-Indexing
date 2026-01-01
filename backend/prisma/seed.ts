import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const tenantId = 'tenant_1';

    // 1. Create Users
    const roles = ['JOURNAL_MANAGER', 'EDITOR', 'AUDITOR', 'USER'];

    // Create 3 Admins
    for (let i = 1; i <= 3; i++) {
        await prisma.user.upsert({
            where: { email: `admin.${i}@test.com` },
            update: {},
            create: {
                email: `admin.${i}@test.com`,
                password: 'password123',
                displayName: `Admin ${i}`,
                role: 'ADMIN',
                tenantId: tenantId,
            },
        });
    }

    // Create 10 users for each other role
    for (const role of roles) {
        for (let i = 1; i <= 10; i++) {
            const roleName = role.toLowerCase().replace('_', '');
            await prisma.user.upsert({
                where: { email: `${roleName}.${i}@test.com` },
                update: {},
                create: {
                    email: `${roleName}.${i}@test.com`,
                    password: 'password123',
                    displayName: `${role.replace('_', ' ')} ${i}`,
                    role: role,
                    tenantId: tenantId,
                },
            });
        }
    }

    // 2. Create Journals
    const journal1 = await prisma.journal.upsert({
        where: { id: 'journal-1' },
        update: {},
        create: {
            id: 'journal-1',
            name: 'International Journal of STM Research',
            code: 'IJSR',
            tenantId: tenantId,
            status: 'ACTIVE',
            wordpressUrl: 'https://journal-example.com',
            issn: '1234-5678',
        },
    });

    const journal2 = await prisma.journal.upsert({
        where: { id: 'journal-2' },
        update: {},
        create: {
            id: 'journal-2',
            name: 'Advanced Science Intelligence',
            code: 'ASI',
            tenantId: tenantId,
            status: 'ACTIVE',
            wordpressUrl: 'https://science-intel.org',
            issn: '8765-4321',
        },
    });

    // 3. Create Papers
    await prisma.paper.upsert({
        where: { doi: '10.1234/ijsr.2023.001' },
        update: {},
        create: {
            title: 'Machine Learning in Academic Indexing',
            authors: 'John Doe,Jane Smith',
            doi: '10.1234/ijsr.2023.001',
            journalId: journal1.id,
            tenantId: tenantId,
            pubDate: new Date('2023-10-15'),
            indexingStatus: 'INDEXED',
            scholarUrl: 'https://scholar.google.com/example1',
        },
    });

    await prisma.paper.upsert({
        where: { doi: '10.1234/ijsr.2023.002' },
        update: {},
        create: {
            title: 'Blockchain for Scientific Data Transparency',
            authors: 'Alice Brown',
            doi: '10.1234/ijsr.2023.002',
            journalId: journal1.id,
            tenantId: tenantId,
            pubDate: new Date('2023-11-20'),
            indexingStatus: 'NOT_INDEXED',
        },
    });

    // 4. Create Database Configurations
    const db1 = await prisma.databaseConfig.upsert({
        where: { id: 'db-scopus' },
        update: {},
        create: {
            id: 'db-scopus',
            name: 'Scopus',
            enabled: true,
            tenantId: tenantId,
            checkFrequency: 'MONTHLY'
        }
    });

    const db2 = await prisma.databaseConfig.upsert({
        where: { id: 'db-pubmed' },
        update: {},
        create: {
            id: 'db-pubmed',
            name: 'PubMed',
            enabled: true,
            tenantId: tenantId,
            checkFrequency: 'WEEKLY'
        }
    });

    const db3 = await prisma.databaseConfig.upsert({
        where: { id: 'db-doaj' },
        update: {},
        create: {
            id: 'db-doaj',
            name: 'DOAJ',
            enabled: true,
            tenantId: tenantId,
            checkFrequency: 'QUARTERLY'
        }
    });

    // 5. Create some initial applications
    await prisma.databaseApplication.upsert({
        where: { journalId_databaseConfigId: { journalId: journal1.id, databaseConfigId: db1.id } },
        update: {},
        create: {
            journalId: journal1.id,
            databaseConfigId: db1.id,
            status: 'UNDER_REVIEW',
            tenantId: tenantId,
            notes: 'Submitted in Sep 2023'
        }
    });

    await prisma.databaseApplication.upsert({
        where: { journalId_databaseConfigId: { journalId: journal1.id, databaseConfigId: db3.id } },
        update: {},
        create: {
            journalId: journal1.id,
            databaseConfigId: db3.id,
            status: 'ACCEPTED',
            tenantId: tenantId,
            notes: 'Indexed since Jan 2022'
        }
    });

    // 6. Create Reviewers
    await prisma.reviewer.upsert({
        where: { email: 'dr_miller@uni-heidelberg.de' },
        update: {},
        create: {
            firstName: 'Sarah',
            lastName: 'Miller',
            email: 'dr_miller@uni-heidelberg.de',
            institution: 'University of Heidelberg',
            expertise: 'Machine Learning, Neural Networks, AI ethics',
            tenantId: tenantId
        }
    });

    await prisma.reviewer.upsert({
        where: { email: 'p_chen@techinst.edu' },
        update: {},
        create: {
            firstName: 'Peter',
            lastName: 'Chen',
            email: 'p_chen@techinst.edu',
            institution: 'Technical Institute of Engineering',
            expertise: 'Blockchain, Distributed Systems, Cryptography',
            tenantId: tenantId
        }
    });

    await prisma.reviewer.upsert({
        where: { email: 'a_wilson@geoscience.org' },
        update: {},
        create: {
            firstName: 'Alice',
            lastName: 'Wilson',
            email: 'a_wilson@geoscience.org',
            institution: 'Global Geoscience Center',
            expertise: 'Environmental Science, Decarbonization, Climate Change',
            tenantId: tenantId
        }
    });

    console.log('Local database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
