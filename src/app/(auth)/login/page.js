import dynamicImport from 'next/dynamic';

const LoginForm = dynamicImport(() => import('@/components/auth/login-form'));

export const metadata = {
  title: '登录'
};

export default async function Page({ params }) {
  return (<LoginForm />);
}
