import LoginForm from '@/components/auth/login-form';

export const metadata = {
  title: '登录'
};

export default async function Page({ params }) {
  return (<LoginForm />);
}
