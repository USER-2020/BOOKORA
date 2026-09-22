import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SwitchButton from '@/Components/SwitchButton';
import TextInput from '@/Components/TextInput';
import colombianCities from '@/data/colombia-cities.json';
import { Head, useForm } from '@inertiajs/react';
import {
    LuBriefcaseBusiness,
    LuBuilding2,
    LuCalendarDays,
    LuDumbbell,
    LuGraduationCap,
    LuHeartPulse,
    LuKeyRound,
    LuPlus,
    LuSparkles,
    LuScissors,
    LuUtensils,
    LuUsers,
} from 'react-icons/lu';
import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useRef } from 'react';
import { LuCheck, LuDatabase, LuLoaderCircle, LuRocket, LuSettings2 } from 'react-icons/lu';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const steps = ['Negocio', 'Modelo', 'Reserva', 'Operación', 'Módulos', 'Volumen', 'Demo', 'Workspace'];
const categories = [['beauty', 'Belleza y bienestar', '✂'], ['restaurant', 'Restaurantes / gastronomía', '♨'], ['health', 'Salud', '✚'], ['fitness', 'Fitness / deporte', '✦'], ['education', 'Educación', '◆'], ['events', 'Eventos', '▦'], ['coworking', 'Coworking / espacios', '▥'], ['rental', 'Alquileres', '▣'], ['professional', 'Servicios profesionales', '▤'], ['other', 'Otro', '＋']];
const models = [['services', 'Citas / servicios', '◴'], ['tables', 'Mesas', '♨'], ['classes', 'Clases', '◉'], ['spaces', 'Espacios', '⌂'], ['resources', 'Recursos', '▦'], ['equipment', 'Equipos', '▣'], ['vehicles', 'Vehículos', '▰'], ['experiences', 'Experiencias', '♡'], ['lodging', 'Alojamiento', '⌂'], ['other', 'Otro', '＋']];
const fields = [['service', 'Servicio'], ['staff', 'Profesional'], ['location', 'Sede'], ['resource', 'Recurso'], ['room', 'Sala'], ['table', 'Mesa'], ['equipment', 'Equipo'], ['date', 'Fecha'], ['time', 'Hora'], ['guest_count', 'Cantidad de personas'], ['extras', 'Extras']];
const modules = [['calendar', 'Calendario'], ['crm', 'Clientes / CRM'], ['payments', 'Pagos'], ['forms', 'Formularios'], ['reminders', 'Recordatorios'], ['promotions', 'Promociones'], ['memberships', 'Membresías'], ['coupons', 'Cupones'], ['waitlist', 'Lista de espera'], ['reports', 'Reportes'], ['automations', 'Automatizaciones'], ['integrations', 'Integraciones']];
const inputClass = 'mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-[#5b50f5] focus:ring-[#5b50f5]';
const cx = (base, condition, yes, no) => base + ' ' + (condition ? yes : no);
const iconByLabel = {
    'Belleza y bienestar': LuScissors,
    'Restaurantes / gastronomía': LuUtensils,
    Salud: LuHeartPulse,
    'Fitness / deporte': LuDumbbell,
    Educación: LuGraduationCap,
    Eventos: LuCalendarDays,
    'Coworking / espacios': LuBuilding2,
    Alquileres: LuKeyRound,
    'Servicios profesionales': LuBriefcaseBusiness,
    Otro: LuPlus,
    'Citas / servicios': LuCalendarDays,
    Mesas: LuBuilding2,
    Clases: LuGraduationCap,
    Espacios: LuBuilding2,
    Recursos: LuSparkles,
    Equipos: LuBriefcaseBusiness,
    Vehículos: LuKeyRound,
    Experiencias: LuSparkles,
    Alojamiento: LuBuilding2,
    Servicio: LuBriefcaseBusiness,
    Profesional: LuUsers,
    Sede: LuBuilding2,
    Recurso: LuSparkles,
    Sala: LuBuilding2,
    Mesa: LuBuilding2,
    Equipo: LuBriefcaseBusiness,
    Fecha: LuCalendarDays,
    Hora: LuCalendarDays,
    'Cantidad de personas': LuUsers,
    Extras: LuPlus,
    Personal: LuUsers,
    Salas: LuBuilding2,
    'Ninguno': LuSparkles,
};

