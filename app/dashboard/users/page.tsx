"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const ROLES = ["admin", "manager", "viewer"]
const PAGE_SIZE = 8

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getInitials(email: string) {
  if (!email) return "?"
  const [name] = email.split("@")
  return name.slice(0, 2).toUpperCase()
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState(ROLES[0])
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  // Simulate current user role (replace with real auth/role check)
  const currentUserRole = "admin" // Change to "viewer" to test read-only

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from("app_users").select("id, email, role")
    if (error) setError(error.message)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    let filtered = users
    if (search) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter)
    }
    return filtered
  }, [users, search, roleFilter])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, page])

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)

  // Add user logic
  const addUser = async () => {
    if (!newEmail) {
      toast({ title: "Email required", description: "Please enter an email.", variant: "destructive" })
      return
    }
    if (!isValidEmail(newEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }
    setAddLoading(true)
    setError(null)
    // Check for duplicate email
    const { data: existing, error: checkError } = await supabase.from("app_users").select("id").eq("email", newEmail)
    if (checkError) {
      setError(checkError.message)
      toast({ title: "Error", description: checkError.message, variant: "destructive" })
      setAddLoading(false)
      return
    }
    if (existing && existing.length > 0) {
      toast({ title: "Duplicate email", description: "A user with this email already exists.", variant: "destructive" })
      setAddLoading(false)
      return
    }
    // Insert new user
    const { error: insertError } = await supabase.from("app_users").insert([{ email: newEmail, role: newRole }])
    if (insertError) {
      setError(insertError.message)
      toast({ title: "Error adding user", description: insertError.message, variant: "destructive" })
      setAddLoading(false)
      return
    }
    await fetchUsers()
    setShowAddModal(false)
    setNewEmail("")
    setNewRole(ROLES[0])
    toast({ title: "User added", description: `User ${newEmail} added successfully.` })
    setAddLoading(false)
  }

  // Edit user logic
  const openEditModal = (user: any) => {
    setSelectedUser(user)
    setNewEmail(user.email)
    setNewRole(user.role)
    setShowEditModal(true)
  }
  const editUser = async () => {
    if (!selectedUser) return
    if (!newEmail) {
      toast({ title: "Email required", description: "Please enter an email.", variant: "destructive" })
      return
    }
    if (!isValidEmail(newEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" })
      return
    }
    setEditLoading(true)
    setError(null)
    // Check for duplicate email (if changed)
    if (newEmail !== selectedUser.email) {
      const { data: existing, error: checkError } = await supabase.from("app_users").select("id").eq("email", newEmail)
      if (checkError) {
        setError(checkError.message)
        toast({ title: "Error", description: checkError.message, variant: "destructive" })
        setEditLoading(false)
        return
      }
      if (existing && existing.length > 0) {
        toast({ title: "Duplicate email", description: "A user with this email already exists.", variant: "destructive" })
        setEditLoading(false)
        return
      }
    }
    // Update user
    const { error: updateError } = await supabase.from("app_users").update({ email: newEmail, role: newRole }).eq("id", selectedUser.id)
    if (updateError) {
      setError(updateError.message)
      toast({ title: "Error updating user", description: updateError.message, variant: "destructive" })
      setEditLoading(false)
      return
    }
    await fetchUsers()
    setShowEditModal(false)
    setSelectedUser(null)
    setNewEmail("")
    setNewRole(ROLES[0])
    toast({ title: "User updated", description: `User ${newEmail} updated successfully.` })
    setEditLoading(false)
  }

  // Delete user logic
  const openDeleteModal = (user: any) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }
  const deleteUser = async () => {
    if (!selectedUser) return
    setDeleteLoading(true)
    setError(null)
    const { error: deleteError } = await supabase.from("app_users").delete().eq("id", selectedUser.id)
    if (deleteError) {
      setError(deleteError.message)
      toast({ title: "Error deleting user", description: deleteError.message, variant: "destructive" })
      setDeleteLoading(false)
      return
    }
    await fetchUsers()
    setShowDeleteModal(false)
    setSelectedUser(null)
    toast({ title: "User deleted", description: `User deleted successfully.` })
    setDeleteLoading(false)
  }

  // Pagination controls
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
  }

  // Reset page on filter/search change
  useEffect(() => { setPage(1) }, [search, roleFilter])

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardHeader className="p-0">
              <CardTitle>User Management / إدارة المستخدمين</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions. / إدارة المستخدمين والأدوار والأذونات.
              </CardDescription>
            </CardHeader>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by email or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 w-48"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border rounded px-2 py-1 w-32"
            >
              <option value="">All Roles</option>
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {currentUserRole === "admin" && (
              <Button onClick={() => setShowAddModal(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin mr-2" /> Loading users...</div>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Avatar</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      {/* <th className="px-4 py-2 text-left">Created At</th> */}
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user: any, idx: number) => (
                      <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 dark:bg-gray-900/10"}>
                        <td className="px-4 py-2">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="px-4 py-2 font-mono">{user.email}</td>
                        <td className="px-4 py-2 capitalize">{user.role}</td>
                        {/* <td className="px-4 py-2">{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</td> */}
                        <td className="px-4 py-2">
                          {currentUserRole === "admin" ? (
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openEditModal(user)} title="Edit user">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => openDeleteModal(user)} title="Delete user">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Read-only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button size="sm" variant="outline" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Add User Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent aria-describedby="add-user-desc">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription id="add-user-desc">Enter the user's email and role.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                type="email"
                autoFocus
                disabled={addLoading}
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                disabled={addLoading}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button onClick={addUser} disabled={addLoading}>
                {addLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                {addLoading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit User Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent aria-describedby="edit-user-desc">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription id="edit-user-desc">Update the user's email and role.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                type="email"
                autoFocus
                disabled={editLoading}
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                disabled={editLoading}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button onClick={editUser} disabled={editLoading}>
                {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete User Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent aria-describedby="delete-user-desc">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription id="delete-user-desc">Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <span className="font-mono">{selectedUser?.email}</span>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>Cancel</Button>
              <Button variant="destructive" onClick={deleteUser} disabled={deleteLoading}>
                {deleteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
