import { Head, useForm, usePage } from '@inertiajs/react';

export default function DemoSchedule({ demoRequest, timezone }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        scheduled_at: demoRequest.scheduled_at ? demoRequest.scheduled_at.slice(0, 16) : '',
        attendee_message: demoRequest.attendee_message || '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('demo.schedule.store'));
    };

    return (
        <>
            <Head title="Agendar demo" />
            <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <header className="mb-8 flex items-center justify-between">
                        <a href={route('dashboard')} className="flex items-center gap-3 font-bold tracking-tight"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b50f5] text-lg text-white">N</span>Noryvaq</a>
                        <a href={route('dashboard')} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Volver al dashboard</a>
                    </header>
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5b50f5]">Agenda interna</p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Agenda tu demo personalizada</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Elige un horario y escribe lo que quieres revisar. La reserva quedará guardada y enviaremos la información al equipo por WhatsApp.</p>
                        {flash?.success && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{flash.success}</div>}
                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="scheduled_at" className="block text-sm font-semibold text-slate-700">Fecha y hora de la demo</label>
                                <input id="scheduled_at" type="datetime-local" min={new Date().toISOString().slice(0, 16)} step="1800" value={data.scheduled_at} onChange={(event) => setData('scheduled_at', event.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-[#5b50f5] focus:ring-[#5b50f5]" required />
                                <p className="mt-2 text-xs text-slate-400">Selecciona una hora en punto o a los 30 minutos · Zona horaria: {timezone}</p>
                                {errors.scheduled_at && <p className="mt-2 text-sm text-red-600">{errors.scheduled_at}</p>}
                            </div>
                            <div>
                                <label htmlFor="attendee_message" className="block text-sm font-semibold text-slate-700">¿Qué quieres revisar en la demo? <span className="font-normal text-slate-400">(opcional)</span></label>
                                <textarea id="attendee_message" rows="5" maxLength="2000" value={data.attendee_message} onChange={(event) => setData('attendee_message', event.target.value)} placeholder="Cuéntanos qué necesitas organizar, cuántas personas usarán la plataforma o qué preguntas tienes..." className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-[#5b50f5] focus:ring-[#5b50f5]" />
                                {errors.attendee_message && <p className="mt-2 text-sm text-red-600">{errors.attendee_message}</p>}
                            </div>
                            <div className="rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900"><strong>Solicitud de {demoRequest.business?.name || 'tu negocio'}</strong><p className="mt-1">Modalidad: {demoRequest.demo_mode === 'both' ? 'Probar ahora + demo guiada' : 'Demo guiada'}</p></div>
                            <button type="submit" disabled={processing} className="w-full rounded-xl bg-[#5b50f5] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4840d2] disabled:cursor-wait disabled:opacity-60">{processing ? 'Guardando reserva...' : 'Confirmar reserva'}</button>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
}
