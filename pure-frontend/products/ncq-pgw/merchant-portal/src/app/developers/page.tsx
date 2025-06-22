'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Alert,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ContentCopy,
  Download,
  PlayArrow,
  Code,
  Smartphone,
  Web,
  Api,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const { enqueueSnackbar } = useSnackbar()

  const handleCopy = () => {
    enqueueSnackbar('Code copied to clipboard', { variant: 'success' })
  }

  const javascriptExample = `// Install the NCQ Payment SDK
// npm install @ncq/payment-gateway-sdk

import { NCQPaymentGateway } from '@ncq/payment-gateway-sdk';

// Initialize the SDK
const ncq = new NCQPaymentGateway({
  merchantId: 'NCQ12345678',
  apiKey: 'pk_test_51234567890abcdef',
  environment: 'sandbox' // or 'production'
});

// Create a payment
async function createPayment() {
  try {
    const payment = await ncq.payments.create({
      amount: 1000, // Amount in halalah (10.00 SAR)
      currency: 'SAR',
      description: 'Order #12345',
      customer: {
        email: 'customer@example.com',
        name: 'Ahmed Al-Saudi',
        phone: '+966501234567'
      },
      metadata: {
        orderId: '12345',
        customField: 'value'
      },
      returnUrl: 'https://yoursite.com/payment/success',
      webhookUrl: 'https://yoursite.com/webhooks/payment'
    });

    console.log('Payment created:', payment);
    // Redirect customer to payment.checkoutUrl
    window.location.href = payment.checkoutUrl;
  } catch (error) {
    console.error('Payment error:', error);
  }
}

// Handle webhook
app.post('/webhooks/payment', async (req, res) => {
  const signature = req.headers['x-ncq-signature'];
  
  // Verify webhook signature
  if (ncq.webhooks.verify(req.body, signature)) {
    const event = req.body;
    
    switch (event.type) {
      case 'payment.succeeded':
        // Handle successful payment
        console.log('Payment successful:', event.data);
        break;
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', event.data);
        break;
    }
    
    res.status(200).send('OK');
  } else {
    res.status(400).send('Invalid signature');
  }
});`

  const phpExample = `<?php
// Install via Composer
// composer require ncq/payment-gateway-sdk

require_once 'vendor/autoload.php';

use NCQ\\PaymentGateway\\Client;
use NCQ\\PaymentGateway\\Exception\\NCQException;

// Initialize the SDK
$ncq = new Client([
    'merchant_id' => 'NCQ12345678',
    'api_key' => 'pk_test_51234567890abcdef',
    'environment' => 'sandbox' // or 'production'
]);

// Create a payment
try {
    $payment = $ncq->payments->create([
        'amount' => 1000, // Amount in halalah (10.00 SAR)
        'currency' => 'SAR',
        'description' => 'Order #12345',
        'customer' => [
            'email' => 'customer@example.com',
            'name' => 'Ahmed Al-Saudi',
            'phone' => '+966501234567'
        ],
        'metadata' => [
            'order_id' => '12345',
            'custom_field' => 'value'
        ],
        'return_url' => 'https://yoursite.com/payment/success',
        'webhook_url' => 'https://yoursite.com/webhooks/payment'
    ]);

    // Redirect customer to checkout
    header('Location: ' . $payment->checkout_url);
    exit;
} catch (NCQException $e) {
    echo 'Payment error: ' . $e->getMessage();
}

// Handle webhook
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_NCQ_SIGNATURE'] ?? '';

if ($ncq->webhooks->verify($payload, $signature)) {
    $event = json_decode($payload, true);
    
    switch ($event['type']) {
        case 'payment.succeeded':
            // Handle successful payment
            error_log('Payment successful: ' . json_encode($event['data']));
            break;
        case 'payment.failed':
            // Handle failed payment
            error_log('Payment failed: ' . json_encode($event['data']));
            break;
    }
    
    http_response_code(200);
    echo 'OK';
} else {
    http_response_code(400);
    echo 'Invalid signature';
}
?>`

  const pythonExample = `# Install the NCQ Payment SDK
# pip install ncq-payment-gateway

from ncq_payment_gateway import NCQPaymentGateway
from ncq_payment_gateway.exceptions import NCQException

# Initialize the SDK
ncq = NCQPaymentGateway(
    merchant_id='NCQ12345678',
    api_key='pk_test_51234567890abcdef',
    environment='sandbox'  # or 'production'
)

# Create a payment
try:
    payment = ncq.payments.create(
        amount=1000,  # Amount in halalah (10.00 SAR)
        currency='SAR',
        description='Order #12345',
        customer={
            'email': 'customer@example.com',
            'name': 'Ahmed Al-Saudi',
            'phone': '+966501234567'
        },
        metadata={
            'order_id': '12345',
            'custom_field': 'value'
        },
        return_url='https://yoursite.com/payment/success',
        webhook_url='https://yoursite.com/webhooks/payment'
    )
    
    print(f"Payment created: {payment.id}")
    # Redirect customer to payment.checkout_url
    
except NCQException as e:
    print(f"Payment error: {e}")

# Handle webhook (Flask example)
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks/payment', methods=['POST'])
def handle_webhook():
    payload = request.data
    signature = request.headers.get('X-NCQ-Signature')
    
    if ncq.webhooks.verify(payload, signature):
        event = request.json
        
        if event['type'] == 'payment.succeeded':
            # Handle successful payment
            print(f"Payment successful: {event['data']}")
        elif event['type'] == 'payment.failed':
            # Handle failed payment
            print(f"Payment failed: {event['data']}")
        
        return 'OK', 200
    else:
        return 'Invalid signature', 400`

  const codeExamples = {
    javascript: javascriptExample,
    php: phpExample,
    python: pythonExample,
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        API Documentation
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Integrate NCQ Payment Gateway into your application with our comprehensive API
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Test Mode:</strong> Use test API keys to simulate transactions without real money. 
          All test card numbers and bank accounts are available in the testing section.
        </Typography>
      </Alert>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Quick Start" icon={<PlayArrow />} iconPosition="start" />
            <Tab label="API Reference" icon={<Api />} iconPosition="start" />
            <Tab label="SDKs" icon={<Code />} iconPosition="start" />
            <Tab label="Plugins" icon={<Web />} iconPosition="start" />
            <Tab label="Mobile SDKs" icon={<Smartphone />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          {/* Quick Start */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Getting Started with NCQ Payment Gateway
            </Typography>
            
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                1. Get your API credentials
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body2" paragraph>
                  Your API keys are available in the{' '}
                  <a href="/developers/api-keys" style={{ color: '#2196f3' }}>
                    API Keys
                  </a>{' '}
                  section. You'll need:
                </Typography>
                <Box display="flex" gap={2}>
                  <Chip label="Merchant ID: NCQ12345678" />
                  <Chip label="Test API Key: pk_test_..." />
                </Box>
              </Paper>
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                2. Choose your integration method
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Hosted Checkout
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Redirect customers to our secure hosted payment page
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Embedded Checkout
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Embed our payment form directly in your website
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Direct API
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Build your own custom payment flow
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                3. Install the SDK
              </Typography>
              <Box mb={2}>
                <Tabs
                  value={selectedLanguage}
                  onChange={(e, v) => setSelectedLanguage(v)}
                  variant="scrollable"
                >
                  <Tab label="JavaScript" value="javascript" />
                  <Tab label="PHP" value="php" />
                  <Tab label="Python" value="python" />
                </Tabs>
              </Box>
              <Paper sx={{ position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <CopyToClipboard text={codeExamples[selectedLanguage]} onCopy={handleCopy}>
                    <Tooltip title="Copy code">
                      <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CopyToClipboard>
                </Box>
                <SyntaxHighlighter
                  language={selectedLanguage}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '14px',
                  }}
                >
                  {codeExamples[selectedLanguage]}
                </SyntaxHighlighter>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                4. Test your integration
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                href="/developers/testing"
              >
                Go to Testing Dashboard
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* API Reference */}
          <Typography variant="h6" gutterBottom>
            API Reference
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full API documentation coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* SDKs */}
          <Typography variant="h6" gutterBottom>
            Official SDKs
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'JavaScript/Node.js', icon: '🟨', version: '2.1.0' },
              { name: 'PHP', icon: '🐘', version: '2.1.0' },
              { name: 'Python', icon: '🐍', version: '2.1.0' },
              { name: 'Ruby', icon: '💎', version: '2.1.0' },
              { name: 'Java', icon: '☕', version: '2.1.0' },
              { name: '.NET', icon: '🔷', version: '2.1.0' },
            ].map((sdk) => (
              <Grid item xs={12} sm={6} md={4} key={sdk.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {sdk.icon}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {sdk.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Version {sdk.version}
                    </Typography>
                    <Button size="small" startIcon={<Download />}>
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Plugins */}
          <Typography variant="h6" gutterBottom>
            E-commerce Plugins
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plugins for popular platforms coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          {/* Mobile SDKs */}
          <Typography variant="h6" gutterBottom>
            Mobile SDKs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            iOS and Android SDKs coming soon...
          </Typography>
        </TabPanel>
      </Card>
    </Box>
  )
}