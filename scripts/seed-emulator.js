
const PROJECT_ID = 'stm-indexing';
const FIRESTORE_URL = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function addDoc(collection, id, fields) {
    const url = id ? `${FIRESTORE_URL}/${collection}/${id}` : `${FIRESTORE_URL}/${collection}`;
    const method = id ? 'PATCH' : 'POST';

    // Convert simple JS object to Firestore REST format
    const convertValue = (val) => {
        if (typeof val === 'string') return { stringValue: val };
        if (typeof val === 'number') return { integerValue: val.toString() };
        if (typeof val === 'boolean') return { booleanValue: val };
        if (Array.isArray(val)) return { arrayValue: { values: val.map(v => convertValue(v)) } };
        if (typeof val === 'object' && val !== null) {
            if (val instanceof Date) return { timestampValue: val.toISOString() };
            return { mapValue: { fields: Object.fromEntries(Object.entries(val).map(([k, v]) => [k, convertValue(v)])) } };
        }
        return { nullValue: null };
    };

    const body = {
        fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, convertValue(v)]))
    };

    const response = await fetch(url + (id ? '?updateMask.fieldPaths=' + Object.keys(fields).join('&updateMask.fieldPaths=') : ''), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add to ${collection}: ${errorText}`);
    } else {
        console.log(`Successfully added to ${collection}`);
    }
}

async function seed() {
    const tenantId = 'tenant_1';

    // 1. Add User Profile
    await addDoc('users', 'M3V1lL8oRlipFEAhQ9EtrOAyO3qG', {
        email: 'test@example.com',
        role: 'ADMIN',
        tenantId: tenantId,
        displayName: 'Test Admin',
        createdAt: new Date()
    });

    // 2. Add Journals
    const journal1Id = 'journal_001';
    await addDoc('journals', journal1Id, {
        name: 'International Journal of STM Research',
        code: 'IJSR',
        tenantId: tenantId,
        status: 'ACTIVE',
        wordpressUrl: 'https://publications.stmjournals.com',
        issn: '1234-5678'
    });

    const journal2Id = 'journal_002';
    await addDoc('journals', journal2Id, {
        name: 'Advanced Science Intelligence',
        code: 'ASI',
        tenantId: tenantId,
        status: 'ACTIVE',
        wordpressUrl: 'https://science-intel.org',
        issn: '8765-4321'
    });

    // 3. Add Papers
    await addDoc('papers', 'paper_001', {
        title: 'Machine Learning in Academic Indexing',
        authors: ['John Doe', 'Jane Smith'],
        doi: '10.1234/ijsr.2023.001',
        journalId: journal1Id,
        tenantId: tenantId,
        pubDate: new Date('2023-10-15'),
        indexing: {
            scholar: { status: 'INDEXED', url: 'https://scholar.google.com/example1' },
            scopus: { status: 'PENDING' }
        }
    });

    await addDoc('papers', 'paper_002', {
        title: 'Blockchain for Scientific Data Transparency',
        authors: ['Alice Brown'],
        doi: '10.1234/ijsr.2023.002',
        journalId: journal1Id,
        tenantId: tenantId,
        pubDate: new Date('2023-11-20'),
        indexing: {
            scholar: { status: 'NOT_INDEXED' },
            crossref: { status: 'INDEXED' }
        }
    });

    // 4. Add Database Plugins
    await addDoc('database_configs', 'google_scholar', {
        name: 'Google Scholar',
        enabled: true,
        tenantId: tenantId,
        checkFrequency: 'WEEKLY'
    });

    console.log('Seed completed!');
}

seed();
