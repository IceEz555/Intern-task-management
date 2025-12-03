import { AlertCircle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import '../../assets/styles/LoginPage.css';
import Button from "../../components/common/Button";
import { LaptopMinimalCheck } from "lucide-react";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // No default selection initially

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // จำลองการ Login (Fake Login)
        try {
            // หน่วงเวลา 1.5 วินาที ให้เห็นปุ่ม Loading หมุนๆ
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("ส่งข้อมูลไป Login:", { email, password });

            // สมมติว่าถ้าใส่ password ผิด (test error)
            if (password.length < 6) {
                throw new Error("รหัสผ่านต้องมากกว่า 6 ตัวอักษร");
            }
            alert("เข้าสู่ระบบสำเร็จ! (ดูค่าใน Console)");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-wrapper">

                    {/* Logo & Title */}
                    <div className="login-header">
                        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20 mx-auto mb-4">
                            <LaptopMinimalCheck />
                        </div>
                        <h1 className="title">Welcome</h1>
                        <p className="subtitle">Sign in to access your workspace</p>
                    </div>

                    {/* Login Form */}
                    <div className="login-card">
                        <form onSubmit={handleSubmit}>
                            {/* Error Message */}
                            {error && (
                                <div className="error-box">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Demo Test */}
                            <div className="demo-container">
                                <label className="demo-label">SELECT DEMO ROLE</label>
                                <div className="demo-btn-group">
                                    <button
                                        type="button"
                                        className={`demo-btn ${selectedRole === 'Admin' ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedRole("Admin");
                                            setEmail("admin@example.com");
                                            setPassword("password");
                                        }}
                                    >
                                        Admin
                                    </button>
                                    <button
                                        type="button"
                                        className={`demo-btn ${selectedRole === 'PM' ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedRole("PM");
                                            setEmail("pm@example.com");
                                            setPassword("password");
                                        }}
                                    >
                                        PM
                                    </button>
                                    <button
                                        type="button"
                                        className={`demo-btn ${selectedRole === 'Member' ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedRole("Member");
                                            setEmail("member@example.com");
                                            setPassword("password");
                                        }}
                                    >
                                        Member
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-6">
                                {loading ? "Loading..." : "Login"}
                            </Button>
                        </form>
                    </div>
                </div >
            </div >
        </>

    );
}
