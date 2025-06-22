import React from 'react';
import { Layers } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const NCQPlatformPlanPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="02-NCQ-PLATFORM-PLAN.md"
      title={t('md_pages.ncq_platform_plan')}
      description={t('md_pages.ncq_platform_desc')}
      icon={Layers}
    />
  );
};

export default NCQPlatformPlanPage;