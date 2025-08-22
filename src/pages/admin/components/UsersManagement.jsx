import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import  Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { userAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    balance: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          role: 'customer',
          status: 'active',
          balance: 250.50,
          total_orders: 15,
          total_spent: 1250.00,
          joined_date: '2023-06-15',
          last_login: '2024-01-15',
          address: '123 Main St, New York, NY 10001'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 234 567 8901',
          role: 'admin',
          status: 'active',
          balance: 0,
          total_orders: 0,
          total_spent: 0,
          joined_date: '2023-01-10',
          last_login: '2024-01-15',
          address: '456 Oak Ave, Los Angeles, CA 90001'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1 234 567 8902',
          role: 'customer',
          status: 'inactive',
          balance: 50.00,
          total_orders: 8,
          total_spent: 650.00,
          joined_date: '2023-09-20',
          last_login: '2023-12-01',
          address: '789 Pine Rd, Chicago, IL 60601'
        },
        {
          id: 4,
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          phone: '+1 234 567 8903',
          role: 'customer',
          status: 'active',
          balance: 125.75,
          total_orders: 22,
          total_spent: 2150.00,
          joined_date: '2023-03-05',
          last_login: '2024-01-14',
          address: '321 Elm St, Houston, TX 77001'
        },
        {
          id: 5,
          name: 'Charlie Wilson',
          email: 'charlie.wilson@example.com',
          phone: '+1 234 567 8904',
          role: 'customer',
          status: 'suspended',
          balance: 0,
          total_orders: 3,
          total_spent: 150.00,
          joined_date: '2023-11-10',
          last_login: '2023-12-20',
          address: '654 Maple Dr, Phoenix, AZ 85001'
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      balance: user.balance
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      // Update user logic here
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editFormData }
          : user
      );
      setUsers(updatedUsers);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsEditModalOpen(false);
      resetEditForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const updatedUsers = users.filter(user => user.id !== deleteUserId);
      setUsers(updatedUsers);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteUserId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      );
      setUsers(updatedUsers);
      toast({
        title: "Success",
        description: `User ${newStatus} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const resetEditForm = () => {
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      balance: 0
    });
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'admin-badge success',
      inactive: 'admin-badge warning',
      suspended: 'admin-badge error',
    };
    return statusStyles[status] || 'admin-badge';
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'admin-badge info',
      customer: 'admin-badge',
    };
    return roleStyles[role] || 'admin-badge';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="users-management">
      {/* Search and Filters */}
      <div className="admin-search-bar animate-fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="admin-empty-state animate-fade-in animation-delay-150">
          <User className="admin-empty-icon" />
          <h3 className="admin-empty-title">No users found</h3>
          <p className="admin-empty-description">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? "Try adjusting your filters" 
              : "No users registered yet"}
          </p>
        </div>
      ) : (
        <Card className="admin-table-container animate-fade-in animation-delay-150">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Orders</th>
                  <th>Balance</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="text-sm">{user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">{user.total_orders} orders</div>
                        <div className="text-sm text-muted-foreground">${user.total_spent}</div>
                      </div>
                    </td>
                    <td className="font-semibold">
                      ${user.balance.toFixed(2)}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {new Date(user.joined_date).toLocaleDateString()}
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="text-yellow-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {user.status === 'suspended' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => setDeleteUserId(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View User Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">User ID: #{selectedUser.id}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={getRoleBadge(selectedUser.role)}>
                      {selectedUser.role}
                    </span>
                    <span className={getStatusBadge(selectedUser.status)}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.address}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {new Date(selectedUser.joined_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last Login: {new Date(selectedUser.last_login).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedUser.total_orders}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold">${selectedUser.total_spent}</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Balance</span>
                  </div>
                  <p className="text-2xl font-bold">${selectedUser.balance}</p>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="admin-form">
            <div className="admin-form-group">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="admin-form-group">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="admin-form-group">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-form-group">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editFormData.role} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="admin-form-group">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="admin-form-group">
              <Label htmlFor="edit-balance">Balance</Label>
              <Input
                id="edit-balance"
                name="balance"
                type="number"
                step="0.01"
                value={editFormData.balance}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetEditForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Update User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
