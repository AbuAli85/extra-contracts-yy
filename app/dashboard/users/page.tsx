"use client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const ROLES = ["admin", "manager", "viewer"]

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
          <Button>
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
      </div>
    </DashboardLayout>
  )
}
