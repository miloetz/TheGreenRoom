'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <a href="/dashboard">
                    <img src="/thegreenroom.png" alt="TheGreenRoom" className="h-10" />
                </a>

                <nav className="flex items-center gap-6">
                    {user ? (
                        <>
                            <a href="/dashboard" className="hover:text-blue-600">
                                Dashboard
                            </a>
                            <a href="/messages" className="hover:text-blue-600">
                                Messages
                            </a>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="hover:text-blue-600">
                                Log In
                            </a>
                            <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Sign Up
                            </a>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
