'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the NCQ LLM platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials (information or software) on NCQ LLM for personal, non-commercial transitory viewing only.
            </p>
            <ul>
              <li>This license shall automatically terminate if you violate any of these restrictions</li>
              <li>Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials</li>
            </ul>

            <h2>3. API Usage</h2>
            <p>
              Users are responsible for maintaining the security of their API keys and account credentials. Any activities that occur under your account are your responsibility.
            </p>
            <ul>
              <li>API rate limits must be respected</li>
              <li>Automated abuse detection may result in account suspension</li>
              <li>Commercial usage requires appropriate subscription tier</li>
            </ul>

            <h2>4. Privacy</h2>
            <p>
              Your use of our platform is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>

            <h2>5. Prohibited Uses</h2>
            <p>
              You may not use NCQ LLM:
            </p>
            <ul>
              <li>For any unlawful purpose</li>
              <li>To solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              The platform and its original content, features, and functionality are and will remain the exclusive property of NCQ LLM and its licensors. The platform is protected by copyright, trademark, and other laws.
            </p>

            <h2>7. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall NCQ LLM, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@ncqllm.com</li>
              <li>Address: NCQ LLM, Riyadh, Saudi Arabia</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}