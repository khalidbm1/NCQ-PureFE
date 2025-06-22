import React from 'react';
import { Cpu } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const CoreTechnologiesPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="01-CORE-TECHNOLOGIES-PLAN.md"
      title={t('md_pages.core_technologies_plan')}
      description={t('md_pages.core_technologies_desc')}
      icon={Cpu}
    />
  );
};

export default CoreTechnologiesPage;