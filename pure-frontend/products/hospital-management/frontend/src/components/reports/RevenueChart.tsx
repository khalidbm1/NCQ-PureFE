import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TrendingUp, TrendingDown, AttachMoney } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const RevenueChart: React.FC = () => {
  const { reportData } = useSelector((state: RootState) => state.reports);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  if (!reportData) return null;

  const getRevenueData = () => {
    switch (timeRange) {
      case 'daily':
        return reportData.revenue.daily.map(item => ({
          ...item,
          name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }));
      case 'weekly':
        return reportData.revenue.weekly.map(item => ({ ...item, name: item.week }));
      case 'monthly':
        return reportData.revenue.monthly.map(item => ({ ...item, name: item.month }));
      case 'yearly':
        return reportData.revenue.yearly.map(item => ({ ...item, name: item.year }));
      default:
        return [];
    }
  };

  const revenueData = getRevenueData();
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const averageRevenue = totalRevenue / revenueData.length;
  const latestRevenue = revenueData[revenueData.length - 1]?.amount || 0;
  const previousRevenue = revenueData[revenueData.length - 2]?.amount || 0;
  const revenueChange = previousRevenue ? ((latestRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const renderChart = () => {
    const commonProps = {
      data: revenueData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#ff7300" 
              strokeWidth={2}
              dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Average Revenue
                  </Typography>
                  <Typography variant="h5">
                    ${averageRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="overline">
                    Revenue Change
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color={revenueChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                  </Typography>
                </Box>
                {revenueChange >= 0 ? 
                  <TrendingUp fontSize="large" color="success" /> : 
                  <TrendingDown fontSize="large" color="error" />
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Chart */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Revenue Trends</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="area">Area</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="line">Line</ToggleButton>
            </ToggleButtonGroup>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </Paper>

      {/* Revenue Breakdown */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Revenue by Department</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.revenue.byDepartment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.department}: $${entry.amount.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {reportData.revenue.byDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Revenue by Payment Method</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={reportData.revenue.byPaymentMethod}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueChart;