import React, { useState } from 'react';
import {
  AppShell,
  Text,
  Burger,
  useMantineTheme,
  Group,
  ActionIcon,
  Menu,
  Avatar,
  Badge,
  Indicator,
  Box,
  NavLink,
  Flex,
  Button,
} from '@mantine/core';
import {
  IconHome,
  IconCreditCard,
  IconFileText,
  IconChartBar,
  IconSettings,
  IconBell,
  IconUser,
  IconLogout,
  IconShield,
  IconPhone,
  IconHelp,
} from '@tabler/icons-react';

interface MantineNavigationProps {
  children: React.ReactNode;
}

const MantineNavigation: React.FC<MantineNavigationProps> = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const navItems = [
    { icon: IconHome, label: 'Overview', href: '/mantine-dashboard' },
    { icon: IconCreditCard, label: 'Credit Accounts', href: '#accounts' },
    { icon: IconFileText, label: 'Disputes', href: '#disputes' },
    { icon: IconChartBar, label: 'Analytics', href: '#analytics' },
    { icon: IconFileText, label: 'Tax Documents', href: '#tax' },
    { icon: IconSettings, label: 'Settings', href: '#settings' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />

            <Flex align="center" gap="xs" visibleFrom="sm">
              <IconShield size={24} color={theme.colors.blue[6]} />
              <Text
                size="xl"
                fw={700}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              >
                CreditFix Pro
              </Text>
            </Flex>
          </Group>

          <Group>
            <Indicator
              inline
              label="3"
              size={16}
              color="red"
            >
              <ActionIcon variant="light" size="lg">
                <IconBell size={18} />
              </ActionIcon>
            </Indicator>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group style={{ cursor: 'pointer' }}>
                  <Avatar color="blue" radius="xl">
                    SS
                  </Avatar>
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      Sharon Sanchez
                    </Text>
                    <Text c="dimmed" size="xs">
                      Premium Member
                    </Text>
                  </Box>
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  My Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Account Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text
          size="lg"
          fw={700}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
          mb="md"
        >
          CreditFix Pro
        </Text>

        <Box style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              leftSection={<item.icon size={16} />}
              label={item.label}
              onClick={() => setOpened(false)}
              style={{
                borderRadius: theme.radius.md,
              }}
            />
          ))}
        </Box>

        <Group>
          <ActionIcon variant="light" color="blue">
            <IconHelp size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="blue">
            <IconPhone size={16} />
          </ActionIcon>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default MantineNavigation;
