import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const input = <input {...props} type={type === 'password' && showPassword ? 'text' : type} className={'rounded-xl border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-[#5b50f5] focus:ring-[#5b50f5] ' + (type === 'password' ? 'pr-12 ' : '') + className} ref={localRef} />;

    if (type !== 'password') return input;

    return <div className="relative">
        {input}
        <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-[#5b50f5]" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {showPassword ? <LuEyeOff size={19} /> : <LuEye size={19} />}
        </button>
    </div>;
});
