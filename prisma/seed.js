import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function insertInRoles() {
    const data = await prisma.roles.createMany({
        data: [{ role: 'Artist' }, { role: 'Owner' }],
    })

    console.log('Data is inserted in roles table', data)
}

async function insertInCategories() {
    const data = await prisma.categories.createMany({
        data: [
            { category_name: 'Singing' },
            { category_name: 'Dancing' },
            { category_name: 'Videography' },
            { category_name: 'Comedy' },
            { category_name: 'Magic' },
        ],
    })
    console.log('Data is inserted in categories table', data)
}


insertInRoles()
insertInCategories()
