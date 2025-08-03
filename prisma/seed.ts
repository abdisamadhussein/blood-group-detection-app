import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bloodscan.com' },
    update: {},
    create: {
      email: 'admin@bloodscan.com',
      name: 'Admin User',
      role: 'admin',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📋 Demo Credentials:')
  console.log('   Email: admin@bloodscan.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('📊 Sample Data Created:')
  console.log('   - 1 Admin user')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 