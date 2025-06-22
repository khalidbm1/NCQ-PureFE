import React from 'react';
import { Building2 } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const SmartHospitalityPlanPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="04-SMART-HOSPITALITY-PLAN.md"
      title={t('md_pages.smart_hospitality_plan')}
      description={t('md_pages.smart_hospitality_plan_desc')}
      icon={Building2}
    />
  );
};

export default SmartHospitalityPlanPage;