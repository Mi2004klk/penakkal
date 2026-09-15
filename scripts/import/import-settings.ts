import { prisma } from '../../src/lib/content/prisma';
import * as argon2 from "@node-rs/argon2";

async function main() {
  console.log('Seeding initial settings and admin user...');

  // Seed OWNER user
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@penakkal.com';
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'password123'; // Development default
  
  const passwordHash = await argon2.hash(password);

  const owner = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Site Owner',
      passwordHash,
      role: 'OWNER',
    },
  });

  console.log(`Created OWNER user: ${owner.email}`);

  // Seed basic settings
  const defaultSettings = [
    { key: 'siteName', group: 'siteIdentity', value: 'பேனாக்கள்' },
    { key: 'siteDescription', group: 'siteIdentity', value: 'தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ' },
    { key: 'contactEmail', group: 'contact', value: 'contact@penakkal.com' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: {
        key: s.key,
        group: s.group,
        value: s.value,
        updatedById: owner.id,
      },
    });
  }

  console.log('Finished seeding settings.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
