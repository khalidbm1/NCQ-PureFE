import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Receipt,
  Payment,
  TrendingUp,
  Warning,
  AttachMoney,
  Schedule,
  Assessment,
  Close,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchInvoices,
  fetchBillingStatistics,
  setSelectedInvoice,
  Invoice,
  Payment as PaymentType,
} from '../store/slices/invoiceSlice';
import InvoiceForm from '../components/billing/InvoiceForm';
import InvoiceList from '../components/billing/InvoiceList';
import InvoiceView from '../components/billing/InvoiceView';
import PaymentHistory from '../components/billing/PaymentHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`billing-tabpanel-${index}`}
      aria-labelledby={`billing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Billing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, statistics, loading } = useSelector((state: RootState) => state.invoices);
  
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoiceLocal] = useState<Invoice | null>(null);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchInvoices());
    dispatch(fetchBillingStatistics());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoiceLocal(invoice);
    dispatch(setSelectedInvoice(invoice));
    setViewDialogOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoiceLocal(invoice);
    setEditDialogOpen(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoiceLocal(invoice);
    setViewDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    dispatch(fetchInvoices());
    dispatch(fetchBillingStatistics());
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    dispatch(fetchInvoices());
  };

  const handlePaymentSuccess = (payment: PaymentType) => {
    dispatch(fetchInvoices());
    dispatch(fetchBillingStatistics());
  };

  // Calculate additional statistics
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const recentPayments = invoices
    .filter(inv => inv.paid_date)
    .sort((a, b) => new Date(b.paid_date!).getTime() - new Date(a.paid_date!).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Billing & Invoicing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage invoices, process payments, and track billing statistics
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${statistics?.total_revenue.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <AttachMoney fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Outstanding
                  </Typography>
                  <Typography variant="h4">
                    ${statistics?.outstanding_balance.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Schedule fontSize="large" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    This Month
                  </Typography>
                  <Typography variant="h4">
                    ${statistics?.paid_this_month.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <TrendingUp fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Overdue
                  </Typography>
                  <Typography variant="h4" color="error">
                    {statistics?.overdue_invoices || 0}
                  </Typography>
                </Box>
                <Warning fontSize="large" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {(overdueInvoices.length > 0 || pendingInvoices.length > 0) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {overdueInvoices.length > 0 && (
              <Chip
                icon={<Warning />}
                label={`${overdueInvoices.length} Overdue Invoices`}
                color="error"
                onClick={() => setTabValue(0)}
              />
            )}
            {pendingInvoices.length > 0 && (
              <Chip
                icon={<Schedule />}
                label={`${pendingInvoices.length} Pending Invoices`}
                color="warning"
                onClick={() => setTabValue(0)}
              />
            )}
            {statistics?.pending_insurance_claims > 0 && (
              <Chip
                icon={<Receipt />}
                label={`${statistics.pending_insurance_claims} Pending Claims`}
                color="info"
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<Receipt />} label="Invoices" />
          <Tab icon={<Payment />} label="Payments" />
          <Tab icon={<Assessment />} label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <InvoiceList
          onInvoiceSelect={handleInvoiceSelect}
          onEdit={handleEdit}
          onPayment={handlePayment}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <PaymentHistory />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Revenue by Category */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Revenue by Category</Typography>
              {statistics?.revenue_by_category && (
                <Box>
                  {Object.entries(statistics.revenue_by_category).map(([category, amount]) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ${amount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                        <Box
                          sx={{
                            width: `${(amount / statistics.total_revenue) * 100}%`,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            height: '100%',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Payments</Typography>
              {recentPayments.length > 0 ? (
                <Box>
                  {recentPayments.map((invoice) => (
                    <Box key={invoice.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2">
                          {invoice.invoice_number} - {invoice.patient_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invoice.paid_date && new Date(invoice.paid_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${invoice.paid_amount.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent payments
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Monthly Trend */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Monthly Revenue Trend</Typography>
              {statistics?.revenue_by_month && statistics.revenue_by_month.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 200 }}>
                  {statistics.revenue_by_month.map((month) => {
                    const maxRevenue = Math.max(...statistics.revenue_by_month.map(m => m.amount));
                    const height = (month.amount / maxRevenue) * 100;
                    return (
                      <Box key={month.month} sx={{ flex: 1, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: `${height}%`,
                            bgcolor: 'primary.main',
                            borderRadius: '4px 4px 0 0',
                            mb: 1,
                          }}
                        />
                        <Typography variant="caption" display="block">
                          {month.month}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          ${month.amount.toFixed(0)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Create Invoice Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Create New Invoice</Typography>
            <IconButton onClick={() => setCreateDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <InvoiceForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Invoice</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <InvoiceForm
              invoiceToEdit={selectedInvoice}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Invoice Details</Typography>
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <InvoiceView
              invoice={selectedInvoice}
              onEdit={() => {
                setViewDialogOpen(false);
                handleEdit(selectedInvoice);
              }}
              onPayment={handlePaymentSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Billing;