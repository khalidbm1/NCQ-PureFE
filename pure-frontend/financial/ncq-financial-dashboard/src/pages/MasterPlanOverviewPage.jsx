import React from 'react';
import { Briefcase } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const MasterPlanOverviewPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="00-MASTER-PLAN-OVERVIEW.md"
      title={t('md_pages.master_plan_overview')}
      description={t('md_pages.master_plan_overview_desc')}
      icon={Briefcase}
    />
  );
};

export default MasterPlanOverviewPage;