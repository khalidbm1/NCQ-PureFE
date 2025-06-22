'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { DocumentTextIcon, BeakerIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'endpoint' | 'documentation' | 'sdk' | 'example';
  url: string;
  category: string;
  icon?: any;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'POST /auth/login',
    description: 'Authenticate user with email and password',
    type: 'endpoint',
    url: '/api-explorer?endpoint=auth-login',
    category: 'Authentication Service',
    icon: BeakerIcon,
  },
  {
    id: '2',
    title: 'Authentication Overview',
    description: 'Learn how to authenticate with NCQ APIs',
    type: 'documentation',
    url: '/docs/authentication',
    category: 'Documentation',
    icon: DocumentTextIcon,
  },
  {
    id: '3',
    title: 'JavaScript SDK - Auth',
    description: 'Authentication methods in the JavaScript SDK',
    type: 'sdk',
    url: '/sdks/javascript#authentication',
    category: 'SDKs',
    icon: CodeBracketIcon,
  },
  {
    id: '4',
    title: 'GET /payment/transactions',
    description: 'Retrieve payment transaction history',
    type: 'endpoint',
    url: '/api-explorer?endpoint=payment-transactions',
    category: 'Payment Gateway',
    icon: BeakerIcon,
  },
  {
    id: '5',
    title: 'Payment Processing Guide',
    description: 'Complete guide to processing payments',
    type: 'documentation',
    url: '/docs/payment-processing',
    category: 'Documentation',
    icon: DocumentTextIcon,
  },
  {
    id: '6',
    title: 'Python SDK - Payments',
    description: 'Payment processing with Python SDK',
    type: 'sdk',
    url: '/sdks/python#payments',
    category: 'SDKs',
    icon: CodeBracketIcon,
  },
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      // Mock search - in real implementation, this would call your search API
      const filtered = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      if (isOpen) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(Math.max(selectedIndex - 1, -1));
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
              handleResultClick(results[selectedIndex]);
            }
            break;
          case 'Escape':
            setIsOpen(false);
            setSelectedIndex(-1);
            inputRef.current?.blur();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    router.push(result.url);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'endpoint':
        return BeakerIcon;
      case 'documentation':
        return DocumentTextIcon;
      case 'sdk':
        return CodeBracketIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      endpoint: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      documentation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      sdk: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      example: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return badges[type as keyof typeof badges] || badges.documentation;
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ncq-blue sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-ncq-lightBlue"
          placeholder="Search APIs, docs, SDKs..."
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query ? (
            <button
              onClick={handleClear}
              className="h-full rounded-r-md px-2 py-0 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center pr-3">
              <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400 dark:border-gray-600">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-600">
          {results.map((result, index) => {
            const Icon = getTypeIcon(result.type);
            return (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={cn(
                  'relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left hover:bg-gray-50 dark:hover:bg-gray-700',
                  index === selectedIndex && 'bg-gray-50 dark:bg-gray-700'
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </span>
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        getTypeBadge(result.type)
                      )}>
                        {result.type}
                      </span>
                    </div>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {result.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {result.category}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md bg-white py-8 text-center shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}