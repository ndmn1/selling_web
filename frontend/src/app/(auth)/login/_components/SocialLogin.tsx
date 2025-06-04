

import { socialLogin } from "@/actions/login";
type SocialLoginProps = {
  id: string;
  name: string;
};
const SocialLogin = ({id, name }: SocialLoginProps) => {
  function onClick() {
    socialLogin(id);
  }
  return (
    <form action={onClick}>
      <button type="submit" className="flex-1 bg-slate-400 py-2 px-5 rounded-lg text-white w-full hover:bg-slate-500">
        Signin with {name}
      </button>
    </form>
  );
};

export default SocialLogin;
