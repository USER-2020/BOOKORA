export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl border border-transparent bg-[#5b50f5] px-5 py-3 text-sm font-semibold !text-white transition duration-150 ease-in-out hover:bg-[#4840d2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-[#3932bd] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
