# Component Documentation

เอกสารนี้รวบรวมวิธีการใช้งาน Component ต่างๆ ภายในโปรเจกต์ เพื่อให้ทีมงานสามารถนำไปใช้ต่อได้อย่างถูกต้องและเป็นมาตรฐานเดียวกัน

---

## 1. Button (`src/components/common/Button.jsx`)

ปุ่มหลักของระบบ รองรับทั้งการกดทั่วไป (Button) และการลิ้งค์ไปหน้าอื่น (Link) พร้อมสถานะ Loading

### Props

| Prop Name   | Type     | Default     | Description                                                            |
| :---------- | :------- | :---------- | :--------------------------------------------------------------------- |
| `children`  | Node     | -           | ข้อความหรือไอคอนภายในปุ่ม                                              |
| `variant`   | String   | `'primary'` | รูปแบบปุ่ม: `'primary'`, `'outline'`, `'ghost'`, `'danger'`, `'white'` |
| `size`      | String   | `'md'`      | ขนาดปุ่ม: `'sm'`, `'md'`, `'lg'`                                       |
| `isLoading` | Boolean  | `false`     | แสดง Loading Spinner และปิดการกด                                       |
| `fullWidth` | Boolean  | `false`     | ปรับความกว้างให้เต็ม Container (100%)                                  |
| `to`        | String   | -           | ถ้าใส่ค่านี้ ปุ่มจะทำงานเป็น `<Link>` ไปยัง URL นั้น                   |
| `onClick`   | Function | -           | ฟังก์ชันเมื่อกดปุ่ม                                                    |
| `disabled`  | Boolean  | `false`     | ปิดการใช้งานปุ่ม                                                       |

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

| Prop Name | Type   | Description                      |
| :-------- | :----- | :------------------------------- |
| `icon`    | Node   | ไอคอน (แนะนำให้ใช้ Lucide React) |
| `title`   | String | หัวข้อของการ์ด                   |
| `desc`    | String | คำอธิบายสั้นๆ                    |

### Usage Example

```jsx
import FeatureCard from "../components/common/FeatureCard";
import { ListTodo } from "lucide-react";

<FeatureCard
  icon={<ListTodo size={24} />}
  title="Task Tracking"
  desc="Track your tasks and projects with ease."
/>;
```

---

## 3. AdminLayout (`src/components/layout/AdminLayout.jsx`)

Layout หลักสำหรับหน้า Admin ทุกหน้า ประกอบด้วย Sidebar และ Topbar

### Props

| Prop Name  | Type   | Description                              |
| :--------- | :----- | :--------------------------------------- |
| `children` | Node   | เนื้อหาของหน้านั้นๆ                      |
| `namepage` | String | ชื่อหน้าที่จะแสดงบน Topbar (Breadcrumbs) |

### Usage Example

```jsx
import AdminLayout from "../../components/layout/AdminLayout";

<AdminLayout namepage="Dashboard">
  <h1>Welcome to Dashboard</h1>
</AdminLayout>;
```

---

## 4. AuthContext (`src/context/AuthContext.jsx`)

Context สำหรับจัดการระบบ Authentication ของทั้งแอพพลิเคชัน

### Hook: `useAuth()`

ใช้สำหรับเข้าถึงข้อมูลผู้ใช้และฟังก์ชัน Login/Logout

| Return Value             | Type     | Description                                                      |
| :----------------------- | :------- | :--------------------------------------------------------------- |
| `user`                   | Object   | ข้อมูลผู้ใช้ `{ name, role, email }` หรือ `null` ถ้ายังไม่ Login |
| `login(email, password)` | Function | ฟังก์ชันเข้าสู่ระบบ (Async)                                      |
| `logout()`               | Function | ฟังก์ชันออกจากระบบ                                               |
| `loading`                | Boolean  | สถานะการโหลดข้อมูลผู้ใช้เริ่มต้น                                 |

### Usage Example

```jsx
import { useAuth } from "../../context/AuthContext";

const MyComponent = () => {
  const { user, logout } = useAuth();

  if (!user) return <p>Please login</p>;

  return (
    <div>
      <p>
        Welcome, {user.name} ({user.role})
      </p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};
```

