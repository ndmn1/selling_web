'use client'
//import { signup } from '@/actions/auth'
import Link from 'next/link'
import { useActionState, useState } from 'react'
export default function SignupForm() {
  // const [state , action, pending] = useActionState(signup, undefined)
  // const [form , setForm] = useState({
  //   name: '',
  //   email: '',
  //   password: ''
  // })
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value })
  // }
  // return (
  //   <form action={action}>
  //     <div>
  //       <label htmlFor="name">Name</label>
  //       <input id="name" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
  //     </div>
  //     {state?.errors?.name && <p className="text-red-600 text-sm">{state.errors.name}</p>}
  //     <div>
  //       <label htmlFor="email">Email</label>
  //       <input id="email" name="email" type="text" placeholder="Email" value={form.email} onChange={handleChange}  />
  //     </div>
  //     {state?.errors?.email && <p className="text-red-600 text-sm">{state.errors.email}</p>}
  //     <div>
  //       <label htmlFor="password">Password</label>
  //       <input id="password" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}  />
  //     </div>
  //     {state?.errors?.password && (
  //       <div className="text-red-600 text-sm">
  //         <p >Password must:</p>
  //         <ul>
  //           {state.errors.password.map((error : string) => (
  //             <li key={error}>- {error}</li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //     <div>Already have an account? <Link href ='/login'>Login</Link></div>
  //     <button disabled={pending} type="submit">Sign Up</button>
  //   </form>
//}
}