import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:py-12">
                <div className="mb-10 flex-1 lg:mb-0">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5b50f5] text-lg font-black text-white shadow-lg shadow-indigo-200">N</span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Noryvaq</span>
                    </Link>
                    <div className="mt-12 max-w-lg">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#5b50f5]">Reservas que trabajan por ti</p>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Haz que cada reserva se sienta simple.</h1>
                        <p className="mt-5 text-lg leading-8 text-slate-600">Organiza tu negocio, recibe reservas y conoce mejor a tus clientes desde un solo lugar.</p>
                    </div>
                </div>
                <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10 lg:max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
