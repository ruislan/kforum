import clsx from 'clsx';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ArrowDownS, CheckIcon } from '../icons';

const Select = ({ options, label, value, onChange }) => {
    return (
        <Listbox as='div' value={value ?? {}} onChange={onChange}>
            {({ open }) =>
                <div className='relative mt-1'>
                    <Listbox.Button className={clsx(
                        'flex items-center justify-between w-full p-3 text-sm',
                        'border border-solid rounded-md text-gray-400',
                        'focus:outline-none bg-neutral-800',
                        open ? 'border-neutral-400' : 'border-neutral-700',
                    )}>
                        <span className={clsx(
                            'block truncate',
                            !!value?.label && 'text-gray-200',
                        )}>
                            {value?.label ?? label}
                        </span>
                        <span className='pointer-events-none'>
                            <ArrowDownS
                                className='h-5 w-5'
                                aria-hidden='true'
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-0'
                        enterTo='opacity-100 translate-y-1'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'
                    >
                        <Listbox.Options className={clsx(
                            'absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1',
                            'text-sm text-gray-200 outline-none',
                            'rounded-md bg-neutral-800 shadow-lg',
                            'border border-solid border-neutral-700',
                        )}>
                            {options.map((option, index) => (
                                <Listbox.Option
                                    key={index}
                                    value={option}
                                    className={({ active }) =>
                                        clsx(
                                            'flex items-center justify-between rounded-md',
                                            'cursor-default select-none px-2 py-1.5 hover:bg-neutral-700/70',
                                            active && 'font-semibold text-white bg-neutral-700/70'
                                        )
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <div
                                                className={clsx(
                                                    'block truncate',
                                                    selected ? 'font-semibold' : 'font-normal'
                                                )}
                                            >
                                                {option.label}
                                            </div>
                                            {selected && (
                                                <span className='flex items-center text-gray-100'>
                                                    <CheckIcon className='h-4 w-4' aria-hidden='true' />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            }
        </Listbox>
    );
};

export default Select;
