import React from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Statistic,
  Rate,
  Avatar,
  Badge,
  Space,
  Progress,
  Steps,
  Timeline,
  Carousel,
  Divider,
  ConfigProvider,
} from 'antd';
import { creditFixTheme } from '@/config/antTheme';
import {
  TrophyOutlined,
  RiseOutlined,
  SafetyOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  StarOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { useAuth } from '@/contexts/AuthContext';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const AntIndex = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <SafetyOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      title: 'Credit Monitoring',
      description: '24/7 monitoring of your credit reports from all three bureaus',
      color: '#e6f7ff',
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      title: 'Dispute Management',
      description: 'Professional dispute letters sent on your behalf',
      color: '#f6ffed',
    },
    {
      icon: <RiseOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      title: 'Score Improvement',
      description: 'Proven strategies to boost your credit score',
      color: '#f9f0ff',
    },
    {
      icon: <DollarCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      title: 'Tax Filing Services',
      description: 'Professional tax preparation and filing with maximum refunds',
      color: '#fff7e6',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
      title: 'Fast Results',
      description: 'See improvements in as little as 30-60 days',
      color: '#fff0f6',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
      title: 'Expert Support',
      description: 'Dedicated credit & tax specialists to guide you',
      color: '#e6fffb',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      improvement: '580 → 720',
      text: 'CreditFix Pro helped me increase my credit score by 140 points in just 6 months!',
      rating: 5,
      avatar: '/placeholder.svg',
    },
    {
      name: 'Michael Chen',
      improvement: '620 → 780',
      text: 'Amazing service! I was able to qualify for my dream home mortgage.',
      rating: 5,
      avatar: '/placeholder.svg',
    },
    {
      name: 'Lisa Rodriguez',
      improvement: '$3,200 Refund',
      text: 'Their tax service found deductions I missed and got me $3,200 more than expected!',
      rating: 5,
      avatar: '/placeholder.svg',
    },
  ];

  const pricingPlans = [
    {
      title: 'Credit Repair',
      price: 99,
      period: 'month',
      description: 'Professional credit repair services',
      features: [
        'Complete credit report analysis',
        'Unlimited dispute letters',
        'Monthly progress reports',
        'Credit coaching calls',
        'Score simulator access',
        'Email & phone support',
      ],
      popular: false,
      color: '#1890ff',
    },
    {
      title: 'Tax Services',
      price: 149,
      period: 'month',
      description: 'Professional tax preparation & filing',
      features: [
        'Personal tax preparation',
        'Business tax filing',
        'Refund optimization',
        'Tax planning strategy',
        'Audit protection',
        'Year-round support',
      ],
      popular: false,
      color: '#52c41a',
    },
    {
      title: 'Complete Bundle',
      price: 199,
      originalPrice: 248,
      period: 'month',
      description: 'Best value - Credit repair + Tax services',
      features: [
        'Everything in Credit Repair',
        'Everything in Tax Services',
        'Priority processing',
        'Dedicated specialist',
        'Advanced dispute strategies',
        'Attorney review',
        '24/7 phone support',
        'Save $49/month',
      ],
      popular: true,
      color: '#722ed1',
    },
  ];

  return (
    <ConfigProvider theme={creditFixTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <AntNavigation />

      <Content>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e6f7ff 0%, #f9f0ff 100%)',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Badge
              count={<span style={{ color: '#1890ff' }}>★ Trusted by 50,000+ clients</span>}
              style={{ marginBottom: 24 }}
            />

            <Title level={1} style={{ fontSize: 48, marginBottom: 24 }}>
              Transform Your{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Financial Future
              </span>
              <br />
              in 60 Days
            </Title>

            <Paragraph style={{ fontSize: 20, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
              Professional credit repair and tax filing services with guaranteed results.
              Monitor your progress with our personalized dashboard.
            </Paragraph>

            <Space size="large" style={{ marginBottom: 40 }}>
              {user ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  href="/dashboard"
                  style={{
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    height: 48,
                    fontSize: 16,
                  }}
                >
                  View Your Dashboard
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    height: 48,
                    fontSize: 16,
                  }}
                >
                  Start Repair
                </Button>
              )}
              <Button size="large" style={{ height: 48, fontSize: 16 }}>
                Get Free Analysis
              </Button>
            </Space>

            <Row gutter={[24, 24]} justify="center">
              <Col>
                <Statistic title="Success Rate" value={98} suffix="%" valueStyle={{ color: '#52c41a', fontSize: 24 }} />
              </Col>
              <Col>
                <Statistic title="Avg. Score Increase" value={130} prefix="+" valueStyle={{ color: '#1890ff', fontSize: 24 }} />
              </Col>
              <Col>
                <Statistic title="Days to Results" value={45} valueStyle={{ color: '#722ed1', fontSize: 24 }} />
              </Col>
            </Row>
          </div>
        </div>

        {/* Credit Progress Demo */}
        <div style={{ padding: '60px 24px', background: '#fff' }}>
          <Row justify="center">
            <Col xs={24} md={12} lg={8}>
              <Card
                style={{
                  background: 'linear-gradient(135deg, #1890ff10, #722ed110)',
                  border: 'none',
                  borderRadius: 24,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Title level={4} style={{ margin: 0 }}>Your Credit Progress</Title>
                    <Badge count="Live Demo" style={{ backgroundColor: '#722ed1' }} />
                  </div>

                  <Progress
                    type="circle"
                    percent={75}
                    format={() => (
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>720</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Credit Score</div>
                      </div>
                    )}
                    size={120}
                    strokeColor="#52c41a"
                    style={{ marginBottom: 24 }}
                  />

                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic title="This Month" value={45} prefix="+" valueStyle={{ color: '#52c41a', fontSize: 14 }} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Items Removed" value={12} valueStyle={{ color: '#1890ff', fontSize: 14 }} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="Complete" value={95} suffix="%" valueStyle={{ color: '#722ed1', fontSize: 14 }} />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 24px', background: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Title level={2}>Complete Financial Services Solution</Title>
              <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
                Everything you need to rebuild your credit score, maximize tax refunds, and secure your financial future
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card
                    style={{
                      height: '100%',
                      borderRadius: 12,
                      border: 'none',
                      background: feature.color,
                    }}
                    hoverable
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: 16 }}>
                        {feature.icon}
                      </div>
                      <Title level={4}>{feature.title}</Title>
                      <Paragraph>{feature.description}</Paragraph>
                      <Button type="link">Learn More</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ padding: '80px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Title level={2}>Real Results from Real People</Title>
              <Paragraph style={{ fontSize: 18 }}>
                See how our clients have transformed their credit scores and their lives
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card style={{ height: '100%', textAlign: 'center' }}>
                    <div style={{ marginBottom: 16 }}>
                      <Rate disabled defaultValue={testimonial.rating} style={{ fontSize: 16 }} />
                    </div>
                    <Badge
                      count={testimonial.improvement}
                      style={{ backgroundColor: '#52c41a', marginBottom: 16 }}
                    />
                    <Title level={4}>{testimonial.name}</Title>
                    <Paragraph italic>"{testimonial.text}"</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ padding: '80px 24px', background: '#fafafa' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Title level={2}>Choose Your Plan</Title>
              <Paragraph style={{ fontSize: 18 }}>
                Affordable pricing for every budget with no hidden fees
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
              {pricingPlans.map((plan, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card
                    style={{
                      height: '100%',
                      border: plan.popular ? `2px solid ${plan.color}` : '1px solid #d9d9d9',
                      borderRadius: 12,
                      position: 'relative',
                    }}
                  >
                    {plan.popular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <Badge count="Most Popular" style={{ backgroundColor: plan.color }} />
                      </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <Title level={3}>{plan.title}</Title>
                      <Paragraph>{plan.description}</Paragraph>

                      {plan.originalPrice && (
                        <div style={{ marginBottom: 8 }}>
                          <Text delete style={{ fontSize: 14, color: '#8c8c8c' }}>
                            ${plan.originalPrice}/month
                          </Text>
                          <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 500 }}>
                            Save $49
                          </span>
                        </div>
                      )}

                      <div>
                        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>${plan.price}</Text>
                        <Text style={{ color: '#8c8c8c' }}>/{plan.period}</Text>
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      {plan.features.map((feature, i) => (
                        <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                          <Text>{feature}</Text>
                        </div>
                      ))}
                    </div>

                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type={plan.popular ? 'primary' : 'default'}
                        size="large"
                        block
                        style={plan.popular ? {
                          background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
                          border: 'none',
                        } : {}}
                      >
                        Get Started
                      </Button>
                      <Button type="link" block>
                        Book Consultation
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1890ff, #722ed1)',
            padding: '80px 24px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
              Ready to Transform Your Financial Future?
            </Title>
            <Paragraph style={{ fontSize: 20, marginBottom: 40, color: 'rgba(255,255,255,0.9)' }}>
              Join thousands of satisfied customers who have improved their credit scores
              and maximized their tax refunds with CreditFix Pro
            </Paragraph>
            <Space size="large">
              <Button
                type="default"
                size="large"
                style={{ height: 48, fontSize: 16 }}
              >
                View Dashboard Demo
              </Button>
              <Button
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                }}
              >
                Start Free Consultation
              </Button>
            </Space>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ background: '#001529', color: 'white', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white' }}>CreditFix Pro</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
                Transforming financial futures through expert credit repair and tax services.
              </Paragraph>
              <Space>
                <Button type="link" icon={<PhoneOutlined />} style={{ color: 'white' }}>
                  (555) 123-4567
                </Button>
                <Button type="link" icon={<MailOutlined />} style={{ color: 'white' }}>
                  support@creditfixpro.com
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ color: 'white' }}>Services</Title>
              <div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Credit Repair</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Tax Filing</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Credit Monitoring</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Business Credit</Button></div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5} style={{ color: 'white' }}>Company</Title>
              <div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>About Us</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Contact</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>FAQ</Button></div>
                <div><Button type="link" style={{ color: 'rgba(255,255,255,0.7)', padding: 0 }}>Privacy Policy</Button></div>
              </div>
            </Col>
          </Row>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            © 2024 CreditFix Pro. All rights reserved.
          </div>
        </div>
      </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default AntIndex;
