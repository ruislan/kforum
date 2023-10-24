import LoginForm from '@/components/auth/login-form';

export const metadata = {
  title: '登陆 | KForum',
  description: 'Simple, Modern, Beautiful and Fast',
};

export default async function Page({ params }) {
  return (<LoginForm />);
}
