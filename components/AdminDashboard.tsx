
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Service, ShopSettings } from '../types';
import { Button } from './ui/Button';
import { Plus, Trash2, Save, ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(StorageService.getSettings());
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  useEffect(() => {
    setServices(StorageService.getServices());
  }, []);

  const handleSaveServices = () => {
    StorageService.saveServices(services);
    alert('Services saved!');
  };

  const handleSaveSettings = () => {
    StorageService.saveSettings(settings);
    setIsEditingSettings(false);
    alert('Settings saved!');
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: 'New Service',
      description: 'Service description',
      category: 'Nail Services',
      durationMinutes: 60,
      price: 0
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <h1 className="text-xl font-serif font-bold text-stone-900">Administration</h1>
          </div>
          <Button onClick={() => setIsEditingSettings(!isEditingSettings)} variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Settings Section */}
        {isEditingSettings && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-600" /> 
              Shop Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Shop Name</label>
                <input 
                  type="text" 
                  value={settings.shopName}
                  onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                  className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">WhatsApp Number (intl format, no +)</label>
                <input 
                  type="text" 
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                  className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Opening Time</label>
                <input 
                  type="time" 
                  value={settings.openingTime}
                  onChange={(e) => setSettings({...settings, openingTime: e.target.value})}
                  className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Closing Time</label>
                <input 
                  type="time" 
                  value={settings.closingTime}
                  onChange={(e) => setSettings({...settings, closingTime: e.target.value})}
                  className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-400 outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
               <Button onClick={handleSaveSettings} size="sm">Save Settings</Button>
            </div>
          </div>
        )}

        {/* Services Management */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-800">Services</h2>
            <Button onClick={addService} size="sm" variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-grow space-y-3 w-full">
                  <div className="flex gap-2">
                    <div className="w-2/3">
                        <label className="text-xs text-stone-400">Name</label>
                        <input 
                        type="text" 
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="w-full font-semibold text-stone-800 border-b border-transparent focus:border-brand-300 outline-none bg-transparent"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="text-xs text-stone-400">Category</label>
                        <input 
                        type="text" 
                        value={service.category || ''}
                        onChange={(e) => updateService(service.id, 'category', e.target.value)}
                        className="w-full text-stone-600 border-b border-transparent focus:border-brand-300 outline-none bg-transparent"
                        placeholder="Nails, Braids..."
                        />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-400">Description</label>
                    <input 
                      type="text" 
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      className="w-full text-sm text-stone-500 border-b border-transparent focus:border-brand-300 outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="text-xs text-stone-400">Price ({settings.currency})</label>
                        <input 
                        type="number" 
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value))}
                        className="w-full text-stone-800 border-b border-transparent focus:border-brand-300 outline-none bg-transparent"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-stone-400">Duration (min)</label>
                        <input 
                        type="number" 
                        value={service.durationMinutes}
                        onChange={(e) => updateService(service.id, 'durationMinutes', parseInt(e.target.value))}
                        className="w-full text-stone-800 border-b border-transparent focus:border-brand-300 outline-none bg-transparent"
                        />
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 w-full md:w-auto justify-end">
                    <button 
                        onClick={() => removeService(service.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Save */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSaveServices} className="shadow-xl scale-110">
          <Save className="w-5 h-5 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};
