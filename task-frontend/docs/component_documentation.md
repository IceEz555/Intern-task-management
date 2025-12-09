# Component Documentation

เอกสารนี้รวบรวมวิธีการใช้งาน Component ต่างๆ ภายในโปรเจกต์ เพื่อให้ทีมงานสามารถนำไปใช้ต่อได้อย่างถูกต้องและเป็นมาตรฐานเดียวกัน

---

## 1. Button (`src/components/common/Button.jsx`)

ปุ่มหลักของระบบ รองรับทั้งการกดทั่วไป (Button) และการลิ้งค์ไปหน้าอื่น (Link) พร้อมสถานะ Loading

### Props

| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | Node | - | ข้อความหรือไอคอนภายในปุ่ม |
| `variant` | String | `'primary'` | รูปแบบปุ่ม: `'primary'`, `'outline'`, `'ghost'`, `'danger'`, `'white'` |
| `size` | String | `'md'` | ขนาดปุ่ม: `'sm'`, `'md'`, `'lg'` |
| `isLoading` | Boolean | `false` | แสดง Loading Spinner และปิดการกด |
| `fullWidth` | Boolean | `false` | ปรับความกว้างให้เต็ม Container (100%) |
| `to` | String | - | ถ้าใส่ค่านี้ ปุ่มจะทำงานเป็น `<Link>` ไปยัง URL นั้น |
| `onClick` | Function | - | ฟังก์ชันเมื่อกดปุ่ม |
| `disabled` | Boolean | `false` | ปิดการใช้งานปุ่ม |

### Usage Examples

```jsx
import Button from "../components/common/Button";

// 1. ปุ่ม Submit ปกติ
<Button onClick={handleSubmit}>Save Changes</Button>

// 2. ปุ่ม Link ไปหน้า Login
<Button to="/login" variant="outline">Log In</Button>

// 3. ปุ่ม Loading เต็มความกว้าง
<Button isLoading={true} fullWidth>Processing...</Button>

// 4. ปุ่มลบ (Danger) ขนาดเล็ก
<Button variant="danger" size="sm">Delete</Button>
```

---

## 2. FeatureCard (`src/components/common/FeatureCard.jsx`)

การ์ดสำหรับแสดงคุณสมบัติเด่น (Feature) ในหน้า Home

### Props

| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `icon` | Node | ไอคอน (แนะนำให้ใช้ Lucide React) |
| `title` | String | หัวข้อของการ์ด |
| `desc` | String | คำอธิบายสั้นๆ |

### Usage Example

```jsx
import FeatureCard from "../components/common/FeatureCard";
import { ListTodo } from 'lucide-react';

<FeatureCard 
    icon={<ListTodo size={24} />} 
    title="Task Tracking" 
    desc="Track your tasks and projects with ease." 
/>
```

---

## 3. AdminLayout (`src/components/layout/AdminLayout.jsx`)

Layout หลักสำหรับหน้า Admin ทุกหน้า ประกอบด้วย Sidebar และ Topbar

### Props

| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `children` | Node | เนื้อหาของหน้านั้นๆ |
| `namepage` | String | ชื่อหน้าที่จะแสดงบน Topbar (Breadcrumbs) |

### Usage Example

```jsx
import AdminLayout from "../../components/layout/AdminLayout";

<AdminLayout namepage="Dashboard">
    <h1>Welcome to Dashboard</h1>
</AdminLayout>
```

---

## 4. AuthContext (`src/context/AuthContext.jsx`)

Context สำหรับจัดการระบบ Authentication ของทั้งแอพพลิเคชัน

### Hook: `useAuth()`

ใช้สำหรับเข้าถึงข้อมูลผู้ใช้และฟังก์ชัน Login/Logout

| Return Value | Type | Description |
| :--- | :--- | :--- |
| `user` | Object | ข้อมูลผู้ใช้ `{ name, role, email }` หรือ `null` ถ้ายังไม่ Login |
| `login(email, password)` | Function | ฟังก์ชันเข้าสู่ระบบ (Async) |
| `logout()` | Function | ฟังก์ชันออกจากระบบ |
| `loading` | Boolean | สถานะการโหลดข้อมูลผู้ใช้เริ่มต้น |

