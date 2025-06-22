import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Science,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Speed,
  AttachMoney,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { LabTest, fetchLabTests, setSelectedLabTest } from '../store/slices/labTestSlice';
import {
  LabTestOrderForm,
  LabTestResultsEntry,
  LabTestResultView,
  LabTestList,
} from '../components/lab-tests';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lab-tests-tabpanel-${index}`}
      aria-labelledby={`lab-tests-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const LabTests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { labTests, selectedLabTest, loading } = useSelector(
    (state: RootState) => state.labTests
  );

  const [tabValue, setTabValue] = useState(0);
  const [orderingTest, setOrderingTest] = useState(false);
  const [enteringResults, setEnteringResults] = useState(false);
  const [viewingResult, setViewingResult] = useState<LabTest | null>(null);

  useEffect(() => {
    // Fetch lab tests on component mount
    dispatch(fetchLabTests({}));
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: labTests.length,
    pending: labTests.filter(t => t.status === 'ordered' || t.status === 'sample_collected').length,
    inProgress: labTests.filter(t => t.status === 'in_progress').length,
    completed: labTests.filter(t => t.status === 'completed').length,
    statTests: labTests.filter(t => t.priority === 'stat').length,
    revenue: labTests.reduce((sum, test) => sum + (test.is_paid ? test.price : 0), 0),
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewOrder = () => {
    setOrderingTest(true);
    setEnteringResults(false);
    setViewingResult(null);
  };

  const handleViewResult = (test: LabTest) => {
    setViewingResult(test);
    setOrderingTest(false);
    setEnteringResults(false);
  };

  const handleEnterResults = (test: LabTest) => {
    dispatch(setSelectedLabTest(test));
    setEnteringResults(true);
    setOrderingTest(false);
    setViewingResult(null);
  };

  const handleOrderSuccess = (test: LabTest) => {
    setOrderingTest(false);
    // Refresh lab tests
    dispatch(fetchLabTests({}));
  };

  const handleResultsComplete = () => {
    setEnteringResults(false);
    dispatch(setSelectedLabTest(null));
    // Refresh lab tests
    dispatch(fetchLabTests({}));
  };

  if (orderingTest) {
    return (
      <Box>
        <Button onClick={() => setOrderingTest(false)} sx={{ mb: 2 }}>
          ← Back to Lab Tests
        </Button>
        <Typography variant="h4" gutterBottom>
          Order Lab Test
        </Typography>
        <LabTestOrderForm
          onSuccess={handleOrderSuccess}
          onCancel={() => setOrderingTest(false)}
        />
      </Box>
    );
  }

  if (enteringResults && selectedLabTest) {
    return (
      <Box>
        <Button onClick={() => setEnteringResults(false)} sx={{ mb: 2 }}>
          ← Back to Lab Tests
        </Button>
        <Typography variant="h4" gutterBottom>
          Enter Test Results
        </Typography>
        <LabTestResultsEntry
          labTest={selectedLabTest}
          onComplete={handleResultsComplete}
          onCancel={() => setEnteringResults(false)}
        />
      </Box>
    );
  }

  if (viewingResult) {
    return (
      <Box>
        <Button onClick={() => setViewingResult(null)} sx={{ mb: 2 }}>
          ← Back to Lab Tests
        </Button>
        <LabTestResultView
          labTest={viewingResult}
          onClose={() => setViewingResult(null)}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Lab Tests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage laboratory tests and results
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewOrder}
        >
          Order Lab Test
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Tests
                  </Typography>
                  <Typography variant="h5">
                    {stats.total}
                  </Typography>
                </Box>
                <Science color="primary" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Pending
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    {stats.pending}
                  </Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h5" color="info.main">
                    {stats.inProgress}
                  </Typography>
                </Box>
                <Assignment color="info" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {stats.completed}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    STAT Tests
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    {stats.statTests}
                  </Typography>
                </Box>
                <Speed color="error" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Revenue
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    ${stats.revenue}
                  </Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 35 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Tests" />
          <Tab label="Pending Results" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <LabTestList
          labTests={labTests}
          onView={handleViewResult}
          onEnterResults={handleEnterResults}
          onPrint={handleViewResult}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <LabTestList
          labTests={labTests.filter(t => 
            t.status === 'ordered' || 
            t.status === 'sample_collected' || 
            t.status === 'in_progress'
          )}
          onView={handleViewResult}
          onEnterResults={handleEnterResults}
          onPrint={handleViewResult}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <LabTestList
          labTests={labTests.filter(t => t.status === 'completed')}
          onView={handleViewResult}
          onPrint={handleViewResult}
        />
      </TabPanel>
    </Box>
  );
};

export default LabTests;