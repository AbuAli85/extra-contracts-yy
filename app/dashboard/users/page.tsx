"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const ROLES = ["admin", "manager", "viewer"]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState(ROLES[0])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      const { data, error } = await supabase.from("app_users").select("id, email, role")
      if (error) setError(error.message)
      else setUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const updateRole = async (id: string, newRole: string) => {
    setSaving(id)
    setError(null)
    const { error } = await supabase.from("app_users").update({ role: newRole }).eq("id", id)
    if (error) setError(error.message)
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    setSaving(null)
  }

  const addUser = async () => {
    if (!newEmail) {
      toast({ title: "Email required", description: "Please enter an email.", variant: "destructive" })
      return
    }
    setSaving("add")
    setError(null)
    const { error } = await supabase.from("app_users").insert([{ email: newEmail, role: newRole }])
    if (error) setError(error.message)
    else {
      setUsers([...users, { id: Math.random().toString(), email: newEmail, role: newRole }]) // Optimistic
      setShowAddModal(false)
      setNewEmail("")
      setNewRole(ROLES[0])
      toast({ title: "User added", description: `User ${newEmail} added successfully.` })
    }
    setSaving(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <CardHeader className="p-0">
            <CardTitle>User Management / إدارة المستخدمين</CardTitle>
            <CardDescription>
              Manage users, roles, and permissions. / إدارة المستخدمين والأدوار والأذونات.
            </CardDescription>
          </CardHeader>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <select
                          value={user.role}
                          onChange={e => updateRole(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                          disabled={saving === user.id}
                        >
                          {ROLES.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {saving === user.id ? (
                          <span className="text-blue-500">Saving...</span>
                        ) : (
                          <span className="text-green-600">Saved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                type="email"
                autoFocus
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button onClick={addUser} disabled={saving === "add"}>
                {saving === "add" ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
