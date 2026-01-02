import { defineConfig } from '@prisma/config';

const rawUrl = process.env.DATABASE_URL || '';
const url = rawUrl.startsWith('postgres://')
    ? rawUrl.replace('postgres://', 'postgresql://')
    : rawUrl;

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: url,
    },
});
