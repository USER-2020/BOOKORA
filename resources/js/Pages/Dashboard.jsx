import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Icon from '../../../src/components/Icon';

const labels = {
    calendar: 'Calendario',
    crm: 'Clientes / CRM',
    payments: 'Pagos',
    forms: 'Formularios',
    reminders: 'Recordatorios',
    promotions: 'Promociones',
    memberships: 'Membresías',
    coupons: 'Cupones',
    waitlist: 'Lista de espera',
    reports: 'Reportes',
    automations: 'Automatizaciones',
    integrations: 'Integraciones',
};

export default function Dashboard({ business, metrics }) {
    const { auth } = usePage().props;
    const [active, setActive] = useState('Inicio');
    const settings = business?.settings || {};
    const capabilities = business?.capabilities || {};
    const enabledFeatures = settings.features || ['calendar', 'crm', 'forms', 'reports'];
    const modules = useMemo(() => enabledFeatures.map((feature) => labels[feature] || feature), [enabledFeatures]);
    const demoExpiresAt = settings.demo_expires_at ? new Date(settings.demo_expires_at) : null;
    const demoDaysLeft = demoExpiresAt ? Math.max(0, Math.ceil((demoExpiresAt.getTime() - Date.now()) / 86400000)) : 10;
    const demoDateLabel = demoExpiresAt ? demoExpiresAt.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'en 10 días';
    const navigation = [
        ['Inicio', 'home', true],
        ['Reservas', 'calendar', true],
        ['Calendario', 'calendar', enabledFeatures.includes('calendar')],
        ['Clientes', 'people', enabledFeatures.includes('crm')],
        ['Servicios', 'spark', true],
        ['Equipo', 'people', capabilities.requires_staff || enabledFeatures.includes('staff')],
        ['Reportes', 'chart', enabledFeatures.includes('reports')],
        ['Configuración', 'settings', true],
    ].filter(([, , enabled]) => enabled);

    return (
        <AuthenticatedLayout>
            <Head title={business?.name || 'Dashboard'} />
            <div className="min-h-[calc(100vh-4rem)] bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5b50f5]">Workspace demo</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Hola, {auth?.user?.name || 'bienvenido'} <span className="text-[#5b50f5]">✦</span></h1>
                            <p className="mt-2 text-sm text-slate-500">Aquí tienes el resumen de <strong className="text-slate-700">{business?.name}</strong>.</p>
                        </div>
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><strong>{business?.industry || 'Negocio'}</strong><span className="mx-2 text-indigo-300">·</span>{settings.city || 'Tu ciudad'}</div>
                    </div>

                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-sm"><Icon name="clock" size={19} className="mt-0.5 shrink-0 text-amber-600" /><div className="text-sm"><strong>Estás usando una prueba demo.</strong><p className="mt-1 text-amber-800">Tus datos y este workspace se eliminarán después de 10 días, el {demoDateLabel}. Te quedan aproximadamente <strong>{demoDaysLeft} {demoDaysLeft === 1 ? 'día' : 'días'}</strong> para explorar Noryvaq.</p></div></div>

                    <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">{navigation.map(([label, icon]) => <button type="button" key={label} onClick={() => setActive(label)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === label ? 'bg-[#5b50f5] !text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-[#5b50f5] hover:!text-white'}`}><Icon name={icon} size={16} />{label}</button>)}</div>

                    {active === 'Inicio' ? <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Metric label="Reservas hoy" value={metrics?.bookings_today ?? 0} icon="calendar" />
                            <Metric label="Clientes" value={metrics?.customers ?? 0} icon="people" />
                            <Metric label="Servicios activos" value={metrics?.services ?? 0} icon="spark" />
                            <Metric label="Módulos activos" value={modules.length} icon="grid" />
                        </div>
                        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-slate-950">Tu operación está lista</h2><p className="mt-1 text-sm text-slate-500">Configuración generada desde tu onboarding.</p></div><Icon name="spark" size={22} className="text-[#5b50f5]" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Modelo de reserva', capabilities.booking_mode], ['Capacidad', capabilities.capacity_mode], ['Duración', settings.duration_mode], ['Sedes', settings.location_mode], ['Volumen mensual', settings.monthly_booking_range], ['Equipo', settings.team_size_range]].map(([label, value]) => <div className="rounded-2xl bg-slate-50 p-4" key={label}><p className="text-xs text-slate-500">{label}</p><strong className="mt-1 block text-sm text-slate-900">{value || 'Pendiente'}</strong></div>)}</div></section>
                            <section className="rounded-3xl bg-[#11184b] p-6 text-white"><h2 className="text-lg font-bold">Módulos de tu demo</h2><p className="mt-1 text-sm text-indigo-200">Activados según tus respuestas.</p><div className="mt-6 space-y-3">{modules.map((module) => <div className="flex items-center gap-3 text-sm" key={module}><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10"><Icon name="check" size={15} /></span>{module}</div>)}</div></section>
                        </div>
                    </> : <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#5b50f5]"><Icon name={navigation.find(([label]) => label === active)?.[1] || 'spark'} size={26} /></div><h2 className="mt-5 text-xl font-bold text-slate-950">{active}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Esta sección está lista para trabajar con la configuración de <strong>{business?.name}</strong>. Tu demo ya reconoce los módulos que seleccionaste.</p><button type="button" onClick={() => setActive('Inicio')} className="mt-6 rounded-xl bg-[#5b50f5] !text-white px-5 py-3 text-sm font-semibold hover:bg-[#4840d2]">Volver al inicio</button></section>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Metric({ label, value, icon }) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5b50f5]"><Icon name={icon} size={18} /></span></div><strong className="mt-4 block text-3xl font-bold tracking-tight text-slate-950">{value}</strong></div>;
}
