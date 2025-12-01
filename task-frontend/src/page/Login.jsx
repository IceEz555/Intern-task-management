import { AlertCircle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import '../assets/styles/LoginPage.css';

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
    <div className="login-container">
    <div className="login-wrapper">
        {/* Logo & Title */}
        <div className="header">
            <h1 className="title">Task Management System</h1>
            <p className="subtitle">เข้าสู่ระบบเพื่อจัดการงานของคุณ</p>
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
                อีเมล
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
                รหัสผ่าน
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

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
                </form>
            </div>
        </div>
    </div>
    );
}
