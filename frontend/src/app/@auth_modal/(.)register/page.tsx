import { Modal } from "@/components/Modal";
import RegisterForm from "@/app/(auth)/register/_components/RegisterForm";

export default function LoginModal() {
  return (
    <Modal>
      <div className="p-3">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-gray-600 mt-2">
          Create a new account to get started
        </p>
      </div>
      <RegisterForm isIntercept={true} />
    </Modal>
  );
}
