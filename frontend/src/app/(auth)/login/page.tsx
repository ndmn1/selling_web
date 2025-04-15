import LoginForm from "@/components/LoginForm"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto h-[80vh] flex items-center justify-center">
      <div className="overflow-hidden  bg-slate-100 shadow-md rounded-lg border-2 px-6 py-8 ">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

