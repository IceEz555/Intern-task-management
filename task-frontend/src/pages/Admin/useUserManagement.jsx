import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../utils/api"; // ตรวจสอบ path ให้ถูกต้อง
// Import Logic ที่เราทำไว้ใน Step 1
import { getInitials, validatePassword, filterUsersList } from "./UserManagement.logic";
export const useUserManagement = () => { // แก้ชื่อให้ถูก (Management)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // --- State for Modals ---
    const [modals, setModals] = useState({
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
    });
    // --- State for Search & Filter ---
    const [filters, setFilters] = useState({
        searchTerm: '',
        roleFilter: 'All',
        statusFilter: 'All',
        isFilterVisible: false
    });
    // --- State for Form Data ---
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', email: '', role: 'Member', status: 'Active', password: '', confirmPassword: '' 
    });
    
    // --- Handlers ---
    const toggleModal = (modalName, isOpen) => {
        setModals(prev => ({
            ...prev,
            [modalName]: isOpen
        }));
    };
    const resetForm = () => {
        setFormData({ name: '', email: '', role: 'Member', status: 'Active', password: '', confirmPassword: '' });
        setCurrentUser(null);
    };
    // เปิด Modal ต่างๆ
    const openCreate = () => {
        resetForm();
        toggleModal('isCreateModalOpen', true);
    };
    const openEdit = (user) => {
        setCurrentUser(user);
        setFormData({ 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            status: user.status, 
            password: '', 
            confirmPassword: '' // Reset password fields on edit open
        });
        toggleModal('isEditModalOpen', true);
    };
    const openDelete = (user) => {
        setCurrentUser(user);
        toggleModal('isDeleteModalOpen', true);
    };
    const closeModal = () => {
        resetForm();
        // ปิดทุก Modal เพื่อความชัวร์
        setModals({
            isCreateModalOpen: false,
            isEditModalOpen: false,
            isDeleteModalOpen: false
        });
    };
    
    // --- API Calls ---
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users`);
            const formattedUsers = response.data.map(user => ({
                ...user,
                initials: getInitials(user.name), // ใช้ Logic helper
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        // ใช้ validatePassword จาก Logic File (ส่ง param ให้ครบ: pwd, confirm, isCreateMode)
        const error = validatePassword(formData.password, formData.confirmPassword, true);
        if (error) {
            alert(error);
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/api/users`, formData);
            const newUser = {
                ...response.data,
                initials: getInitials(response.data.name), // ใช้ Logic helper
            };
            setUsers(prev => [...prev, newUser]);
            closeModal();
            alert("User created successfully!");
        } catch (error) {
            console.error("Error creating user:", error);
            if (error.response && error.response.status === 409) {
                alert("Email already registered.");
            } else {
                alert("Failed to create user.");
            }
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const error = validatePassword(formData.password, formData.confirmPassword, false);
        if (error) {
            alert(error);
            return;
        }
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                password: formData.password // Backend ควร handle ว่าถ้าส่งว่างไปจะไม่แก้นะ
            };

            const response = await axios.put(`${API_URL}/api/users/${currentUser.user_id}`, payload);
            const updatedUser = {
                ...response.data,
                initials: getInitials(response.data.name)
            };
            setUsers(prev => prev.map(u => u.user_id === currentUser.user_id ? updatedUser : u));
            closeModal();
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            if (error.response && error.response.status === 409) {
                alert("Email already exists.");
            } else {
                alert("Failed to update user.");
            }
        }
    };

    const handleSubmitDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/users/${currentUser.user_id}`);
            setUsers(prev => prev.filter(u => u.user_id !== currentUser.user_id));
            closeModal();
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    // Initial Fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    // Derived State (Filtered Users)
    const filteredUsers = filterUsersList(users, filters);
    return {
        // Data
        users: filteredUsers,
        loading,
        currentUser,
        formData,
        modals,
        filters,
        
        // Setters (จำเป็นมาก ต้องส่งออกไปเพื่อให้ UI อัปเดตค่าได้)
        setFormData, 
        setFilters, 
        
        // Handlers
        openCreate,
        openEdit,
        openDelete,
        closeModal,

        // Submit Handlers
        handleSubmitCreate,
        handleSubmitEdit,
        handleSubmitDelete,
    };
};