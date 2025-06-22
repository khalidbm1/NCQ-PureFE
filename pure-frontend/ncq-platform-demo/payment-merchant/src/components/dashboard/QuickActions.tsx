'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
} from '@mui/material'
import {
  Add,
  Link,
  Code,
  Receipt,
  AccountBalance,
  CreditCard,
  QrCode,
  Settings,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface QuickActionProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  color: string
}

const QuickActionCard = ({ icon, title, description, onClick, color }: QuickActionProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
          borderColor: `${color}.main`,
        },
        border: 1,
        borderColor: 'divider',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
)

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: <Link sx={{ color: 'primary.main' }} />,
      title: 'Create Payment Link',
      description: 'Generate a quick payment link',
      onClick: () => router.push('/payment-links/create'),
      color: 'primary',
    },
    {
      icon: <Code sx={{ color: 'secondary.main' }} />,
      title: 'API Integration',
      description: 'View integration guides',
      onClick: () => router.push('/developers'),
      color: 'secondary',
    },
    {
      icon: <Receipt sx={{ color: 'success.main' }} />,
      title: 'View Transactions',
      description: 'Check recent payments',
      onClick: () => router.push('/transactions'),
      color: 'success',
    },
    {
      icon: <AccountBalance sx={{ color: 'info.main' }} />,
      title: 'Settlement Report',
      description: 'Check your payouts',
      onClick: () => router.push('/settlements'),
      color: 'info',
    },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <QuickActionCard {...action} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}