import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MDPage = ({ filePath, title, description, icon: Icon = FileText }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const response = await fetch(`/md-files/${filePath}`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent(`# ${title}\n\n${t('common.file_not_found')}`);
        }
      } catch (error) {
        setContent(`# ${title}\n\n${t('common.error_loading_file')}: ${error.message}`);
      }
      setLoading(false);
    };

    loadMarkdownContent();
  }, [filePath, title, t]);

  const formatMarkdownToHTML = (markdown) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2 mt-4">$1</h4>')
      .replace(/^\* (.*$)/gim, '<li class="text-gray-600 dark:text-gray-400 mb-1">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="text-gray-600 dark:text-gray-400 mb-1">$1</li>')
      .replace(/(\n|^)(\d+\. .*$)/gim, '<ol class="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400 mb-4"><li>$2</li></ol>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm font-mono">$1</code></pre>')
      .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-400 mb-4">')
      .replace(/^\n/, '<p class="text-gray-600 dark:text-gray-400 mb-4">')
      + '</p>';
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filePath;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadFile}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download size={16} />
              {t('common.download')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-lg"
      >
        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(content) }}
        />
      </motion.div>
    </div>
  );
};

export default MDPage;