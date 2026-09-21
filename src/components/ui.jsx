import React from 'react';
import Icon from './Icon';

export function Button({ children, variant = 'primary', icon, iconRight, onClick, type = 'button', className = '', disabled = false }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={17} />}{children}{iconRight && <Icon name={iconRight} size={17} />}</button>;
}

export function Badge({ children, tone = 'purple', dot = false }) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>;
}

export function MetricCard({ icon, label, value, change, tone = 'purple' }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><Icon name={icon} size={19} /></div><div><span className="metric-label">{label}</span><strong>{value}</strong><small className={change?.startsWith('-') ? 'change-down' : ''}>{change}</small></div></div>;
}

export function SectionTitle({ eyebrow, title, text, action }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{text && <p>{text}</p>}</div>{action}</div>;
}

export function Avatar({ initials, tone = 'purple', image }) {
  return image ? <img className="avatar" src={image} alt="" /> : <span className={`avatar avatar-${tone}`}>{initials}</span>;
}

export function Field({ label, placeholder, value, onChange, type = 'text', icon, required = false }) {
  return <label className="field"><span>{label}{required && <em>*</em>}</span><div className="field-control">{icon && <Icon name={icon} size={16} />}<input type={type} placeholder={placeholder} value={value} onChange={onChange} /></div></label>;
}
