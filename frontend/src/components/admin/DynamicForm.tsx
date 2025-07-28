import React, { useState } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'file';
  required?: boolean;
}

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  open: boolean;
  loading?: boolean;
  error?: string | null;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, onClose, open, loading = false, error = null }) => {
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [formError, setFormError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file') {
      setFormState((prev) => ({ ...prev, [name]: files && files[0] }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData();
    for (const field of fields) {
      if (field.type === 'file') {
        if (formState[field.name]) {
          formData.append(field.name, formState[field.name]);
        }
      } else {
        formData.append(field.name, formState[field.name] || '');
      }
    }
    try {
      await onSubmit(formData);
      setFormState({});
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-8 shadow-2xl w-full max-w-md border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-semibold text-blue-100">{field.label}</label>
              {field.type === 'text' || field.type === 'number' ? (
                <input
                  className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  type={field.type}
                  name={field.name}
                  value={formState[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.label}
                />
              ) : field.type === 'file' ? (
                <input
                  className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white file:bg-purple-700 file:text-white file:rounded file:px-3 file:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  type="file"
                  name={field.name}
                  accept="image/*"
                  onChange={handleChange}
                  required={field.required}
                />
              ) : null}
            </div>
          ))}
          {(error || formError) && <div className="text-red-400 text-sm font-semibold">{error || formError}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-white/20 text-blue-100 rounded hover:bg-white/30 transition-all duration-300" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