### Usage Example

```jsx
import { useAuth } from "../../context/AuthContext";

const MyComponent = () => {
    const { user, logout } = useAuth();

    if (!user) return <p>Please login</p>;

    return (
        <div>
            <p>Welcome, {user.name} ({user.role})</p>
            <button onClick={logout}>Sign Out</button>
        </div>
    );
};
```

---

## 5. UserManagement (`src/pages/Admin/UserManagement.jsx`)

หน้าจัดการผู้ใช้สำหรับ **Admin** ทำหน้าที่จัดการข้อมูลผู้ใช้แบบครบวงจร (CRUD)

### Key Features (Updated)

1.  **View All Users (Read)**:
    - แสดงรายการผู้ใช้ทั้งหมดในรูปแบบตาราง
    - รองรับ **Search** (ค้นหาตามชื่อ/อีเมล/บทบาท)
    - รองรับ **Filter** (กรองตาม Role และ Status) โดยกดปุ่ม Filter เพื่อเปิด/ปิดเมนู
2.  **Create User (Create)**:
    - ฟอร์มสร้างผู้ใช้ใหม่ (Name, Email, Role, Status, Password)
    - **Validation**: ตรวจสอบรหัสผ่านขั้นสูง (8+ ตัวอักษร, ตัวเล็ก/ใหญ่, ตัวเลข, อักขระพิเศษ) และ Confirm Password
    - เชื่อมต่อ API `POST /api/users`
3.  **Edit User (Update)**:
    - แก้ไขข้อมูลผู้ใช้ (เปลี่ยน Role, Status, หรือ Reset Password)
    - ฟิลด์ Password เป็น Optional (ถ้าระบุมา จะทำการ Hash และอัปเดตใหม่ ถ้าว่างไว้จะใช้รหัสเดิม)
    - เชื่อมต่อ API `PUT /api/users/:id`
4.  **Delete User (Delete)**:
    - ลบผู้ใช้อออกจากระบบ พร้อม Modal ยืนยัน
    - เชื่อมต่อ API `DELETE /api/users/:id`

### Code Structure Logic

**State Management:**

```javascript
// Data State
const [users, setUsers] = useState([]);      // รายชื่อผู้ใช้ทั้งหมด
const [loading, setLoading] = useState(true); // สถานะการโหลด

// Modal State
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

// Filter State (New)
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('All');
const [statusFilter, setStatusFilter] = useState('All');
```

**Filter Logic:**

ระบบจะทำการกรองข้อมูลแบบ Real-time ที่ฝั่ง Client (Client-side Filtering) จาก State `users`:

```javascript
const filteredUsers = users.filter(user => {
    const matchesSearch = ... // เช็คแา Search Term
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
});
```

**Password Validation:**

มีการใช้ Regex ในการตรวจสอบความปลอดภัยของรหัสผ่าน ทั้งตอนสร้างและแก้ไข:
Regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/`

## 6. StatCard (`src/components/dashboard/StatCard.jsx`)

การ์ดแสดงตัวเลขสถิติในหน้า Dashboard

### Props

| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `title` | String | หัวข้อสถิติ (e.g., "Total Active") |
| `value` | String/Number | ค่าตัวเลขที่ต้องการแสดง |
| `desc` | String | คำอธิบายเพิ่มเติมตัวเล็กๆ (e.g., "+2 this month") |
| `icon` | Node | ไอคอนประกอบ (Optional) |
| `isPrimary` | Boolean | ถ้า `true` จะเป็นพื้นหลังสีน้ำเงิน (สำหรับ Highlight) |

---

## 7. ProjectCard (`src/components/dashboard/ProjectCard.jsx`)

การ์ดแสดงรายละเอียดโปรเจกต์ (ชื่อ, สถานะ, Progress Bar)

### Props

| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `project` | Object | Object ข้อมูลโปรเจกต์ที่ได้จาก API |
| `onClick` | Function | ฟังก์ชันเมื่อคลิกที่การ์ด |

**Project Object Structure:**
```javascript
{
  name: "Project Name",
  description: "...",
  status: "In Progress", // Used for badge color
  progress: 50, // Percentage 0-100
  task_count: 10,
  members: [...]
}
```