---

## 5. UserManagement (`src/pages/Admin/UserManagement.jsx`)

หน้าจัดการผู้ใช้สำหรับ **Admin** ทำหน้าที่จัดการข้อมูลผู้ใช้แบบครบวงจร (CRUD)

### Key Features

1.  **View All Users (Read)**:
    - แสดงรายการผู้ใช้ทั้งหมดในรูปแบบตาราง
    - รองรับ **Search** (ค้นหาตามชื่อ/อีเมล/บทบาท)
    - รองรับ **Filter** (กรองตาม Role และ Status) โดยกดปุ่ม Filter เพื่อเปิด/ปิดเมนู
2.  **Create User (Create)**:
    - ฟอร์มสร้างผู้ใช้ใหม่ (Name, Email, Role, Status, Password)
    - **Validation**: ตรวจสอบรหัสผ่านขั้นสูงและ Confirm Password
    - **Feedback**: แจ้งเตือนความสำเร็จด้วย **Toast Notification**
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
const [users, setUsers] = useState([]); // รายชื่อผู้ใช้ทั้งหมด
const [loading, setLoading] = useState(true); // สถานะการโหลด

// Modal State
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

// Filter State (New)
const [searchTerm, setSearchTerm] = useState("");
const [roleFilter, setRoleFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");
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

| Prop Name   | Type          | Description                                           |
| :---------- | :------------ | :---------------------------------------------------- |
| `title`     | String        | หัวข้อสถิติ (e.g., "Total Active")                    |
| `value`     | String/Number | ค่าตัวเลขที่ต้องการแสดง                               |
| `desc`      | String        | คำอธิบายเพิ่มเติมตัวเล็กๆ (e.g., "+2 this month")     |
| `icon`      | Node          | ไอคอนประกอบ (Optional)                                |
| `isPrimary` | Boolean       | ถ้า `true` จะเป็นพื้นหลังสีน้ำเงิน (สำหรับ Highlight) |

---

## 7. ProjectCard (`src/components/dashboard/ProjectCard.jsx`)

การ์ดแสดงรายละเอียดโปรเจกต์ (ชื่อ, สถานะ, Progress Bar)

### Props

| Prop Name | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `project` | Object   | Object ข้อมูลโปรเจกต์ที่ได้จาก API |
| `onClick` | Function | ฟังก์ชันเมื่อคลิกที่การ์ด          |

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

---

## 8. CreateTaskModal (`src/components/project/CreateTaskModal.jsx`)

Modal สำหรับสร้างงานใหม่ (Task) ในโปรเจกต์

### Props

| Prop Name       | Type          | Description                                                            |
| :-------------- | :------------ | :--------------------------------------------------------------------- |
| `isOpen`        | Boolean       | ควบคุมการแสดงผล Modal                                                  |
| `onClose`       | Function      | ฟังก์ชันเมื่อปิด Modal                                                 |
| `projectId`     | Number/String | ID ของโปรเจกต์ที่จะสร้างงานนี้                                         |
| `members`       | Array         | รายชื่อสมาชิกทีม (ใช้สำหรับ Dropdown เลือก Assignee)                   |
| `onTaskCreated` | Function      | Callback เมื่อสร้างงานสำเร็จ (มักใช้ `fetchProject` เพื่อรีโหลดข้อมูล) |

### Usage Example

```jsx
<CreateTaskModal
  isOpen={isCreateTaskOpen}
  onClose={() => setIsCreateTaskOpen(false)}
  projectId={projectId}
  members={project.members}
  onTaskCreated={fetchProject} // Refresh parent data
/>
```

---

## 9. TaskItem (`src/components/project/TaskItem.jsx`)

การ์ดแสดงรายละเอียดงานย่อยในหน้า Project Details

### Props

| Prop Name | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `task`    | Object   | ข้อมูลงาน (Title, Status, Assignee, Priority)  |
| `onClick` | Function | เมื่อคลิกที่การ์ด (ยังไม่ได้ใช้จริงในปัจจุบัน) |

---

## 10. TeamMembers (`src/components/project/TeamMembers.jsx`)

Component แสดงรายชื่อสมาชิกในทีม พร้อมปุ่ม "Manage Team"

### Key Features

- **Avatar Fallback**: ถ้าสมาชิกไม่มีรูปภาพ (`avatar`) ระบบจะแสดงตัวอักษรย่อ (Initials) บนพื้นหลังสีอัตโนมัติ (เช่น "John Doe" -> "JD")
- **Clean UI**: จัดเรียง Avatar อย่างสวยงามและรองรับ Overflow

### Props

| Prop Name       | Type     | Description                  |
| :-------------- | :------- | :--------------------------- |
| `members`       | Array    | รายชื่อสมาชิก (User Object)  |
| `onManageClick` | Function | ฟังก์ชันเปิด Modal จัดการทีม |

### Usage Example

```jsx
<TeamMembers
  members={project.members}
  onManageClick={() => setIsAddMemberOpen(true)}
/>
```

---

## 11. AddMemberModal (`src/components/project/AddMemberModal.jsx`)

Modal สำหรับจัดการสมาชิกในทีม (เพิ่ม/ลบ) ในรูปแบบ Multi-Select Dashboard

### Key Features

- **Multi-Select**: เลือกสมาชิกหลายคนพร้อมกันได้
- **Real-time Search**: ค้นหาผู้ใช้จากชื่อหรืออีเมล
- **Smart Filtering**: กรอง Admin ออกจากรายชื่ออัตโนมัติ (แสดงเฉพาะ Member/PM)
- **Smart Diffing**: ระบบคำนวณอัตโนมัติว่าต้อง Add ใครและ Remove ใครเมื่อกด Save
- **Visual Feedback**: แสดง Avatar และเครื่องหมายถูก ✅ สำหรับคนที่ถูกเลือก

### Props

| Prop Name        | Type          | Description                                           |
| :--------------- | :------------ | :---------------------------------------------------- |
| `isOpen`         | Boolean       | ควบคุมการแสดงผล Modal                                 |
| `onClose`        | Function      | ฟังก์ชันเมื่อปิด Modal                                |
| `projectId`      | Number/String | ID ของโปรเจกต์                                        |
| `projectName`    | String        | ชื่อโปรเจกต์ (แสดงบน Header)                          |
| `currentMembers` | Array         | รายชื่อสมาชิกปัจจุบัน (เพื่อแสดงสถานะที่เลือกไว้แล้ว) |
| `onMemberAdded`  | Function      | Callback เมื่อบันทึกสำเร็จ (Refresh Parent)           |

### Usage Example

```jsx
<AddMemberModal
  isOpen={isAddMemberOpen}
  onClose={() => setIsAddMemberOpen(false)}
  projectId={project.project_id}
  projectName={project.name}
  currentMembers={project.members}
  onMemberAdded={fetchProject} // Refresh list on success
/>
```

---

## 12. EditProjectModal (`src/components/project/EditProjectModal.jsx`)

Modal สำหรับแก้ไขรายละเอียดของโปรเจกต์ (Name, Description, Status, Dates)

### Key Features

- **Prefill Data**: ดึงข้อมูลเดิมของโปรเจกต์มาแสดงในฟอร์มอัตโนมัติ
- **Validation**: ตรวจสอบว่าเป็นโปรเจกต์ที่มีอยู่จริง
- **Status Management**: สามารถเปลี่ยนสถานะโปรเจกต์ (Active, On Hold, Completed) ได้
- **Delete Project**: ปุ่มลบโปรเจกต์พร้อม Confirmation Modal (Nested) ที่แจ้งเตือนผลกระทบ (Tasks หายหมด)

### Props

| Prop Name          | Type     | Description                  |
| :----------------- | :------- | :--------------------------- |
| `isOpen`           | Boolean  | ควบคุมการแสดงผล Modal        |
| `onClose`          | Function | ฟังก์ชันเมื่อปิด Modal       |
| `project`          | Object   | ข้อมูลโปรเจกต์เดิมที่จะแก้ไข |
| `onProjectUpdated` | Function | Callback เมื่อบันทึกสำเร็จ   |

### Usage Example

```jsx
<EditProjectModal
  isOpen={isEditProjectOpen}
  onClose={() => setIsEditProjectOpen(false)}
  project={project}
  onProjectUpdated={fetchProject}
/>
```

---

## 11. AddMemberModal (`src/components/project/AddMemberModal.jsx`)

Modal สำหรับจัดการสมาชิกในทีม (เพิ่ม/ลบ) ในรูปแบบ Multi-Select Dashboard

### Key Features

- **Multi-Select**: เลือกสมาชิกหลายคนพร้อมกันได้
- **Real-time Search**: ค้นหาผู้ใช้จากชื่อหรืออีเมล
- **Smart Filtering**: กรอง Admin ออกจากรายชื่ออัตโนมัติ (แสดงเฉพาะ Member/PM)
- **Smart Diffing**: ระบบคำนวณอัตโนมัติว่าต้อง Add ใครและ Remove ใครเมื่อกด Save
- **Visual Feedback**: แสดง Avatar และเครื่องหมายถูก ✅ สำหรับคนที่ถูกเลือก

### Props

| Prop Name        | Type          | Description                                           |
| :--------------- | :------------ | :---------------------------------------------------- |
| `isOpen`         | Boolean       | ควบคุมการแสดงผล Modal                                 |
| `onClose`        | Function      | ฟังก์ชันเมื่อปิด Modal                                |
| `projectId`      | Number/String | ID ของโปรเจกต์                                        |
| `projectName`    | String        | ชื่อโปรเจกต์ (แสดงบน Header)                          |
| `currentMembers` | Array         | รายชื่อสมาชิกปัจจุบัน (เพื่อแสดงสถานะที่เลือกไว้แล้ว) |
| `onMemberAdded`  | Function      | Callback เมื่อบันทึกสำเร็จ (Refresh Parent)           |

### Usage Example

```jsx
<AddMemberModal
  isOpen={isAddMemberOpen}
  onClose={() => setIsAddMemberOpen(false)}
  projectId={project.project_id}
  projectName={project.name}
  currentMembers={project.members}
  onMemberAdded={fetchProject} // Refresh list on success
/>
```

---

## 13. EditTaskModal (`src/components/project/EditTaskModal.jsx`)

Modal สำหรับแก้ไขรายละเอียดงาน (Task) รวมถึงการลบงาน

### Key Features

- **Prefill Data**: ดึงข้อมูลงานปัจจุบันมาใส่ให้พร้อมแก้ไข
- **Custom Delete Confirmation**: ปุ่มลบงาน (Delete) จะเปิด Modal ยืนยันซ้อนขึ้นมาอีกชั้น (Nested Modal) เพื่อป้องกันการลบผิดพลาด
- **API Integration**: รองรับทั้งการ Update (`PUT`) และ Delete (`DELETE`)

### Props

| Prop Name       | Type     | Description                                          |
| :-------------- | :------- | :--------------------------------------------------- |
| `isOpen`        | Boolean  | ควบคุมการแสดงผล Modal                                |
| `onClose`       | Function | ฟังก์ชันปิด Modal                                    |
| `task`          | Object   | object ของงานที่จะแก้ไข (ต้องมี `id` และข้อมูลอื่นๆ) |
| `members`       | Array    | รายชื่อสมาชิกสำหรับ dropdown เลือก Assignee          |
| `onTaskUpdated` | Function | Callback เมื่อแก้ไขหรือลบสำเร็จ                      |

### Usage Example

```jsx
<EditTaskModal
  isOpen={isEditTaskOpen}
  onClose={() => setIsEditTaskOpen(false)}
  task={selectedTask}
  members={members}
  onTaskUpdated={fetchProject}
/>
```

---

## 14. SharedKanbanBoard (`src/components/kanban/SharedKanbanBoard.jsx`)

**"Presenter Component"** ที่รับผิดชอบเรื่อง UI ของ Kanban Board ทั้งหมด แต่ไม่มี Logic ในการดึงข้อมูลเอง

### Key Features

- **Stateless (mostly)**: รับข้อมูล Tasks และ functions จาก Parent Component
- **Drag & Drop**: ใช้ `@dnd-kit` ในการจัดการลากวาง
- **Filtering**: มี UI สำหรับกรองงานตาม Priority (High, Medium, Low)

### Props

| Prop Name       | Type     | Description                                                     |
| :-------------- | :------- | :-------------------------------------------------------------- |
| `title`         | String   | ชื่อหัวข้อบอร์ด (e.g., "Project A Board", "My Personal Tasks")  |
| `columns`       | Object   | ข้อมูล Tasks ที่จัดกลุ่มแล้ว `{'To Do': [], 'In Progress': []}` |
| `onDragEnd`     | Function | ฟังก์ชันเรียกเมื่อลากเสร็จ (สำหรับยิง API Save)                 |
| `onTaskClick`   | Function | ฟังก์ชันเมื่อคลิก Task (เปิด Edit Modal)                        |
| `onAddClick`    | Function | ฟังก์ชันเมื่อกดปุ่ม Add Task                                    |
| `showAddButton` | Boolean  | ควบคุมการแสดงปุ่ม Add Task (เผื่อใช้ใน Read-only mode)          |

---

## 15. ProjectKanbanBoard & PersonalKanbanBoard

**"Container Components"** ที่ทำหน้าที่เป็น Controller คุม `SharedKanbanBoard`

### ProjectKanbanBoard (`src/pages/ProjectManager/ProjectKanbanBoard.jsx`)

- **Source**: ดึงข้อมูลจาก Project API (`/api/projects/:id`)
- **Use Case**: ใช้สำหรับดูงานรวมของทั้งทีมในโปรเจกต์นั้นๆ

### PersonalKanbanBoard (`src/pages/ProjectManager/PersonalKanbanBoard.jsx`)

- **Source**: ดึงข้อมูลจาก Personal Tasks API (`/api/tasks/user/:userId`)
- **Use Case**: ใช้สำหรับ User ดูงานที่ตัวเองได้รับมอบหมาย (ส่วนตัว)

### Logic Flow

1. Fetch Data (API)
2. Group Data (into Columns)
3. **Render `SharedKanbanBoard`** (pass data & handlers)

---

## 16. AdminDashboard (`src/pages/Admin/AdminDashboard.jsx`)

หน้า Dashboard หลักสำหรับ Admin แสดงภาพรวมของระบบ

### Key Features

- **Real-time Stats**: แสดงจำนวนผู้ใช้, โปรเจกต์ที่ Active, และงานที่เสร็จสิ้น
- **Dynamic Charts**:
  - **Bar Chart**: แสดงกิจกรรมรายสัปดาห์ (Mockup ในปัจจุบัน)
  - **Donut Chart**: แสดงสัดส่วนผู้ใช้ตาม Role ด้วย `conic-gradient` ตามสีที่กำหนด (Blue, Purple, Light Blue)
- **API Integration**: ดึงข้อมูลจาก `GET /api/admin/stats`

---

## 17. ProfilePage (`src/pages/Shared/ProfilePage.jsx`)

หน้าแก้ไขข้อมูลส่วนตัวสำหรับผู้ใช้ทุกคน

### Key Features

- **View Profile**: แสดงข้อมูลปัจจุบัน (Avatar, Name, Email, Role)
- **Edit Profile**: ฟอร์มแก้ไขชื่อและเบอร์โทร/แผนก โดยเชื่อมต่อกับ API `PUT /api/users/profile`
- **Real-time Context Update**: เมื่อบันทึกสำเร็จ ข้อมูลใน `AuthContext` (Topbar) จะถูกอัปเดตทันทีโดยไม่ต้อง Refresh

---

## 18. NotFound (`src/pages/Shared/NotFound.jsx`)

หน้า 404 สำหรับจัดการกรณีผู้ใช้เข้าถึง Path ที่ไม่มีอยู่จริง

### Features

- แสดงข้อความแจ้งเตือน "404 - Page Not Found"
- มีปุ่ม "Go Home" เพื่อกลับหน้าหลัก
