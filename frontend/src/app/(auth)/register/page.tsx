import RegisterForm from "@/app/(auth)/register/_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto h-[80vh] flex items-center justify-center">
      <div className="overflow-hidden  bg-slate-100 shadow-md rounded-lg border-2 px-6 py-8 ">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-gray-600 mt-2">
            Create a new account to get started
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
