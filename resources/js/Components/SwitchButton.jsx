export default function SwitchButton({ checked = false, multiple = false }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                checked
                    ? 'border-[#5b50f5] bg-[#5b50f5] shadow-[0_0_0_3px_rgba(91,80,245,0.12)]'
                    : 'border-[#c4d1e3] bg-white'
            }`}
        >
            {checked && (
                <span
                    className={
                        multiple
                            ? 'text-xs font-bold leading-none text-white'
                            : 'h-2 w-2 rounded-full bg-white'
                    }
                >
                    {multiple ? '✓' : null}
                </span>
            )}
        </span>
    );
}
