export default async function Layout({ children }) {
    return (
        <div className='flex flex-col w-full py-16'>
            {children}
        </div>
    );
}
