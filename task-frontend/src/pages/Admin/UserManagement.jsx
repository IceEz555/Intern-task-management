import AdminLayout from "../../components/layout/AdminLayout";


const UserManagement = () => {
    return (
        <AdminLayout namepage="User Management">
            <div className="management-container">
                <div className="user-management-header">
                    <h1> User Management </h1>
                    <button> Add User </button>
                </div>

                <div className="user-management-content">
                    <table>

                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

export default UserManagement