import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Profile from './pages/Profile';
import Footer from './components/layout/Footer';
import { getCurrentUser } from './utils/auth';
import './App.css';

const { Content } = Layout;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);
    };

    initAuth();
  }, []);

  // 需要登录的路由保护
  const PrivateRoute = ({ children }) => {
    if (loading) return <div>加载中...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Layout className="layout">
      <Navbar user={user} setUser={setUser} />
      <Content className="site-content">
        {loading ? (
          <div className="loading-container">加载中...</div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard user={user} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects/new" 
              element={
                <PrivateRoute>
                  <CreateProject user={user} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects/:id" 
              element={
                <PrivateRoute>
                  <ProjectDetail user={user} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects/:id/edit" 
              element={
                <PrivateRoute>
                  <EditProject user={user} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile user={user} setUser={setUser} />
                </PrivateRoute>
              } 
            />
          </Routes>
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default App; 