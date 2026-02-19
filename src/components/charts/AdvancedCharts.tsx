import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { Card, Row, Col, Typography, Progress, Statistic, Tag } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Mock data for charts
const creditScoreData = [
  { month: "Jan", score: 580, disputes: 2, target: 750 },
  { month: "Feb", score: 595, disputes: 3, target: 750 },
  { month: "Mar", score: 620, disputes: 5, target: 750 },
  { month: "Apr", score: 645, disputes: 4, target: 750 },
  { month: "May", score: 680, disputes: 6, target: 750 },
  { month: "Jun", score: 720, disputes: 2, target: 750 },
];

const creditMixData = [
  { name: "Credit Cards", value: 35, color: "#3b82f6" },
  { name: "Mortgages", value: 25, color: "#10b981" },
  { name: "Auto Loans", value: 20, color: "#f59e0b" },
  { name: "Personal Loans", value: 15, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#ef4444" },
];

const monthlySpendingData = [
  { month: "Jan", spending: 2800, limit: 5000, utilization: 56 },
  { month: "Feb", spending: 3200, limit: 5000, utilization: 64 },
  { month: "Mar", spending: 2400, limit: 5000, utilization: 48 },
  { month: "Apr", spending: 1800, limit: 5000, utilization: 36 },
  { month: "May", spending: 1500, limit: 5000, utilization: 30 },
  { month: "Jun", spacing: 1200, limit: 5000, utilization: 24 },
];

const bureauComparisonData = [
  { bureau: "Experian", current: 720, previous: 675, change: 45 },
  { bureau: "Equifax", current: 715, previous: 680, change: 35 },
  { bureau: "TransUnion", current: 725, previous: 670, change: 55 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdvancedCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Credit Score Trend */}
      <Card title="Credit Score Trend Analysis" className="shadow-sm">
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis domain={[550, 800]} stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine
                y={750}
                stroke="#10b981"
                strokeDasharray="5 5"
                label="Target Score"
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f620"
                strokeWidth={3}
                name="Credit Score"
              />
              <Bar dataKey="disputes" fill="#8b5cf6" name="Disputes Filed" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Statistic
              title="Current Score"
              value={720}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Monthly Change"
              value={40}
              prefix="+"
              valueStyle={{ color: "#10b981" }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Goal Progress"
              value={85}
              suffix="%"
              valueStyle={{ color: "#3b82f6" }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Disputes Active"
              value={3}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Credit Mix Distribution */}
        <Col xs={24} lg={12}>
          <Card title="Credit Account Mix" className="shadow-sm">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditMixData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {creditMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16 }}>
              {creditMixData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        marginRight: 8,
                        borderRadius: 2,
                      }}
                    />
                    {item.name}
                  </span>
                  <Text strong>{item.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Credit Utilization Trend */}
        <Col xs={24} lg={12}>
          <Card title="Credit Utilization Trend" className="shadow-sm">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={30}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    label="Target 30%"
                  />
                  <Area
                    type="monotone"
                    dataKey="utilization"
                    stroke="#f59e0b"
                    fill="#f59e0b20"
                    name="Utilization %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={24}
                strokeColor="#10b981"
                format={() => `Current: 24%`}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Recommended utilization is below 30%
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bureau Comparison */}
      <Card title="Credit Bureau Score Comparison" className="shadow-sm">
        <Row gutter={16}>
          {bureauComparisonData.map((bureau, index) => (
            <Col xs={24} md={8} key={index}>
              <Card type="inner" className="text-center">
                <Title level={4}>{bureau.bureau}</Title>
                <Statistic
                  value={bureau.current}
                  valueStyle={{
                    fontSize: 32,
                    color: bureau.change > 0 ? "#10b981" : "#ef4444",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Tag color={bureau.change > 0 ? "green" : "red"}>
                    {bureau.change > 0 ? "+" : ""}
                    {bureau.change} points
                  </Tag>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Previous: {bureau.previous}</Text>
                </div>
                <Progress
                  percent={(bureau.current / 850) * 100}
                  strokeColor="#3b82f6"
                  showInfo={false}
                  style={{ marginTop: 16 }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Financial Health Metrics */}
      <Card title="Financial Health Overview" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card type="inner" className="text-center">
              <CreditCardOutlined
                style={{ fontSize: 24, color: "#3b82f6", marginBottom: 8 }}
              />
              <Statistic title="Total Credit Limit" value={25000} prefix="$" />
              <Progress percent={75} strokeColor="#3b82f6" size="small" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card type="inner" className="text-center">
              <DollarOutlined
                style={{ fontSize: 24, color: "#10b981", marginBottom: 8 }}
              />
              <Statistic title="Available Credit" value={18750} prefix="$" />
              <Progress percent={75} strokeColor="#10b981" size="small" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card type="inner" className="text-center">
              <RiseOutlined
                style={{ fontSize: 24, color: "#f59e0b", marginBottom: 8 }}
              />
              <Statistic title="Credit Age" value={8.5} suffix=" years" />
              <Progress percent={65} strokeColor="#f59e0b" size="small" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card type="inner" className="text-center">
              <FallOutlined
                style={{ fontSize: 24, color: "#8b5cf6", marginBottom: 8 }}
              />
              <Statistic
                title="Hard Inquiries"
                value={2}
                suffix=" (6 months)"
              />
              <Progress percent={20} strokeColor="#8b5cf6" size="small" />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdvancedCharts;
