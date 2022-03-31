import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

let prisma = new PrismaClient()
const users = prisma.user;
const roles = prisma.role;

roles.createMany({
    data: [
        { name: 'superAdmin' },
        { name: 'admin' },
        { name: 'manager' },
        { name: 'librarian' },
        { name: 'user' },
    ]
}).then((roles) => {  
    hash("datngo123", 10).then((val) => {
        users.create({
            data: {
                username: 'admin',
                password: val,
                roleName: 'superAdmin'
            }
        }).then(val => {
            console.log(val)
        })
    })
})




