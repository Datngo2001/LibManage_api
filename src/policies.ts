const policyList = {
    superAdminPolicy: ['superAdmin'],
    adminPolicy: ['superAdmin', 'admin'],
    managerPolicy: ['superAdmin', 'admin', 'manager'],
    librarianPolicy: ['superAdmin', 'admin', 'manager', 'librarian'],
    publicPolicy: ['superAdmin', 'admin', 'manager', 'librarian', 'user'],
    userPolicy: ['superAdmin', 'admin', 'user']
}

export default policyList;