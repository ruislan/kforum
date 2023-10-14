import clsx from 'clsx';

const SplitBall = function ({ className }) {
    return (
        <div className={clsx('rounded-full w-0.5 h-0.5', className)} />
    );
}

export default SplitBall;