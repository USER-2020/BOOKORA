import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';

import DateTimePicker from '../Components/DateTimePicker';
import Icon from '../../../src/components/Icon';
import '../../css/availability.css';

const weekdays = [
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' },
    { value: 0, label: 'Dom' },
];

const formatDate = (date) => date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const formatTime = (date) => date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

const cloneAtTime = (source, hours) => {
    const result = new Date(source);
    result.setHours(hours, 0, 0, 0);
    return result;
};

export default function Availability() {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [firstTime, setFirstTime] = useState(cloneAtTime(new Date(), 9));
    const [lastTime, setLastTime] = useState(cloneAtTime(new Date(), 17));
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState('');

    const toggleDay = (day) => {
        setSelectedDays((current) => current.includes(day)
            ? current.filter((item) => item !== day)
            : [...current, day]);
    };

    const generateSlots = () => {
        if (!fromDate || !toDate) {
            setMessage('Selecciona una fecha inicial y una fecha final.');
            return;
        }

        if (toDate < fromDate) {
            setMessage('La fecha final debe ser posterior a la fecha inicial.');
            return;
        }

        if (!selectedDays.length) {
            setMessage('Selecciona al menos un día de atención.');
            return;
        }

        if (firstTime >= lastTime) {
            setMessage('La primera hora debe ser anterior a la última hora.');
            return;
        }

        const nextSlots = [];
        const cursor = new Date(fromDate);
        cursor.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(0, 0, 0, 0);

        while (cursor <= end) {
            if (selectedDays.includes(cursor.getDay())) {
                for (let hour = firstTime.getHours(); hour < lastTime.getHours(); hour += 1) {
                    const slot = new Date(cursor);
                    slot.setHours(hour, 0, 0, 0);
                    nextSlots.push(slot);
                }
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        setSlots(nextSlots);
        setMessage(nextSlots.length ? `${nextSlots.length} franjas generadas.` : 'No hay franjas para los filtros elegidos.');
    };

    const groupedSlots = useMemo(() => slots.reduce((groups, slot) => {
        const date = formatDate(slot);
        groups[date] = groups[date] || [];
        groups[date].push(formatTime(slot));
        return groups;
    }, {}), [slots]);

    return (
        <>
            <Head title="Disponibilidad" />
            <main className="availability-page">
                <header className="availability-header">
                    <div className="availability-brand"><span className="availability-brand-mark">N</span><strong>Noryvaq</strong></div>
                    <div className="availability-header-copy">
                        <span>Disponibilidad</span>
                        <small>Configura las horas en que tu negocio recibe reservas.</small>
                    </div>
                    <button type="button" className="availability-icon-button" aria-label="Configuración"><Icon name="settings" size={19} /></button>
                </header>

                <section className="availability-generator availability-card">
                    <div className="availability-section-title">
                        <span className="availability-title-icon"><Icon name="plus" size={22} /></span>
                        <div>
                            <h1>Generar franjas disponibles</h1>
                            <p>Cada franja dura exactamente una hora. No se duplican horarios existentes.</p>
                        </div>
                    </div>

                    <div className="availability-form-grid">
                        <DateTimePicker label="Desde" value={fromDate} onChange={setFromDate} placeholder="dd/mm/aaaa" required />
                        <DateTimePicker label="Hasta" value={toDate} onChange={setToDate} placeholder="dd/mm/aaaa" required />
                        <DateTimePicker label="Primera hora" value={firstTime} onChange={setFirstTime} mode="time" placeholder="09:00" required />
                        <DateTimePicker label="Última hora" value={lastTime} onChange={setLastTime} mode="time" placeholder="17:00" required />
                    </div>

                    <div className="availability-generator-footer">
                        <div>
                            <span className="availability-label">Días de atención</span>
                            <div className="availability-day-list">
                                {weekdays.map((day) => (
                                    <button
                                        type="button"
                                        key={day.value}
                                        className={selectedDays.includes(day.value) ? 'selected' : ''}
                                        onClick={() => toggleDay(day.value)}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="button" className="availability-primary-button" onClick={generateSlots}>
                            Generar horarios <Icon name="plus" size={18} />
                        </button>
                    </div>
                    {message && <p className="availability-form-message">{message}</p>}
                </section>

                <section className="availability-two-columns">
                    <div className="availability-card availability-slots-card">
                        <div className="availability-card-heading">
                            <div>
                                <h2>Próximas franjas</h2>
                                <p>Los horarios reservados desaparecen para las demás candidatas.</p>
                            </div>
                            <Icon name="calendar" size={22} />
                        </div>
                        {Object.keys(groupedSlots).length ? (
                            <div className="availability-slot-groups">
                                {Object.entries(groupedSlots).map(([date, times]) => (
                                    <div className="availability-slot-group" key={date}>
                                        <strong>{date}</strong>
                                        <div>{times.map((time) => <span key={`${date}-${time}`}>{time}</span>)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="availability-empty-state">Todavía no hay franjas generadas.</p>}
                    </div>

                    <div className="availability-card availability-invitation-card">
                        <div className="availability-card-heading">
                            <div>
                                <h2>Enviar invitación</h2>
                                <p>La candidata recibirá los horarios y un enlace personal.</p>
                            </div>
                        </div>
                        <div className="availability-invite-row">
                            <div><strong>Sofía Arcila Saldarriaga</strong><span>VEL-CAN-000001</span></div>
                            <button type="button" className="availability-outline-button"><Icon name="arrow" size={16} /> Enviar horarios</button>
                        </div>
                    </div>
                </section>

                <section className="availability-card availability-appointments-card">
                    <div className="availability-card-heading">
                        <div>
                            <h2><Icon name="check" size={22} /> Citas e invitaciones</h2>
                            <p>Seguimiento de cada entrevista.</p>
                        </div>
                    </div>
                    <div className="availability-table-header"><span>CANDIDATA</span><span>FECHA</span><span>ESTADO</span><span>CONTACTO</span></div>
                    <p className="availability-empty-state">Aún no hay invitaciones.</p>
                </section>
            </main>
        </>
    );
}
