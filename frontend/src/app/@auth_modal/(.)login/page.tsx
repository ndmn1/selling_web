import { Modal } from "@/components/ModalAuth";
import LoginForm from "@/app/(auth)/login/_components/LoginForm";

export default function LoginModal() {
  return (
    <Modal>
      <div className="p-3">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-600 mt-2">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm isIntercept={true} />
    </Modal>
  );
}
