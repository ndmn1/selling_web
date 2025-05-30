/* eslint-disable @typescript-eslint/no-unused-vars */


import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Nike Air Max 270',
      brand: 'Nike',
      mainImage: 'https://example.com/nike-air-max-270.jpg',
      price: 150.00,
      discount: 20,
      description: 'The Nike Air Max 270 delivers visible cushioning under every step with a large window and fresh color.',
      images: [
        'https://example.com/nike-air-max-270-1.jpg',
        'https://example.com/nike-air-max-270-2.jpg',
      ],
      sizes: [
        { size: 'US 7', stock: 10 },
        { size: 'US 8', stock: 15 },
        { size: 'US 9', stock: 20 },
        { size: 'US 10', stock: 15 },
      ],
    },
    {
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      mainImage: 'https://example.com/adidas-ultraboost-22.jpg',
      price: 180.00,
      discount: 20,
      description: 'The Ultraboost 22 features a responsive Boost midsole and a Primeknit+ upper that adapts to your foot.',
      images: [
        'https://example.com/adidas-ultraboost-22-1.jpg',
        'https://example.com/adidas-ultraboost-22-2.jpg',
      ],
      sizes: [
        { size: 'US 7', stock: 8 },
        { size: 'US 8', stock: 12 },
        { size: 'US 9', stock: 15 },
        { size: 'US 10', stock: 10 },
      ],
    },
    {
      name: 'New Balance 574',
      brand: 'New Balance',
      mainImage: 'https://example.com/new-balance-574.jpg',
      price: 100.00,
      discount: 20,
      description: 'The New Balance 574 combines classic style with modern comfort.',
      images: [
        'https://picsum.photos/200',
        'https://picsum.photos/200',
      ],
      sizes: [
        { size: 'US 7', stock: 5 },
        { size: 'US 8', stock: 8 },
        { size: 'US 9', stock: 10 },
        { size: 'US 10', stock: 7 },
      ],
    },
  ]

  for (const productData of products) {
    const { sizes, ...productInfo } = productData
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        sizes: {
          create: sizes,
        },
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 