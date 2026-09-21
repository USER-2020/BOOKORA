import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Icon from '../../../src/components/Icon';

export default function DateTimePicker({
    label,
    value,
    onChange,
    mode = 'date',
    placeholder,
    required = false,
}) {
    const isTime = mode === 'time';

    return (
        <label className="availability-field">
            <span>{label}{required && <em>*</em>}</span>
            <span className="availability-picker-wrap">
                <Icon name={isTime ? 'clock' : 'calendar'} size={18} />
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    showPopperArrow={false}
                    placeholderText={placeholder}
                    className="availability-picker-input"
                    calendarClassName="noryvaq-datepicker"
                    popperClassName="noryvaq-datepicker-popper"
                    wrapperClassName="availability-datepicker-wrapper"
                    dateFormat={isTime ? 'HH:mm' : 'dd/MM/yyyy'}
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    showTimeSelect={isTime}
                    showTimeSelectOnly={isTime}
                    timeCaption="Hora"
                    aria-label={label}
                />
            </span>
        </label>
    );
}
