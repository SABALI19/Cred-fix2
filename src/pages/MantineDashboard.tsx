import React, { useState } from 'react';
import {
  Container,
  Tabs,
  Grid,
  Card,
  Text,
  Progress,
  Group,
  ThemeIcon,
  Stack,
  Table,
  Badge,
  ActionIcon,
  Paper,
  Title,
  Button,
  Select,
  TextInput,
  SimpleGrid,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconCreditCard,
  IconTrendingUp,
  IconFileText,
  IconChartBar,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconDownload,
  IconRefresh,
} from '@tabler/icons-react';
import MantineNavigation from '../components/MantineNavigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const MantineDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  // Sample data
  const creditScoreData = [
    { month: 'Jan', score: 580 },
    { month: 'Feb', score: 595 },
    { month: 'Mar', score: 620 },
    { month: 'Apr', score: 645 },
    { month: 'May', score: 680 },
    { month: 'Jun', score: 720 },
  ];

  const creditMixData = [
    { name: 'Credit Cards', value: 35, color: '#3b82f6' },
    { name: 'Mortgages', value: 25, color: '#10b981' },
    { name: 'Auto Loans', value: 20, color: '#f59e0b' },
    { name: 'Personal Loans', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#ef4444' },
  ];

  const accounts = [
    {
      id: 1,
      name: 'Chase Freedom Unlimited',
      type: 'Credit Card',
      balance: '$2,450',
      limit: '$5,000',
      utilization: 49,
      status: 'good',
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      name: 'Bank of America Cash Rewards',
      type: 'Credit Card',
      balance: '$890',
      limit: '$3,000',
      utilization: 30,
      status: 'excellent',
      lastUpdated: '2024-01-14',
    },
    {
      id: 3,
      name: 'Wells Fargo Auto Loan',
      type: 'Auto Loan',
      balance: '$18,500',
      limit: '$25,000',
      utilization: 74,
      status: 'fair',
      lastUpdated: '2024-01-10',
    },
  ];

  const disputes = [
    {
      id: 'DSP-2024-001',
      bureau: 'Experian',
      account: 'Chase Freedom Unlimited',
      reason: 'Incorrect balance reported',
      status: 'investigating',
      submitted: '2024-01-01',
      expected: '2024-01-31',
      priority: 'high',
    },
    {
      id: 'DSP-2024-002',
      bureau: 'Equifax',
      account: 'Wells Fargo Auto Loan',
      reason: 'Late payment should be removed',
      status: 'resolved',
      submitted: '2023-12-15',
      expected: '2024-01-15',
      priority: 'medium',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'green',
      good: 'blue',
      fair: 'orange',
      poor: 'red',
      investigating: 'blue',
      resolved: 'green',
      pending: 'orange',
      rejected: 'red',
      high: 'red',
      medium: 'orange',
      low: 'green',
    };
    return colors[status] || 'gray';
  };

  return (
    <MantineNavigation>
      <Container size="xl" py="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconChartBar size={14} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconTrendingUp size={14} />}>
              Advanced Analytics
            </Tabs.Tab>
            <Tabs.Tab value="data" leftSection={<IconFileText size={14} />}>
              Data Management
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={12}>
                <SimpleGrid cols={4} spacing="md" breakpoints={[{ maxWidth: 'md', cols: 2 }]}>
                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                          Credit Score
                        </Text>
                        <Text fw={700} size="xl">
                          720
                        </Text>
                      </div>
                      <ThemeIcon color="green" variant="light" size={38} radius="md">
                        <IconTrendingUp size={24} />
                      </ThemeIcon>
                    </Group>
                    <Text c="green" size="sm" fw={500} mt="md">
                      +45 points this month
                    </Text>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                          Active Disputes
                        </Text>
                        <Text fw={700} size="xl">
                          3
                        </Text>
                      </div>
                      <ThemeIcon color="orange" variant="light" size={38} radius="md">
                        <IconFileText size={24} />
                      </ThemeIcon>
                    </Group>
                    <Text c="orange" size="sm" fw={500} mt="md">
                      2 in progress
                    </Text>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                          Credit Utilization
                        </Text>
                        <Text fw={700} size="xl">
                          24%
                        </Text>
                      </div>
                      <ThemeIcon color="blue" variant="light" size={38} radius="md">
                        <IconCreditCard size={24} />
                      </ThemeIcon>
                    </Group>
                    <Text c="green" size="sm" fw={500} mt="md">
                      -15% from last month
                    </Text>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                          Tax Documents
                        </Text>
                        <Text fw={700} size="xl">
                          12
                        </Text>
                      </div>
                      <ThemeIcon color="purple" variant="light" size={38} radius="md">
                        <IconFileText size={24} />
                      </ThemeIcon>
                    </Group>
                    <Text c="green" size="sm" fw={500} mt="md">
                      All verified
                    </Text>
                  </Card>
                </SimpleGrid>
              </Grid.Col>

              <Grid.Col md={8}>
                <Card withBorder p="md">
                  <Group justify="space-between" mb="md">
                    <Title order={4}>Credit Score Trend</Title>
                    <ActionIcon variant="subtle">
                      <IconRefresh size={16} />
                    </ActionIcon>
                  </Group>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={creditScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[500, 800]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid.Col>

              <Grid.Col md={4}>
                <Card withBorder p="md">
                  <Title order={4} mb="md">Credit Mix</Title>
                  <Center>
                    <RingProgress
                      size={200}
                      thickness={16}
                      sections={creditMixData.map((item) => ({
                        value: item.value,
                        color: item.color,
                        tooltip: `${item.name}: ${item.value}%`,
                      }))}
                      label={
                        <Text size="xs" ta="center">
                          Account Types
                        </Text>
                      }
                    />
                  </Center>
                  <Stack gap="xs" mt="md">
                    {creditMixData.map((item, index) => (
                      <Group key={index} justify="space-between">
                        <Group gap="xs">
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: item.color,
                            }}
                          />
                          <Text size="sm">{item.name}</Text>
                        </Group>
                        <Text size="sm" fw={500}>
                          {item.value}%
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <Grid>
              <Grid.Col span={12}>
                <Title order={3} mb="md">Advanced Financial Analytics</Title>
              </Grid.Col>
              
              <Grid.Col md={6}>
                <Card withBorder p="md">
                  <Title order={4} mb="md">Monthly Credit Utilization</Title>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={creditScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid.Col>

              <Grid.Col md={6}>
                <Card withBorder p="md">
                  <Title order={4} mb="md">Bureau Comparison</Title>
                  <Stack gap="md">
                    {[
                      { bureau: 'Experian', score: 720, change: '+45' },
                      { bureau: 'Equifax', score: 715, change: '+35' },
                      { bureau: 'TransUnion', score: 725, change: '+55' },
                    ].map((item, index) => (
                      <Group key={index} justify="space-between">
                        <Text fw={500}>{item.bureau}</Text>
                        <Group gap="xs">
                          <Text size="lg" fw={700}>
                            {item.score}
                          </Text>
                          <Badge color="green" variant="light">
                            {item.change}
                          </Badge>
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="data" pt="md">
            <Stack gap="xl">
              <div>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Credit Accounts</Title>
                  <Group>
                    <TextInput
                      placeholder="Search accounts..."
                      leftSection={<IconSearch size={14} />}
                      size="sm"
                    />
                    <Button leftSection={<IconPlus size={14} />} size="sm">
                      Add Account
                    </Button>
                  </Group>
                </Group>

                <Card withBorder p={0}>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Account</Table.Th>
                        <Table.Th>Balance/Limit</Table.Th>
                        <Table.Th>Utilization</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Last Updated</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {accounts.map((account) => (
                        <Table.Tr key={account.id}>
                          <Table.Td>
                            <div>
                              <Text fw={500}>{account.name}</Text>
                              <Text size="sm" c="dimmed">
                                {account.type}
                              </Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Text>{account.balance} / {account.limit}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Progress
                                value={account.utilization}
                                size="sm"
                                style={{ width: 60 }}
                                color={account.utilization > 30 ? 'red' : 'green'}
                              />
                              <Text size="sm">{account.utilization}%</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={getStatusColor(account.status)} variant="light">
                              {account.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{account.lastUpdated}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <ActionIcon size="sm" variant="subtle">
                                <IconEye size={14} />
                              </ActionIcon>
                              <ActionIcon size="sm" variant="subtle">
                                <IconEdit size={14} />
                              </ActionIcon>
                              <ActionIcon size="sm" variant="subtle" color="red">
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </div>

              <div>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Active Disputes</Title>
                  <Group>
                    <Select
                      placeholder="Filter by status"
                      leftSection={<IconFilter size={14} />}
                      size="sm"
                      data={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'investigating', label: 'Investigating' },
                        { value: 'resolved', label: 'Resolved' },
                      ]}
                    />
                    <Button leftSection={<IconPlus size={14} />} size="sm">
                      New Dispute
                    </Button>
                  </Group>
                </Group>

                <Card withBorder p={0}>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Dispute ID</Table.Th>
                        <Table.Th>Bureau</Table.Th>
                        <Table.Th>Account</Table.Th>
                        <Table.Th>Reason</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Priority</Table.Th>
                        <Table.Th>Submitted</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {disputes.map((dispute) => (
                        <Table.Tr key={dispute.id}>
                          <Table.Td>
                            <Text fw={500}>{dispute.id}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color="blue" variant="light">
                              {dispute.bureau}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{dispute.account}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{dispute.reason}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={getStatusColor(dispute.status)} variant="light">
                              {dispute.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={getStatusColor(dispute.priority)} variant="light">
                              {dispute.priority}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{dispute.submitted}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <ActionIcon size="sm" variant="subtle">
                                <IconEye size={14} />
                              </ActionIcon>
                              <ActionIcon size="sm" variant="subtle">
                                <IconDownload size={14} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </div>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineNavigation>
  );
};

export default MantineDashboard;
