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
