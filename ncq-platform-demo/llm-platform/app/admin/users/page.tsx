'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  email: string;
  full_name: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'user' | 'admin';
  subscription: {
    plan: string;
    status: string;
    expires_at: string;
  } | null;
  api_usage: {
    calls_today: number;
    calls_month: number;
    last_call: string | null;
  };
  created_at: string;
  last_login: string | null;
}

interface UserFilters {
  search: string;
  status: string;
  plan: string;
  role: string;
  sortBy: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
    plan: 'all',
    role: 'all',
    sortBy: 'created_at_desc',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filters, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: filters.search,
        status: filters.status,
        plan: filters.plan,
        role: filters.role,
        sort: filters.sortBy,
      });

      const response = await fetch(`/api/v1/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    const response = await fetch(`/api/v1/admin/users/${userId}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      fetchUsers();
      setShowActions(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    const response = await fetch(`/api/v1/admin/users/bulk/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_ids: selectedUsers }),
    });

    if (response.ok) {
      setSelectedUsers([]);
      fetchUsers();
    }
  };

  const exportUsers = async () => {
    const response = await fetch('/api/v1/admin/users/export', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { icon: CheckCircle, className: 'text-green-600 bg-green-50' },
      inactive: { icon: XCircle, className: 'text-gray-600 bg-gray-50' },
      banned: { icon: Ban, className: 'text-red-600 bg-red-50' },
    };

    const badge = badges[status as keyof typeof badges] || badges.inactive;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      basic: 'bg-blue-50 text-blue-700',
      professional: 'bg-green-50 text-green-700',
      enterprise: 'bg-purple-50 text-purple-700',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plan as keyof typeof colors] || 'bg-gray-50 text-gray-700'}`}>
        {plan || 'No plan'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and subscriptions
          </p>
        </div>
        <Button onClick={exportUsers} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={filters.plan}
              onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Plans</option>
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
              <option value="none">No Plan</option>
            </select>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button
              variant="ghost"
              onClick={fetchUsers}
              size="icon"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>{selectedUsers.length} users selected</span>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('activate')}
              >
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
              >
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                onClick={() => handleBulkAction('ban')}
              >
                Ban
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedUsers([])}
              >
                Clear
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">Usage</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Last Active</th>
                  <th className="p-4 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.full_name || 'Unknown'}
                            {user.role === 'admin' && (
                              <Shield className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-4">
                        {user.subscription ? (
                          <div>
                            {getPlanBadge(user.subscription.plan)}
                            {user.subscription.status !== 'active' && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {user.subscription.status}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{user.api_usage.calls_month.toLocaleString()} calls</div>
                          <div className="text-xs text-muted-foreground">This month</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.last_login
                            ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
                            : 'Never'
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {showActions === user.id && (
                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border">
                              <div className="py-1">
                                <button
                                  onClick={() => handleUserAction(user.id, 'view')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'email')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                  Send Email
                                </button>
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => handleUserAction(user.id, 'deactivate')}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUserAction(user.id, 'activate')}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                  >
                                    Activate
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUserAction(user.id, 'reset-password')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                  Reset Password
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleUserAction(user.id, 'ban')}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Ban User
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 