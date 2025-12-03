import Navbar from "../../components/common/Navbar";
import FeatureCard from "../../components/common/FeatureCard";
import { Link } from "react-router-dom";
import "../../assets/styles/Home.css";
import { FolderPen, ListTodo, UsersRound } from 'lucide-react';

export function Home() {
    return (
        <div className="home-container">
            <Navbar />

            <div className="home-content">

                {/* Hero Section */}
                <main className="hero-wrapper">
                    <div className="new-feature-badge">
                        New Feature
                    </div>

                    <h1 className="hero-title">
                        Task Management System
                    </h1>

                    <p className="hero-subtitle">
                        Tasks management system is a tool that helps you to manage your tasks and projects. This is my first Project for Internship.
                    </p>

                    <Link to="/login" className="btn-primary">
                        Get Started
                    </Link>
                </main>

                {/* Divider */}
                <div className="divider"></div>

                {/* Feature Cards */}
                <div className="features-grid">
                    <FeatureCard
                        icon={<ListTodo size={24} />}
                        title="Task Tracking"
                        desc="Track your tasks and projects with ease."
                    />
                    <FeatureCard
                        icon={<UsersRound size={24} />}
                        title="Team Collaboration"
                        desc="Collaborate with your team members and share tasks."
                    />
                    <FeatureCard
                        icon={<FolderPen size={24} />}
                        title="Project Management"
                        desc="Organize tasks with a built-in calendar view."
                    />
                </div>
            </div>
        </div>
    )
}

