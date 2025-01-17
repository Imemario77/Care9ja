"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ban, Trash2, Search } from "lucide-react";
import { format } from "date-fns";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogType, setDialogType] = useState(null);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleBanUser = async (user) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/ban`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to ban user");

      // Refresh the users list
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Refresh the users list
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    if (dialogType === "ban") {
      await handleBanUser(selectedUser);
    } else if (dialogType === "delete") {
      await handleDeleteUser(selectedUser);
    }

    setSelectedUser(null);
    setDialogType(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.phone_number || "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.user_type === "BANNED"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.user_type || "REGULAR"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {user.last_active
                      ? format(new Date(user.last_active), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setDialogType("ban");
                        }}
                        disabled={user.user_type === "BANNED"}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setSelectedUser(user);
                          setDialogType("delete");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!selectedUser && !!dialogType}
        onOpenChange={() => {
          setSelectedUser(null);
          setDialogType(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === "ban" ? "Ban User" : "Delete User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogType === "ban"
                ? `Are you sure you want to ban ${selectedUser?.full_name}? They will no longer be able to access the system.`
                : `Are you sure you want to delete ${selectedUser?.full_name}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                dialogType === "delete" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {dialogType === "ban" ? "Ban User" : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
