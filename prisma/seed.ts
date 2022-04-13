import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { group } from "console";

let prisma = new PrismaClient()
const users = prisma.user;
const permissions = prisma.permission;
const groups = prisma.group;

const createPermissions = () => permissions.createMany({
    data: [
        {
            name: 'Create user'
        },
        {
            name: 'Delete user'
        },
        {
            name: 'Search user'
        },
        {
            name: 'Modify user'
        },
        {
            name: 'Search book'
        },
        {
            name: 'Add book title'
        },
        {
            name: 'Add book'
        },
        {
            name: 'Update book title'
        },
        {
            name: 'Update book'
        },
        {
            name: 'Delete book title'
        },
        {
            name: 'Delete book'
        },
        {
            name: 'Search borrower'
        },
        {
            name: 'Add borrower'
        },
        {
            name: 'Delete borrwer'
        },
        {
            name: 'Update borrower'
        },
        {
            name: 'Notify overdue book borrowing'
        },
        {
            name: 'Confirm borrowing registation'
        },
        {
            name: 'Signup reader account'
        },
        {
            name: 'Add book to cart'
        },
        {
            name: 'Register to borrow books'
        },
        {
            name: 'Check book borrowing status'
        },
    ]
})

createPermissions().then(permissions => {
    createAdminGroup().then(() => {
        createManagerGroup().then(() => {
            createLibrarianGroup().then(() => {
                createReaderGroup().then(() => {
                    hash("datngo123", 10).then(val => {
                        users.create({
                            data: {
                                username: 'admin',
                                password: val,
                                groups: {
                                    create: { name: '_admin' }
                                }
                            }
                        }).then(val => {
                            console.log(val)

                        })
                    })
                })
            })
        })
    })
})

const createAdminGroup = () => groups.create({
    data: {
        name: 'admin',
        permissions: {
            connect: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 },
                { id: 11 },
                { id: 12 },
                { id: 13 },
                { id: 14 },
                { id: 15 },
                { id: 16 },
                { id: 17 },
                { id: 18 },
                { id: 19 },
                { id: 20 },
                { id: 21 },
            ]
        }
    }
})

const createManagerGroup = () => groups.create({
    data: {
        name: 'manager',
        permissions: {
            connect: [
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 },
                { id: 11 },
            ]
        }
    }
})

const createLibrarianGroup = () => groups.create({
    data: {
        name: 'librarian',
        permissions: {
            connect: [
                { id: 5 },
                { id: 12 },
                { id: 13 },
                { id: 14 },
                { id: 15 },
                { id: 16 },
                { id: 17 },
            ]
        }
    }
})

const createReaderGroup = () => groups.create({
    data: {
        name: 'reader',
        permissions: {
            connect: [
                { id: 5 },
                { id: 18 },
                { id: 19 },
                { id: 20 },
                { id: 21 },
            ]
        }
    }
})

