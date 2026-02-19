import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Typography,
  Switch,
} from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined,
  SafetyOutlined,
  RiseOutlined,
  SunOutlined,
  MoonOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const AntNavigation = () => {
  const location = useLocation();
  const { user, openLogin, openSignUp, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const getNavItems = () => {
    const baseItems = [
      { key: '/', label: 'Home', icon: <HomeOutlined /> }
    ];

    if (user) {
      switch (user.role) {
        case 'admin':
          return [
            ...baseItems,
            { key: '/dashboard', label: 'User Dashboard', icon: <DashboardOutlined /> },
            { key: '/agent-dashboard', label: 'Agent Dashboard', icon: <UserOutlined /> },
            { key: '/admin-dashboard', label: 'Admin Dashboard', icon: <SettingOutlined /> },
          ];
        case 'agent':
          return [
            ...baseItems,
            { key: '/dashboard', label: 'User Dashboard', icon: <DashboardOutlined /> },
            { key: '/agent-dashboard', label: 'Agent Dashboard', icon: <UserOutlined /> },
          ];
        case 'user':
        default:
          return [
            ...baseItems,
            { key: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
          ];
      }
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const userMenuItems = user ? [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Link to="/dashboard">
          <div>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{user.email}</div>
          </div>
        </Link>
      ),
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/profile">Profile Settings</Link>,
    },
    { type: 'divider' },
    {
      key: 'theme',
      icon: darkMode ? <SunOutlined /> : <MoonOutlined />,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Dark Mode
          <Switch
            size="small"
            checked={darkMode}
            onChange={setDarkMode}
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log out',
      onClick: logout,
    },
  ] : [];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <SafetyOutlined style={{ color: 'white', fontSize: 18 }} />
          </div>
          <Text
            strong
            style={{
              fontSize: 20,
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CreditFix Pro
          </Text>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{
            border: 'none',
            background: 'transparent',
            minWidth: 400,
          }}
          items={navItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
        />
      </div>

      {/* Right Side Actions */}
      <Space size="middle">
        {user ? (
          <>
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
                <Space>
                  <Avatar
                    src={user.profilePhoto || '/placeholder.svg'}
                    size="small"
                  >
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{user.name}</div>
                    {user.role === 'admin' && (
                      <div style={{ fontSize: 10, color: '#722ed1' }}>
                        <CrownOutlined /> Admin
                      </div>
                    )}
                  </div>
                </Space>
              </Button>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button type="text" onClick={openLogin}>
              Sign In
            </Button>
            <Button
              type="primary"
              icon={<RiseOutlined />}
              onClick={openSignUp}
              style={{
                background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                border: 'none',
              }}
            >
              Start Repair
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
};

export default AntNavigation;
