// --- Helper Functions ---
export const getRoleBadgeClass = (role) => {
    switch (role) {
        case 'Admin': return 'role-badge admin';
        case 'PM': return 'role-badge pm';
        case 'ProjectManager': return 'role-badge pm'; // Fallback
        default: return 'role-badge member';
    }
};
export const getStatusClass = (status) => {
    return status === 'Active' ? 'status-dot active' : 'status-dot on-leave';
};

// Password Validation
export const validatePassword = (password, confirmPassword, isCreateMode = true) => {
    if (!isCreateMode && (!password || password.trim() === "")){
        return null;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)){
        return 'Password must be at least 8 characters, including uppercase, lowercase, numbers, and special characters (!@#$%^&*).';
    }
    if (isCreateMode && password !== confirmPassword){
        return 'Password and confirmation do not match.';
    }
    return null;
};

// Create Initials
export const getInitials = (name) => {
    return name
        ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '??';
};

// Filter Users
 export const filterUsersList = (users, filters) => {
    const {searchTerm, roleFilter, statusFilter} = filters;
    return users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    })
 }
