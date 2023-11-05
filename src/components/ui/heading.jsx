import clsx from "clsx";

function HeadingSmall({ tight, children }) {
    return (
        <h3 className={clsx(
            'text-sm text-gray-400 font-bold',
            !tight && 'mb-3',
        )}>
            {children}
        </h3>
    );
}

export { HeadingSmall };