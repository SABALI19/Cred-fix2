import React, { useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Input,
  Space,
  Dropdown,
  DatePicker,
  Select,
  Progress,
  Tooltip,
  Badge,
  Avatar,
  Typography,
  Row,
  Col,
  Statistic,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { RangePickerProps } from "antd/es/date-picker";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// Mock data types
interface CreditAccount {
  key: string;
  accountName: string;
  accountType: string;
  balance: number;
  limit: number;
  utilization: number;
  paymentHistory: string;
  lastUpdated: string;
  status: "excellent" | "good" | "fair" | "poor";
  isDisputed: boolean;
}

interface DisputeRecord {
  key: string;
  disputeId: string;
  bureau: string;
  accountName: string;
  disputeReason: string;
  status: "pending" | "investigating" | "resolved" | "rejected";
  dateSubmitted: string;
  expectedResolution: string;
  priority: "high" | "medium" | "low";
  result?: string;
}

interface TaxDocument {
  key: string;
  documentName: string;
  documentType: string;
  taxYear: number;
  uploadDate: string;
  status: "pending" | "processing" | "verified" | "rejected";
  fileSize: string;
  category: "income" | "deduction" | "tax-form" | "other";
  processingTime?: number;
}

// Mock data
const creditAccountsData: CreditAccount[] = [
  {
    key: "1",
    accountName: "Chase Freedom Unlimited",
    accountType: "Credit Card",
    balance: 2400,
    limit: 8000,
    utilization: 30,
    paymentHistory: "On Time",
    lastUpdated: "2024-01-15",
    status: "good",
    isDisputed: false,
  },
  {
    key: "2",
    accountName: "Bank of America Cash Rewards",
    accountType: "Credit Card",
    balance: 1200,
    limit: 5000,
    utilization: 24,
    paymentHistory: "On Time",
    lastUpdated: "2024-01-14",
    status: "excellent",
    isDisputed: true,
  },
  {
    key: "3",
    accountName: "Wells Fargo Auto Loan",
    accountType: "Auto Loan",
    balance: 18500,
    limit: 25000,
    utilization: 74,
    paymentHistory: "1 Late (30 days)",
    lastUpdated: "2024-01-10",
    status: "fair",
    isDisputed: true,
  },
  {
    key: "4",
    accountName: "Capital One Venture",
    accountType: "Credit Card",
    balance: 0,
    limit: 10000,
    utilization: 0,
    paymentHistory: "On Time",
    lastUpdated: "2024-01-12",
    status: "excellent",
    isDisputed: false,
  },
];

const disputeRecordsData: DisputeRecord[] = [
  {
    key: "1",
    disputeId: "DSP-2024-001",
    bureau: "Experian",
    accountName: "Chase Freedom Unlimited",
    disputeReason: "Incorrect balance reported",
    status: "investigating",
    dateSubmitted: "2024-01-01",
    expectedResolution: "2024-01-31",
    priority: "high",
  },
  {
    key: "2",
    disputeId: "DSP-2024-002",
    bureau: "Equifax",
    accountName: "Wells Fargo Auto Loan",
    disputeReason: "Late payment should be removed",
    status: "resolved",
    dateSubmitted: "2023-12-15",
    expectedResolution: "2024-01-15",
    priority: "medium",
    result: "Late payment removed successfully",
  },
  {
    key: "3",
    disputeId: "DSP-2024-003",
    bureau: "TransUnion",
    accountName: "Collection Account - ABC Medical",
    disputeReason: "Account does not belong to me",
    status: "pending",
    dateSubmitted: "2024-01-05",
    expectedResolution: "2024-02-05",
    priority: "high",
  },
];

const taxDocumentsData: TaxDocument[] = [
  {
    key: "1",
    documentName: "W-2 Form - Employer ABC",
    documentType: "W-2",
    taxYear: 2023,
    uploadDate: "2024-01-15",
    status: "verified",
    fileSize: "1.2 MB",
    category: "income",
    processingTime: 2,
  },
  {
    key: "2",
    documentName: "1099-INT - Bank Interest",
    documentType: "1099-INT",
    taxYear: 2023,
    uploadDate: "2024-01-14",
    status: "processing",
    fileSize: "0.8 MB",
    category: "income",
    processingTime: 5,
  },
  {
    key: "3",
    documentName: "Medical Expenses Receipt",
    documentType: "Receipt",
    taxYear: 2023,
    uploadDate: "2024-01-12",
    status: "pending",
    fileSize: "2.1 MB",
    category: "deduction",
  },
];

const AdvancedTables: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Credit Accounts Table Columns
  const creditAccountColumns: ColumnsType<CreditAccount> = [
    {
      title: "Account",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.accountType}
          </Text>
          {record.isDisputed && (
            <Badge
              count="Disputed"
              style={{
                backgroundColor: "#f59e0b",
                fontSize: 10,
                marginLeft: 8,
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: "Balance / Limit",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (_, record) => (
        <div>
          <div>${record.balance.toLocaleString()}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            / ${record.limit.toLocaleString()}
          </Text>
        </div>
      ),
    },
    {
      title: "Utilization",
      dataIndex: "utilization",
      key: "utilization",
      sorter: (a, b) => a.utilization - b.utilization,
      render: (utilization) => (
        <div>
          <Progress
            percent={utilization}
            size="small"
            strokeColor={utilization > 30 ? "#ef4444" : "#10b981"}
          />
          <Text style={{ fontSize: 12 }}>{utilization}%</Text>
        </div>
      ),
    },
    {
      title: "Payment History",
      dataIndex: "paymentHistory",
      key: "paymentHistory",
      render: (history) => {
        const isOnTime = history === "On Time";
        return (
          <Tag color={isOnTime ? "green" : "orange"}>
            {isOnTime ? <CheckCircleOutlined /> : <WarningOutlined />}
            {history}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Excellent", value: "excellent" },
        { text: "Good", value: "good" },
        { text: "Fair", value: "fair" },
        { text: "Poor", value: "poor" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colors = {
          excellent: "green",
          good: "blue",
          fair: "orange",
          poor: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Edit Account">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Dispute">
            <Button
              type="text"
              icon={<ExclamationCircleOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Dispute Records Table Columns
  const disputeColumns: ColumnsType<DisputeRecord> = [
    {
      title: "Dispute ID",
      dataIndex: "disputeId",
      key: "disputeId",
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "Bureau",
      dataIndex: "bureau",
      key: "bureau",
      filters: [
        { text: "Experian", value: "Experian" },
        { text: "Equifax", value: "Equifax" },
        { text: "TransUnion", value: "TransUnion" },
      ],
      onFilter: (value, record) => record.bureau === value,
      render: (bureau) => <Tag color="blue">{bureau}</Tag>,
    },
    {
      title: "Account",
      dataIndex: "accountName",
      key: "accountName",
      ellipsis: true,
    },
    {
      title: "Reason",
      dataIndex: "disputeReason",
      key: "disputeReason",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Investigating", value: "investigating" },
        { text: "Resolved", value: "resolved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const configs = {
          pending: { color: "orange", icon: <ClockCircleOutlined /> },
          investigating: { color: "blue", icon: <SearchOutlined /> },
          resolved: { color: "green", icon: <CheckCircleOutlined /> },
          rejected: { color: "red", icon: <ExclamationCircleOutlined /> },
        };
        const config = configs[status];
        return (
          <Tag color={config.color}>
            {config.icon} {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const colors = { high: "red", medium: "orange", low: "green" };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Submitted",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<DownloadOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  // Tax Documents Table Columns
  const taxDocumentColumns: ColumnsType<TaxDocument> = [
    {
      title: "Document",
      dataIndex: "documentName",
      key: "documentName",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Tag size="small">{record.documentType}</Tag>
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
            {record.taxYear}
          </Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Income", value: "income" },
        { text: "Deduction", value: "deduction" },
        { text: "Tax Form", value: "tax-form" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => {
        const colors = {
          income: "green",
          deduction: "blue",
          "tax-form": "purple",
          other: "default",
        };
        return <Tag color={colors[category]}>{category.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const configs = {
          pending: { color: "orange", icon: <ClockCircleOutlined /> },
          processing: { color: "blue", icon: <SearchOutlined /> },
          verified: { color: "green", icon: <CheckCircleOutlined /> },
          rejected: { color: "red", icon: <ExclamationCircleOutlined /> },
        };
        const config = configs[status];
        return (
          <div>
            <Tag color={config.color}>
              {config.icon} {status.toUpperCase()}
            </Tag>
            {record.processingTime && (
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Processing: {record.processingTime} days
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "File Size",
      dataIndex: "fileSize",
      key: "fileSize",
      sorter: (a, b) => {
        const getBytes = (size: string) => {
          const num = parseFloat(size);
          return size.includes("MB") ? num * 1024 * 1024 : num * 1024;
        };
        return getBytes(a.fileSize) - getBytes(b.fileSize);
      },
    },
    {
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
      sorter: (a, b) =>
        new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<DownloadOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const rowSelection: TableProps<any>["rowSelection"] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={creditAccountsData.length}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Active Disputes"
              value={
                disputeRecordsData.filter((d) => d.status !== "resolved").length
              }
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Documents Uploaded"
              value={taxDocumentsData.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Avg. Utilization"
              value={25}
              suffix="%"
              prefix={<FallOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Credit Accounts Table */}
      <Card
        title="Credit Accounts"
        extra={
          <Space>
            <Search
              placeholder="Search accounts..."
              onSearch={setSearchText}
              style={{ width: 200 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setFilterStatus}
            >
              <Option value="all">All Status</Option>
              <Option value="excellent">Excellent</Option>
              <Option value="good">Good</Option>
              <Option value="fair">Fair</Option>
              <Option value="poor">Poor</Option>
            </Select>
            <Button icon={<DownloadOutlined />}>Export</Button>
          </Space>
        }
      >
        <Table
          columns={creditAccountColumns}
          dataSource={creditAccountsData}
          rowSelection={rowSelection}
          pagination={{
            total: creditAccountsData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Dispute Records Table */}
      <Card
        title="Dispute Management"
        extra={
          <Space>
            <RangePicker size="small" />
            <Button type="primary">New Dispute</Button>
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Space>
        }
      >
        <Table
          columns={disputeColumns}
          dataSource={disputeRecordsData}
          pagination={{
            total: disputeRecordsData.length,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} disputes`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Tax Documents Table */}
      <Card
        title="Tax Document Management"
        extra={
          <Space>
            <Select defaultValue="2023" style={{ width: 100 }}>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
              <Option value="2021">2021</Option>
            </Select>
            <Button type="primary">Upload Document</Button>
          </Space>
        }
      >
        <Table
          columns={taxDocumentColumns}
          dataSource={taxDocumentsData}
          pagination={{
            total: taxDocumentsData.length,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} documents`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AdvancedTables;
