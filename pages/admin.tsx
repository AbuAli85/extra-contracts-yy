<<<<<<< HEAD
import { useUserRole } from '../hooks/useUserRole'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AdminPage() {
  const role = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace('/not-authorized')
    }
  }, [role])

  if (!role) return <div>Loading...</div>
  return <div>Welcome, admin!</div>
=======
import { useUserRole } from '../hooks/useUserRole'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AdminPage() {
  const role = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace('/not-authorized')
    }
  }, [role])

  if (!role) return <div>Loading...</div>
  return <div>Welcome, admin!</div>
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
} 