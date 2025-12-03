import { AlertCircle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import '../../assets/styles/LoginPage.css';
import Button from "../../components/common/Button";
import { LaptopMinimalCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // Keep for UI highlighting

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call login from AuthContext
            const user = await login(email, password);

            // Redirect logic based on role from context result
            if (user.role === 'Admin') {
                navigate('/admin');
            } else if (user.role === 'PM') {
                navigate('/project-manager');
            } else {
                navigate('/admin'); // Default fallback
            }

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
