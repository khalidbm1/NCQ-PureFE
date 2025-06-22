'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('common.backToHome')}
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              NCQ LLM ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI platform services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>
              When you register for an account, we may collect:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Company information</li>
              <li>Billing and payment information</li>
              <li>Contact preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information when you use our platform:
            </p>
            <ul>
              <li>API usage statistics and patterns</li>
              <li>Model interaction data</li>
              <li>Performance metrics</li>
              <li>Error logs and debugging information</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our services</li>
              <li>Improve and optimize our platform</li>
              <li>Process transactions and send billing information</li>
              <li>Send administrative information and updates</li>
              <li>Respond to customer service requests</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect and prevent fraudulent activities</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When data is no longer needed, we securely delete or anonymize it.
            </p>

            <h2>6. API Data Processing</h2>
            <p>
              When you use our API services:
            </p>
            <ul>
              <li>Input data is processed temporarily for generating responses</li>
              <li>We do not store API request content unless explicitly authorized</li>
              <li>Model outputs are not used for training without consent</li>
              <li>Usage metrics are collected in aggregate form</li>
            </ul>

            <h2>7. Third-Party Services</h2>
            <p>
              We may use third-party services for:
            </p>
            <ul>
              <li>Payment processing (payment information is not stored on our servers)</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer support tools</li>
              <li>Infrastructure and hosting services</li>
            </ul>

            <h2>8. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to certain processing activities</li>
              <li>Export your data in a portable format</li>
            </ul>

            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@ncqllm.com</li>
              <li>Address: NCQ LLM, Riyadh, Saudi Arabia</li>
            </ul>

            <h2>13. Compliance</h2>
            <p>
              We comply with applicable data protection laws and regulations, including GDPR where applicable, and are committed to protecting your privacy rights.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}