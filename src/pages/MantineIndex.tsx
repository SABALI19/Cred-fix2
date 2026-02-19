import React from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Grid,
  Card,
  Image,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Stack,
  Paper,
  Avatar,
  Rating,
  Center,
  Box,
  Anchor,
} from '@mantine/core';
import {
  IconShield,
  IconCreditCard,
  IconFileText,
  IconChartBar,
  IconUsers,
  IconTrendingUp,
  IconCheck,
  IconStar,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const MantineIndex: React.FC = () => {
  const features = [
    {
      icon: IconCreditCard,
      title: 'Credit Repair',
      description: 'Remove negative items and improve your credit score with our proven strategies.',
    },
    {
      icon: IconFileText,
      title: 'Tax Services',
      description: 'Professional tax preparation and filing services to maximize your refunds.',
    },
    {
      icon: IconChartBar,
      title: 'Financial Analytics',
      description: 'Detailed insights and tracking of your financial progress over time.',
    },
    {
      icon: IconShield,
      title: 'Identity Protection',
      description: 'Comprehensive monitoring and protection against identity theft.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'CreditFix Pro helped me increase my credit score by 150 points in just 6 months!',
      rating: 5,
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'The tax services saved me thousands. Their expertise is unmatched.',
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      content: 'Professional, reliable, and results-driven. Highly recommended!',
      rating: 5,
      avatar: 'ER',
    },
  ];

  const plans = [
    {
      name: 'Basic',
      price: '$99',
      period: 'month',
      features: [
        'Credit monitoring',
        'Basic dispute assistance',
        'Monthly credit reports',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$199',
      period: 'month',
      features: [
        'Everything in Basic',
        'Advanced dispute handling',
        'Tax consultation',
        'Priority phone support',
        'Financial coaching',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$399',
      period: 'month',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Full tax preparation',
        '24/7 support',
        'Custom financial strategies',
      ],
      popular: false,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.cyan[5]} 100%)`,
          color: 'white',
          padding: '100px 0',
        })}
      >
        <Container size="lg">
          <Grid align="center">
            <Grid.Col md={6}>
              <Stack spacing="xl">
                <Title size="3rem" fw={700}>
                  Transform Your Financial Future
                </Title>
                <Text size="xl" opacity={0.9}>
                  Professional credit repair and tax services that deliver real results.
                  Join thousands of satisfied customers who've improved their financial standing.
                </Text>
                <Group>
                  <Button
                    component={Link}
                    to="/mantine-dashboard"
                    size="lg"
                    variant="white"
                    color="blue"
                    radius="md"
                  >
                    Get Started Today
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    radius="md"
                  >
                    Learn More
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col md={6}>
              <Center>
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=500"
                  alt="Financial dashboard"
                  radius="md"
                />
              </Center>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="lg" py={80}>
        <Stack spacing="xl" align="center" mb={60}>
          <Badge size="lg" variant="light">
            Our Services
          </Badge>
          <Title order={2} align="center">
            Everything You Need for Financial Success
          </Title>
          <Text size="lg" color="dimmed" align="center" maw={600}>
            From credit repair to tax services, we provide comprehensive financial solutions
            tailored to your unique needs.
          </Text>
        </Stack>

        <SimpleGrid cols={2} spacing="xl" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {features.map((feature, index) => (
            <Paper key={index} p="xl" radius="md" withBorder>
              <Group>
                <ThemeIcon size={60} radius="md" color="blue">
                  <feature.icon size={30} />
                </ThemeIcon>
                <Stack spacing="xs" sx={{ flex: 1 }}>
                  <Title order={3}>{feature.title}</Title>
                  <Text color="dimmed">{feature.description}</Text>
                </Stack>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

      {/* Testimonials Section */}
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
          padding: '80px 0',
        })}
      >
        <Container size="lg">
          <Stack spacing="xl" align="center" mb={60}>
            <Badge size="lg" variant="light">
              Client Success Stories
            </Badge>
            <Title order={2} align="center">
              Trusted by Thousands of Customers
            </Title>
          </Stack>

          <SimpleGrid cols={3} spacing="xl" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} p="xl" radius="md" withBorder>
                <Stack spacing="md">
                  <Rating value={testimonial.rating} readOnly />
                  <Text>{testimonial.content}</Text>
                  <Group>
                    <Avatar color="blue" radius="xl">
                      {testimonial.avatar}
                    </Avatar>
                    <Stack gap={0}>
                      <Text fw={500}>{testimonial.name}</Text>
                      <Text size="sm" color="dimmed">
                        {testimonial.role}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container size="lg" py={80}>
        <Stack spacing="xl" align="center" mb={60}>
          <Badge size="lg" variant="light">
            Pricing Plans
          </Badge>
          <Title order={2} align="center">
            Choose the Right Plan for You
          </Title>
        </Stack>

        <SimpleGrid cols={3} spacing="xl" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {plans.map((plan, index) => (
            <Card
              key={index}
              p="xl"
              radius="md"
              withBorder
              sx={(theme) => ({
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                border: plan.popular ? `2px solid ${theme.colors.blue[6]}` : undefined,
              })}
            >
              {plan.popular && (
                <Badge
                  color="blue"
                  variant="filled"
                  sx={{ position: 'absolute', top: -10, right: 20 }}
                >
                  Most Popular
                </Badge>
              )}

              <Stack spacing="md">
                <Title order={3}>{plan.name}</Title>
                <Group align="baseline">
                  <Text size="3rem" fw={700} c="blue">
                    {plan.price}
                  </Text>
                  <Text color="dimmed">/{plan.period}</Text>
                </Group>

                <Stack spacing="xs">
                  {plan.features.map((feature, idx) => (
                    <Group key={idx} spacing="xs">
                      <ThemeIcon size={20} color="green" variant="light" radius="xl">
                        <IconCheck size={12} />
                      </ThemeIcon>
                      <Text size="sm">{feature}</Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  fullWidth
                  variant={plan.popular ? 'filled' : 'outline'}
                  color="blue"
                  size="md"
                  mt="md"
                >
                  Get Started
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[8],
          color: 'white',
          padding: '40px 0',
        })}
      >
        <Container size="lg">
          <Grid>
            <Grid.Col md={6}>
              <Stack spacing="xs">
                <Text size="lg" fw={700}>
                  CreditFix Pro
                </Text>
                <Text color="dimmed">
                  Your trusted partner for financial success and credit improvement.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col md={6}>
                <Group justify="flex-end">
                <Anchor color="white" href="#" size="sm">
                  Privacy Policy
                </Anchor>
                <Anchor color="white" href="#" size="sm">
                  Terms of Service
                </Anchor>
                <Anchor color="white" href="#" size="sm">
                  Contact
                </Anchor>
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MantineIndex;
