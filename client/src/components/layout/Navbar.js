import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  ProjectOutlined, 
  LoginOutlined, 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { logout } from '../../utils/auth';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1890ff;
  text-decoration: none;
`;

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('home');

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  const mainMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: <Link to="/dashboard">我的项目</Link>
    }
  ];

  return (
    <StyledHeader>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo to="/">灵感花园</Logo>
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          onClick={handleClick}
          style={{ marginLeft: 30 }}
          items={mainMenuItems}
        />
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/projects/new')}
            >
              创建项目
            </Button>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={user.profile?.avatar} 
                  icon={!user.profile?.avatar && <UserOutlined />}
                />
                <span style={{ marginLeft: 8 }}>{user.username}</span>
              </div>
            </Dropdown>
          </div>
        ) : (
          <div>
            <Button 
              type="text" 
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              登录
            </Button>
            <Button 
              type="primary"
              onClick={() => navigate('/register')}
            >
              注册
            </Button>
          </div>
        )}
      </div>
    </StyledHeader>
  );
};

export default Navbar; 