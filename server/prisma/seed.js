import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database with dummy user...')
    
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            id: 'user_1',
            name: 'Abhimanyu Prabhakar',
            email: 'test@example.com',
            image: 'https://i.pravatar.cc/150',
        },
    })
    
    console.log({ user })
    console.log('Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
