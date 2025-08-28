import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';

export const SettingsTab: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/settings').then(res => res.json()).then(setSettings);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        setIsSaving(false);
        alert('Configuración guardada.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Configuración de la Tienda</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <InputField label="Nombre del Sitio" name="site_name" value={settings.site_name || ''} onChange={handleChange} />
                <InputField label="Email de Contacto" name="contact_email" value={settings.contact_email || ''} onChange={handleChange} />
                <InputField label="Teléfono de Contacto" name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} />
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-[#D8A7B1] text-white rounded hover:bg-[#c69ba5]">
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full p-2 border rounded" />
    </div>
);