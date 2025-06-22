import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  GlobeAltIcon,
  HomeIcon,
  SparklesIcon,
  CreditCardIcon,
  CpuChipIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

const products = [
  { name: 'NCQ Platform', href: 'http://localhost:3000', icon: GlobeAltIcon },
  { name: 'Smart Hospitality', href: 'http://localhost:4000', icon: HomeIcon },
  { name: 'NCQ LLM', href: 'http://localhost:8000', icon: SparklesIcon },
  { name: 'Payment Gateway', href: 'http://localhost:8080', icon: CreditCardIcon },
  { name: 'IoT Platform', href: 'http://localhost:3005', icon: CpuChipIcon },
  { name: 'Hospital Management', href: 'http://localhost:5001', icon: BuildingOffice2Icon }
]

export default function CrossProductNav() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
        Products
        <ChevronDownIcon className="ml-1 h-4 w-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1">
            {products.map(p => (
              <Menu.Item key={p.name}>
                {({ active }) => (
                  <a
                    href={p.href}
                    className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'} flex items-center px-4 py-2 text-sm`}
                  >
                    <p.icon className="mr-3 h-4 w-4" />
                    {p.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

