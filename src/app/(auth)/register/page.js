import dynamicImport from 'next/dynamic';

const RegisterForm = dynamicImport(() => import('@/components/auth/register-form'));

export const metadata = {
    title: '注册'
};

export default function Page() {
    return (<RegisterForm />);
}
