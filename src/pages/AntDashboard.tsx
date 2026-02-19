import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Avatar,
  Tag,
  Button,
  Badge,
  Drawer,
  List,
  Typography,
  Space,
  Divider,
  Alert,
  Timeline,
  Steps,
  Rate,
  ConfigProvider,
  Tabs,
} from 'antd';
import { creditFixTheme } from '@/config/antTheme';
import AdvancedCharts from '@/components/charts/AdvancedCharts';
import AdvancedTables from '@/components/tables/AdvancedTables';
import {
  DashboardOutlined,
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  TrophyOutlined,
  RiseOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AntDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Mock data
  const creditData = [
    { title: 'Current Score', value: 720, change: '+45', status: 'up' },
    { title: 'Items Disputed', value: 20, change: '12 resolved', status: 'success' },
    { title: 'Accounts Monitored', value: 15, change: '85% good', status: 'normal' },
    { title: 'Goal Progress', value: 85, change: 'Target: 750', status: 'active' },
  ];

  const recentActivity = [
    {
      key: '1',
      action: 'Late Payment Dispute Filed',
      description: 'Chase Credit Card - Late payment from 2022',
      status: 'processing',
      date: '2 days ago',
    },
    {
      key: '2',
      action: 'Credit Score Increased',
      description: 'Your score improved by 15 points',
      status: 'success',
      date: '1 week ago',
    },
    {
      key: '3',
      action: 'Collection Account Removed',
      description: 'Medical collection account successfully removed',
      status: 'success',
      date: '2 weeks ago',
    },
    {
      key: '4',
      action: 'Credit Inquiry Dispute',
      description: 'Unauthorized hard inquiry from ABC Lending',
      status: 'pending',
      date: '3 weeks ago',
    },
  ];

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          success: 'green',
          processing: 'blue',
          pending: 'orange',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <CreditCardOutlined />,
      label: 'Credit Reports',
    },
    {
      key: '3',
      icon: <FileTextOutlined />,
      label: 'Documents',
    },
    {
      key: '4',
      icon: <TrophyOutlined />,
      label: 'Progress',
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const notifications = [
    {
      title: 'Credit Score Updated',
      description: 'Your score increased by 5 points to 720',
      time: '2 hours ago',
      type: 'success',
    },
    {
      title: 'Document Uploaded',
      description: 'W-2 form has been successfully processed',
      time: '1 day ago',
      type: 'info',
    },
    {
      title: 'Dispute Response',
      description: 'Received response from Equifax regarding your dispute',
      time: '3 days ago',
      type: 'warning',
    },
  ];

  return (
    <ConfigProvider theme={creditFixTheme}>
      <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'CF' : 'CreditFix Pro'}
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <UserOutlined /> : <UserOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <Space>
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationVisible(true)}
              />
            </Badge>
            <Avatar src="/placeholder.svg" />
            <span>Welcome back, Sharon!</span>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#f8fafc', minHeight: 280 }}>
          {/* Welcome Alert */}
          <Alert
            message="🎉 We're excited to help you with your credit and tax goals!"
            description="Your free credit analysis is ready. Let's start improving your financial health together!"
            type="success"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />

          <Tabs
            defaultActiveKey="overview"
            type="card"
            size="large"
            items={[
              {
                key: 'overview',
                label: 'Dashboard Overview',
                children: (
                  <div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {creditData.map((item, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card>
                  <Statistic
                    title={item.title}
                    value={item.value}
                    suffix={item.title === 'Goal Progress' ? '%' : ''}
                    valueStyle={{
                      color: item.status === 'up' ? '#3f8600' : item.status === 'success' ? '#52c41a' : '#1890ff'
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.change}
                    </Text>
                  </div>
                  {item.title === 'Goal Progress' && (
                    <Progress percent={item.value} strokeColor="#52c41a" style={{ marginTop: 8 }} />
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            {/* Credit Score Progress */}
            <Col xs={24} lg={12}>
              <Card title="Credit Score Progress" extra={<Button icon={<DownloadOutlined />}>Export</Button>}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Progress
                    type="circle"
                    percent={75}
                    format={() => (
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>720</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Excellent</div>
                      </div>
                    )}
                    size={120}
                    strokeColor="#52c41a"
                  />
                </div>
                <Row gutter={16}>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Statistic title="This Month" value={45} prefix="+" valueStyle={{ color: '#52c41a', fontSize: 16 }} />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Statistic title="Items Removed" value={12} valueStyle={{ color: '#1890ff', fontSize: 16 }} />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Statistic title="Complete" value={95} suffix="%" valueStyle={{ color: '#fa8c16', fontSize: 16 }} />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Recent Activity */}
            <Col xs={24} lg={12}>
              <Card title="Recent Activity" extra={<Button type="link">View All</Button>}>
                <Table
                  dataSource={recentActivity}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* Credit Repair Journey */}
            <Col xs={24} lg={14}>
              <Card title="Your Credit Repair Journey">
                <Steps current={2} size="small">
                  <Step title="Analysis" description="Credit report reviewed" />
                  <Step title="Disputes Filed" description="12 disputes submitted" />
                  <Step title="In Progress" description="Awaiting responses" />
                  <Step title="Optimization" description="Final improvements" />
                </Steps>
                <Divider />
                <Timeline>
                  <Timeline.Item color="green">
                    <p>Collection account removed from Experian</p>
                    <p style={{ fontSize: 12, color: '#8c8c8c' }}>2024-01-15</p>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <p>Late payment dispute filed with Chase</p>
                    <p style={{ fontSize: 12, color: '#8c8c8c' }}>2024-01-10</p>
                  </Timeline.Item>
                  <Timeline.Item>
                    <p>Credit monitoring activated</p>
                    <p style={{ fontSize: 12, color: '#8c8c8c' }}>2024-01-05</p>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>

            {/* Quick Actions */}
            <Col xs={24} lg={10}>
              <Card title="Quick Actions" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Button type="primary" block icon={<FileTextOutlined />}>
                    Upload Documents
                  </Button>
                  <Button block icon={<CreditCardOutlined />}>
                    View Credit Report
                  </Button>
                  <Button block icon={<CalendarOutlined />}>
                    Schedule Consultation
                  </Button>
                  <Button block icon={<RiseOutlined />}>
                    Track Progress
                  </Button>
                </Space>
              </Card>

              {/* Success Rate */}
              <Card title="Our Success Rate">
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="dashboard"
                    percent={98}
                    format={(percent) => `${percent}%`}
                    strokeColor="#52c41a"
                  />
                  <Paragraph style={{ marginTop: 16 }}>
                    <Text strong>98% Success Rate</Text><br />
                    <Text type="secondary">Average of 130+ point increase</Text>
                  </Paragraph>
                  <Rate disabled defaultValue={5} style={{ fontSize: 16 }} />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">Trusted by 50,000+ clients</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
                  </div>
                ),
              },
              {
                key: 'analytics',
                label: 'Advanced Analytics',
                children: <AdvancedCharts />,
              },
              {
                key: 'data',
                label: 'Data Management',
                children: <AdvancedTables />,
              },
            ]}
          />
        </Content>
      </Layout>

      {/* Notifications Drawer */}
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setNotificationVisible(false)}
        open={notificationVisible}
        width={400}
      >
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<BellOutlined />} />}
                title={item.title}
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </Layout>
    </ConfigProvider>
  );
};

export default AntDashboard;
