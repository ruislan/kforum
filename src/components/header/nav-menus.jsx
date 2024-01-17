'use client';

import { Fragment, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';

import useOutsideClick from '@/hooks/use-outside-click';

import { CloseIcon, MenuIcon } from '../icons';
import Box from '../ui/box';
import Image from 'next/image';

function DropdownMenus({ menus }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();
    useOutsideClick(ref, () => setIsOpen(false));
    return (
        <div className='h-full py-1'>
            <div className='relative flex items-center ml-4 h-full'>
                <div
                    ref={ref}
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        'font-semibold transition-al no-underline min-w-fit whitespace-nowrap',
                        'text-neutral-400 hover:text-neutral-100 cursor-pointer'
                    )}>
                    更多
                </div>
            </div>
            <Transition
                as='div'
                appear
                show={isOpen}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
            >
                <Box className='absolute top-full right-0 mt-2 w-56 origin-top-right flex flex-col text-gray-100'>
                    {menus.map(({ url, name, isTargetBlank }) => (
                        <Link
                            key={url}
                            href={url}
                            target={isTargetBlank ? '_blank' : '_self'}
                            className={clsx(
                                'font-semibold transition-all no-underline hover:bg-neutral-700 p-2',
                                'text-neutral-400 hover:text-neutral-100 rounded-md',
                            )}
                        >
                            {name}
                        </Link>
                    ))}
                </Box>
            </Transition>
        </div>
    );
}

function MainMenus({ menus }) {
    const pathname = usePathname() || '/';
    return (
        <div className='hidden md:flex items-center gap-4 overflow-hidden max-w-xs py-1 h-full'>
            {menus.map(({ url, name, isTargetBlank }) => (
                <Link
                    key={url}
                    href={url}
                    target={isTargetBlank ? '_blank' : '_self'}
                    className={clsx(
                        'font-semibold transition-all hover:text-gray-100 no-underline',
                        'whitespace-nowrap overflow-hidden min-w-fit',
                        pathname === url ? 'text-gray-100' : 'text-gray-300'
                    )}
                >
                    {name}
                </Link>
            ))}
        </div>
    );
}

function DrawerMenus({ logo, menus }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);
    return (
        <>
            <div
                className='md:hidden flex items-center cursor-pointer'
                onClick={toggle}
            >
                <MenuIcon className='w-6 h-6 text-gray-300' />
            </div>
            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter='transition ease-out duration-300'
                        enterFrom='-translate-x-full opacity-50'
                        enterTo='translate-x-0 opacity-100'
                        leave='transition ease-in duration-200'
                        leaveFrom='translate-x-0 opacity-100'
                        leaveTo='-translate-x-full opacity-0'
                    >
                        <Dialog.Panel
                            className={clsx(
                                'flex flex-col w-9/12 h-screen bg-neutral-800',
                                'border border-neutral-700 shadow-lg',
                                'absolute left-0 top-0 z-[9996]',
                            )}
                        >
                            <div className='flex items-center justify-between p-4'>
                                <div className='font-bold text-lg text-white flex items-center outline-none'>
                                    {logo ?
                                        <Image className='h-9 w-auto max-h-9' src={logo} alt={logo} width={180} height={60} /> :
                                        <>
                                            <span className='w-9 h-9 text-xl flex justify-center items-center rounded-md mr-1 bg-neutral-600 shadow-lg'>K</span>
                                            <span className='block'>Forum</span>
                                        </>
                                    }
                                </div>
                                <div
                                    className='w-6 h-6 text-gray-300'
                                    onClick={close}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 p-2'>
                                {menus.map(({ url, name, isTargetBlank }) => (
                                    <Link
                                        key={url}
                                        href={url}
                                        target={isTargetBlank ? '_blank' : '_self'}
                                        className={clsx(
                                            'w-full text-gray-200 rounded-md outline-none',
                                            'font-semibold no-underline p-2',
                                        )}
                                        onClick={close}
                                    >
                                        {name}
                                    </Link>
                                ))}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </>
    );
}

function Logo({ logo }) {
    return (
        <Link href='/' className='relative font-bold text-lg text-white md:mr-4 mr-2 flex items-center group'>
            {logo ?
                <Image className='h-9 w-auto max-h-9' src={logo} alt={logo} width={180} height={60} /> :
                <>
                    <div className={clsx(
                        'absolute w-9 h-9 rounded-md bg-neutral-600 shadow-lg left-0',
                        'md:group-hover:w-full md:transition-[width]'
                    )}></div>
                    <span className={clsx(
                        'z-10 w-9 h-9 text-xl flex justify-center items-center mr-1',
                        'md:group-hover:-rotate-12 md:transition-all md:duration-500'
                    )}>
                        K
                    </span>
                    <span className='z-10 pr-3 hidden md:block'>Forum</span>
                </>
            }
        </Link>
    );
}

export default function NavMenus({ logo, menus }) {
    return (
        <>
            <Logo />
            <DrawerMenus logo={logo} menus={menus} />
            <MainMenus menus={menus.slice(0, 4)} />
            {menus.length > 4 && <DropdownMenus menus={menus.slice(4)} />}
        </>
    );
}