function OptionCard({ label, icon, selected, onClick, multiple = false }) {
    const Icon = typeof icon === 'function' ? icon : iconByLabel[label] || LuSparkles;
    return <button type="button" aria-pressed={selected} onClick={onClick} className={cx('flex min-h-[58px] items-center gap-3 rounded-2xl border p-3 text-left transition', selected, 'border-[#111827] bg-indigo-50 text-slate-950 shadow-sm', 'border-transparent bg-white text-slate-700 hover:border-indigo-200')}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg text-[#5b50f5]">{Icon ? <Icon size={18} strokeWidth={2} /> : icon}</span><span className="flex-1 text-sm font-semibold">{label}</span><SwitchButton checked={selected} multiple={multiple} /></button>;
}

export default function Business({ draft = {}, currentStep = 1 }) {
    const [step, setStep] = useState(Math.max(1, Math.min(currentStep, 8)));
    const [provisioning, setProvisioning] = useState(false);
    const [provisionStage, setProvisionStage] = useState(0);
    const [provisionError, setProvisionError] = useState('');
    const [validationError, setValidationError] = useState('');
    const overlayRoot = useRef(null);
    const provisioningTimeout = useRef(null);
    const provisioningCancel = useRef(null);

    useEffect(() => {
        const hostId = 'noryvaq-provisioning-overlay';
        if (provisioning) {
            let host = document.getElementById(hostId);
            if (!host) {
                host = document.createElement('div');
                host.id = hostId;
                document.body.appendChild(host);
            }
            overlayRoot.current ||= createRoot(host);
            overlayRoot.current.render(<ProvisioningOverlay stage={provisionStage} />);
        } else if (overlayRoot.current) {
            overlayRoot.current.unmount();
            overlayRoot.current = null;
            document.getElementById(hostId)?.remove();
        }
        return () => {
            if (!provisioning && overlayRoot.current) {
                overlayRoot.current.unmount();
                overlayRoot.current = null;
            }
        };
    }, [provisioning, provisionStage]);
    const { data, setData, post, processing, errors } = useForm({
        step: 1,
        business_name: draft.business_name || '', business_category: draft.business_category || '', business_description: draft.business_description || '', country: draft.country || 'Colombia', city: draft.city || 'Manizales',
        booking_model: draft.booking_model || '', capacity_mode: draft.capacity_mode || '', duration_mode: draft.duration_mode || '', booking_fields: draft.booking_fields || [],
        location_mode: draft.location_mode || '', resource_types: draft.resource_types || [], features: draft.features || ['calendar', 'crm', 'forms', 'reports'],
        monthly_booking_range: draft.monthly_booking_range || '', team_size_range: draft.team_size_range || '', estimated_locations: draft.estimated_locations || '',
        first_name: draft.first_name || '', last_name: draft.last_name || '', email: draft.email || '', phone: draft.phone || '', role: draft.role || '', password: draft.password || '', objective: draft.objective || '', demo_mode: draft.demo_mode || 'try_now',
    });
    const select = (key, value, multiple = false) => setData(key, multiple ? (data[key] || []).includes(value) ? data[key].filter((item) => item !== value) : [...(data[key] || []), value] : value);
    const validateBeforeProvisioning = () => {
        const checks = [
            [1, data.business_name, 'Completa el nombre del negocio.'],
            [1, data.business_category, 'Selecciona la actividad principal.'],
            [1, data.country, 'Completa el país.'],
            [1, data.city, 'Completa la ciudad.'],
            [2, data.booking_model, 'Selecciona qué tipo de reserva manejas.'],
            [2, data.capacity_mode, 'Selecciona la capacidad de tus reservas.'],
            [3, data.duration_mode, 'Selecciona cuánto dura una reserva.'],
            [3, data.booking_fields?.length, 'Selecciona al menos un dato que deba elegir el cliente.'],
            [4, data.location_mode, 'Selecciona cómo funcionan tus sedes.'],
            [5, data.features?.length, 'Selecciona al menos un módulo para tu demo.'],
            [6, data.monthly_booking_range, 'Selecciona el volumen mensual de reservas.'],
            [6, data.team_size_range, 'Selecciona cuántas personas usarán Noryvaq.'],
            [6, data.estimated_locations, 'Selecciona cuántas sedes tienes.'],
            [7, data.first_name, 'Completa tu nombre.'],
            [7, data.last_name, 'Completa tu apellido.'],
            [7, data.email && data.email.includes('@'), 'Ingresa un correo válido.'],
            [7, data.password && data.password.length >= 8, 'La contraseña debe tener mínimo 8 caracteres.'],
            [7, data.objective, 'Selecciona tu objetivo principal.'],
            [7, data.demo_mode, 'Selecciona la modalidad de demo.'],
        ];
        const missing = checks.find(([, value]) => !value);
        if (!missing) return true;
        setValidationError(missing[2]);
        setStep(missing[0]);
        return false;
    };

    const next = () => {
        setValidationError('');
        if (step === 8) {
            if (!validateBeforeProvisioning()) return;
            setProvisionError('');
            setProvisionStage(0);
            setProvisioning(true);
            [1, 2, 3].forEach((stage, index) => {
                setTimeout(() => setProvisionStage(stage), 500 + index * 900);
            });
            provisioningTimeout.current = setTimeout(() => {
                provisioningCancel.current?.cancel();
                setProvisioning(false);
                setProvisionError('La creación está tardando demasiado y no pudimos confirmarla. Verifica tu conexión e inténtalo de nuevo.');
            }, 30000);
            post(route('onboarding.complete'), {
                onCancelToken: (cancelToken) => {
                    provisioningCancel.current = cancelToken;
                },
                onSuccess: () => {
                    window.localStorage.setItem('noryvaq_demo_profile', JSON.stringify({ ...data, created_at: new Date().toISOString() }));
                    document.cookie = 'noryvaq_demo=1; max-age=2592000; path=/; SameSite=Lax';
                },
                onError: (responseErrors) => {
                    setProvisioning(false);
                    const firstError = Object.values(responseErrors || {})[0];
                    setProvisionError(Array.isArray(firstError) ? firstError[0] : firstError || 'No pudimos crear tu workspace. Revisa los datos e inténtalo de nuevo.');
                },
                onCancel: () => {
                    setProvisioning(false);
                    setProvisionError('La creación fue cancelada antes de confirmar el acceso.');
                },
                onFinish: () => {
                    clearTimeout(provisioningTimeout.current);
                    provisioningTimeout.current = null;
                    provisioningCancel.current = null;
                },
            });
            return;
        }
        setData('step', step);
        post(route('onboarding.save'), { preserveScroll: true, onSuccess: () => setStep(step + 1) });
    };
    const summary = useMemo(() => [['Industria', (categories.find(([value]) => value === data.business_category) || [])[1] || 'Pendiente'], ['Modelo', (models.find(([value]) => value === data.booking_model) || [])[1] || 'Pendiente'], ['Capacidad', data.capacity_mode || 'Pendiente'], ['Sedes', data.location_mode || 'Pendiente'], ['Módulos', (data.features || []).length + ' seleccionados'], ['Volumen', data.monthly_booking_range || 'Pendiente']], [data]);
    const title = ['Cuéntanos sobre tu negocio', '¿Qué necesita reservar tu cliente?', 'Define cómo ocurre una reserva', 'Organiza tu operación', 'Activa los módulos que quieres probar', 'Cuéntanos el tamaño de tu operación', 'Solicita tu demo personalizada', '¡Todo listo!'][step - 1];

    return <div className="min-h-screen bg-[#f7f8fc] text-slate-900"><Head title={'Onboarding · ' + steps[step - 1]} /><header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8"><a href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b50f5] text-lg font-black text-white">N</span><span className="font-bold tracking-tight">Noryvaq</span></a><span className="hidden text-xs font-medium text-slate-400 sm:block">Reserva. Conecta. Haz crecer.</span><span className="text-xs font-semibold text-slate-500">Guardado automáticamente</span></header><div className="mx-auto grid max-w-[1500px] gap-6 p-4 sm:p-6 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:p-8">
        <aside className="hidden rounded-3xl border border-slate-200 bg-white p-4 lg:block"><p className="px-3 pb-4 text-xs font-bold uppercase tracking-widest text-[#5b50f5]">Tu configuración</p>{steps.map((label, index) => <button type="button" key={label} onClick={() => index + 1 <= step && setStep(index + 1)} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm', step === index + 1, 'bg-indigo-50 font-bold text-[#4b43d1]', index + 1 < step ? 'text-slate-700' : 'text-slate-400')}><span className={cx('flex h-6 w-6 items-center justify-center rounded-full text-xs', step === index + 1, 'bg-[#5b50f5] text-white', 'bg-slate-100')}>{index + 1}</span>{label}</button>)}</aside>
        <main className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><div className="mb-8"><div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#5b50f5]"><span>Paso {step} de 8</span><span>{Math.round(step / 8 * 100)}%</span></div><div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#5b50f5] to-[#36c9e8]" style={{ width: step / 8 * 100 + '%' }} /></div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{step === 1 ? 'Comencemos a configurar tu experiencia. Queremos entender todo lo necesario antes de crear tu demo.' : step === 8 ? 'Tu espacio de prueba está listo para explorar.' : 'Noryvaq está entendiendo tu negocio para preparar una experiencia a tu medida.'}</p></div>
        {step === 1 && <div className="space-y-5"><div><InputLabel htmlFor="business_name" value="Nombre del negocio" /><TextInput id="business_name" value={data.business_name} onChange={(e) => setData('business_name', e.target.value)} className="mt-1 block w-full" required /><InputError message={errors.business_name} className="mt-2" /></div><div><InputLabel value="Actividad principal" /><div className="mt-2 grid gap-3 sm:grid-cols-2">{categories.map(([value, label, icon]) => <OptionCard key={value} label={label} icon={icon} selected={data.business_category === value} onClick={() => select('business_category', value)} />)}</div><InputError message={errors.business_category} className="mt-2" /></div><div><InputLabel htmlFor="business_description" value="Descripción breve (opcional)" /><textarea id="business_description" value={data.business_description} onChange={(e) => setData('business_description', e.target.value)} className={inputClass + ' min-h-24'} /></div><div className="grid gap-5 sm:grid-cols-2"><div><InputLabel htmlFor="country" value="País" /><TextInput id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} className="mt-1 block w-full" required /></div><div><InputLabel htmlFor="city" value="Ciudad" /><CityCombobox value={data.city} onChange={(value) => setData('city', value)} /><InputError message={errors.city} className="mt-2" /></div></div></div>}
        {step === 2 && <div className="grid gap-3 sm:grid-cols-2">{models.map(([value, label, icon]) => <OptionCard key={value} label={label} icon={icon} selected={data.booking_model === value} onClick={() => select('booking_model', value)} />)}<div className="sm:col-span-2"><InputLabel value="¿Cuántas personas pueden reservar el mismo horario?" /><select value={data.capacity_mode} onChange={(e) => setData('capacity_mode', e.target.value)} className={inputClass}><option value="">Selecciona una opción</option><option value="single">1 cliente</option><option value="limited">Capacidad limitada</option><option value="multiple">Múltiples clientes</option><option value="depends">Depende del servicio</option></select></div><InputError message={errors.booking_model || errors.capacity_mode} className="sm:col-span-2" /></div>}
        {step === 3 && <div className="space-y-6"><div><InputLabel value="¿Cuánto dura una reserva?" /><div className="mt-2 grid gap-3 sm:grid-cols-2">{[['fixed', 'Duración fija'], ['variable', 'Duración variable'], ['hours', 'Rango de horas'], ['day', 'Día completo'], ['date_range', 'Rango de fechas']].map(([value, label]) => <OptionCard key={value} label={label} icon="◷" selected={data.duration_mode === value} onClick={() => select('duration_mode', value)} />)}</div></div><div><InputLabel value="¿Qué debe seleccionar el cliente? Puedes elegir varias." /><div className="mt-2 grid gap-3 sm:grid-cols-3">{fields.map(([value, label]) => <OptionCard key={value} label={label} icon="✓" multiple selected={data.booking_fields.includes(value)} onClick={() => select('booking_fields', value, true)} />)}</div><InputError message={errors.booking_fields} className="mt-2" /></div></div>}
        {step === 4 && <div className="space-y-6"><div><InputLabel value="¿Tienes una o varias sedes?" /><div className="mt-2 grid gap-3 sm:grid-cols-2">{[['single', 'Una sede'], ['multiple', 'Varias sedes'], ['virtual', '100% virtual'], ['home', 'A domicilio'], ['mobile', 'Itinerante']].map(([value, label]) => <OptionCard key={value} label={label} icon="⌂" selected={data.location_mode === value} onClick={() => select('location_mode', value)} />)}</div></div><div><InputLabel value="¿Qué recursos participan en una reserva?" /><div className="mt-2 grid gap-3 sm:grid-cols-2">{['staff', 'rooms', 'tables', 'equipment', 'vehicles', 'spaces', 'none'].map((value) => <OptionCard key={value} label={{ staff: 'Personal', rooms: 'Salas', tables: 'Mesas', equipment: 'Equipos', vehicles: 'Vehículos', spaces: 'Espacios', none: 'Ninguno' }[value]} icon="◆" multiple selected={data.resource_types.includes(value)} onClick={() => select('resource_types', value, true)} />)}</div></div></div>}
        {step === 5 && <div className="grid gap-3 sm:grid-cols-2">{modules.map(([value, label]) => <OptionCard key={value} label={label} icon="▦" multiple selected={data.features.includes(value)} onClick={() => select('features', value, true)} />)}</div>}
        {step === 6 && <div className="space-y-5"><FieldSelect label="¿Cuántas reservas manejas al mes?" value={data.monthly_booking_range} onChange={(value) => setData('monthly_booking_range', value)} options={['Menos de 100', '100 – 500', '500 – 2.000', '2.000 – 10.000', 'Más de 10.000']} /><FieldSelect label="¿Cuántas personas usarán Noryvaq?" value={data.team_size_range} onChange={(value) => setData('team_size_range', value)} options={['1', '2 – 5', '6 – 20', '21 – 100', 'Más de 100']} /><FieldSelect label="¿Cuántas sedes tienes?" value={data.estimated_locations} onChange={(value) => setData('estimated_locations', value)} options={['1', '2 – 5', '6 – 20', 'Más de 20']} /></div>}
        {step === 7 && <div className="grid gap-5 sm:grid-cols-2"><div><InputLabel value="Nombre" /><TextInput value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full" required /></div><div><InputLabel value="Apellido" /><TextInput value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full" required /></div><div><InputLabel value="Correo" /><TextInput type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" required /></div><div><InputLabel value="Teléfono / WhatsApp" /><PhoneInput country="co" preferredCountries={['co']} enableSearch value={data.phone} onChange={(value) => setData('phone', value)} inputProps={{ name: 'phone', autoComplete: 'tel' }} containerClass="mt-1 !w-full" inputClass="!h-[46px] !w-full !rounded-xl !border-slate-200 !bg-slate-50 !px-4 !py-3 !text-sm !shadow-sm focus:!border-[#5b50f5] focus:!ring-[#5b50f5]" buttonClass="!rounded-l-xl !border-slate-200 !bg-slate-50" dropdownClass="!z-50" /></div><div><InputLabel value="Cargo" /><TextInput value={data.role} onChange={(e) => setData('role', e.target.value)} className="mt-1 block w-full" /></div><div><InputLabel value="Contraseña de acceso" /><TextInput type="password" minLength="8" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full" required /></div><div className="sm:col-span-2"><FieldSelect label="Objetivo principal" value={data.objective} onChange={(value) => setData('objective', value)} options={['Recibir más reservas', 'Organizar mi agenda', 'Reducir trabajo manual', 'Cobrar online', 'Gestionar varias sedes', 'Gestionar personal', 'Mejorar la experiencia del cliente', 'Centralizar mi operación', 'Otro']} /><FieldSelect label="Modalidad de demo" value={data.demo_mode} onChange={(value) => setData('demo_mode', value)} options={[{ value: 'try_now', label: 'Probar Noryvaq ahora' }, { value: 'guided', label: 'Demo guiada con nuestro equipo' }, { value: 'both', label: 'Quiero ambas opciones' }]} /></div></div>}
        {validationError && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">{validationError}</div>}
        {step === 8 && <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-6"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b50f5] text-2xl text-white">✓</div><h2 className="text-xl font-bold">Tu espacio de prueba está listo.</h2><p className="mt-2 text-sm text-slate-600">Configuramos Noryvaq según la forma en que funciona tu negocio.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Perfil del negocio creado', 'Modelo de reserva configurado', 'Módulos activados', 'Dashboard preparado', 'Datos demo generados'].map((item) => <div key={item} className="text-sm font-medium text-slate-700">✓ {item}</div>)}</div>{provisionError && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{provisionError}</div>}</div>}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6"><button type="button" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="text-sm font-semibold text-slate-500 disabled:opacity-30">← Atrás</button><PrimaryButton type="button" onClick={next} disabled={processing}>{processing ? 'Guardando...' : step === 8 ? 'Entrar a mi demo' : 'Continuar →'}</PrimaryButton></div></main>
        <aside className="hidden space-y-4 lg:block"><div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Noryvaq está aprendiendo</h2><p className="mt-1 text-xs text-slate-500">Tu configuración se actualiza en tiempo real.</p><div className="mt-5 space-y-3">{summary.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">{label}</span><strong className="max-w-[140px] truncate text-right text-slate-800">{value}</strong></div>)}</div></div><div className="rounded-3xl bg-[#11184b] p-5 text-white"><h2 className="font-bold">Tu demo incluirá</h2><div className="mt-4 space-y-2 text-sm text-indigo-100">{(data.features || []).slice(0, 6).map((feature) => <div key={feature}>✓ {modules.find(([value]) => value === feature)?.[1] || feature}</div>)}</div></div></aside>
    </div></div>;
}

function FieldSelect({ label, value, onChange, options }) {
    return <div><InputLabel value={label} /><select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}><option value="">Selecciona una opción</option>{options.map((option) => { const item = typeof option === 'string' ? { value: option, label: option } : option; return <option value={item.value} key={item.value}>{item.label}</option>; })}</select></div>;
}

function CityCombobox({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value || '');
    const filteredCities = colombianCities
        .filter((city) => city.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
        .slice(0, 80);

    return <div className="relative mt-1">
        <input
            id="city"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
                setQuery(event.target.value);
                onChange(event.target.value);
                setOpen(true);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Busca una ciudad..."
            autoComplete="off"
            className={inputClass}
            required
        />
        {open && <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
            {filteredCities.length > 0 ? filteredCities.map((city) => <button
                type="button"
                key={city}
                onMouseDown={() => {
                    setQuery(city);
                    onChange(city);
                    setOpen(false);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >{city}</button>) : <p className="px-3 py-2 text-sm text-slate-500">No encontramos esa ciudad.</p>}
        </div>}
    </div>;
}

function ProvisioningOverlay({ stage }) {
    const progress = Math.min(stage * 33, 100);
    const items = [
        ['Perfil del negocio', LuSettings2],
        ['Motor de reservas', LuDatabase],
        ['Módulos y datos demo', LuRocket],
    ];

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#11184b]/70 p-5 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#5b50f5]">
                    <LuLoaderCircle size={32} className="animate-spin" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#5b50f5]">Noryvaq está trabajando</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Creando tu flujo en la plataforma</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Estamos preparando un workspace basado en la forma en que funciona tu negocio.</p>
                <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#5b50f5] to-[#36c9e8] transition-all duration-500" style={{ width: progress + '%' }} /></div>
                <div className="mt-6 space-y-3 text-left">{items.map(([label, Icon], index) => <div key={label} className="flex items-center gap-3 text-sm"><span className={cx('flex h-8 w-8 items-center justify-center rounded-xl', stage > index ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>{stage > index ? <LuCheck size={17} /> : <Icon size={17} />}</span><span className={stage > index ? 'font-semibold text-slate-800' : 'text-slate-500'}>{label}</span></div>)}</div>
                <p className="mt-7 text-xs font-medium text-slate-400">No cierres esta ventana…</p>
            </div>
        </div>
    );
}
