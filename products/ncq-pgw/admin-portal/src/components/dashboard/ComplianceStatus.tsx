'use client'

import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import {
  Security,
  VerifiedUser,
  Policy,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'

interface ComplianceItem {
  id: string
  name: string
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending'
  description: string
  lastChecked: string
  nextAudit?: string
  score?: number
}

const statusConfig = {
  compliant: {
    color: 'success' as const,
    icon: <CheckCircle />,
    label: 'Compliant',
  },
  warning: {
    color: 'warning' as const,
    icon: <Warning />,
    label: 'Needs Attention',
  },
  'non-compliant': {
    color: 'error' as const,
    icon: <Warning />,
    label: 'Non-Compliant',
  },
  pending: {
    color: 'info' as const,
    icon: <Schedule />,
    label: 'Pending Review',
  },
}

export function ComplianceStatus() {
  const { data: compliance, isLoading } = useQuery({
    queryKey: ['compliance-status'],
    queryFn: () => dashboardService.getComplianceStatus(),
    refetchInterval: 300000, // Refresh every 5 minutes
  })

  const overallScore = compliance?.overallScore || 0
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success.main'
    if (score >= 70) return 'warning.main'
    return 'error.main'
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Compliance Status</Typography>
          <Security color="primary" />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Overall Compliance Score */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
              p={2}
              bgcolor="action.hover"
              borderRadius={1}
            >
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={overallScore}
                  size={80}
                  thickness={4}
                  sx={{
                    color: getScoreColor(overallScore),
                  }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="h5"
                    component="div"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    {overallScore}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Overall Compliance Score
              </Typography>
            </Box>

            {/* Compliance Items */}
            <List dense sx={{ py: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <VerifiedUser color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="PCI DSS Level 1"
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance?.pciDssScore || 0}
                        sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption">
                        {compliance?.pciDssScore || 0}%
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  size="small"
                  label={statusConfig[compliance?.pciDssStatus || 'pending'].label}
                  color={statusConfig[compliance?.pciDssStatus || 'pending'].color}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Policy color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="SAMA Compliance"
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <LinearProgress
                        variant="determinate"
                        value={compliance?.samaScore || 0}
                        sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption">
                        {compliance?.samaScore || 0}%
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  size="small"
                  label={statusConfig[compliance?.samaStatus || 'pending'].label}
                  color={statusConfig[compliance?.samaStatus || 'pending'].color}
                />
              </ListItem>

              {compliance?.items?.map((item: ComplianceItem) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {statusConfig[item.status].icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Tooltip title={item.description}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Tooltip>
                    }
                  />
                  <Chip
                    size="small"
                    label={statusConfig[item.status].label}
                    color={statusConfig[item.status].color}
                  />
                </ListItem>
              ))}
            </List>

            {/* Next Audit Date */}
            {compliance?.nextAudit && (
              <Box
                mt={2}
                p={1.5}
                bgcolor="primary.light"
                borderRadius={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Schedule fontSize="small" />
                <Typography variant="caption">
                  Next audit: {new Date(compliance.nextAudit).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}