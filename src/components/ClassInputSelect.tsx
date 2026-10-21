import React, { useState, useMemo } from 'react';
import { getAllClasses, normalizeClassName, SD_CLASSES, SMP_CLASSES } from '../lib/utils';
import { Plus, ListFilter, Sparkles, Check, School, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface ClassInputSelectProps {
  value: string;
  onChange: (newClass: string) => void;
  students?: Student[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ClassInputSelect: React.FC<ClassInputSelectProps> = ({
  value,
  onChange,
  students = [],
  label = 'Kelas',
  required = true,
  disabled = false,
  className = '',
}) => {
  const registeredClasses = useMemo(() => {
    return getAllClasses(students);
  }, [students]);

  // If there are no registered classes, default to custom/quick-pick input mode
  const [isCustomMode, setIsCustomMode] = useState(() => registeredClasses.length === 0);
  const [activeTab, setActiveTab] = useState<'SD' | 'SMP'>('SD');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsCustomMode(true);
      return;
    }
    onChange(normalizeClassName(val));
  };

  const handleCustomInput = (raw: string) => {
    onChange(normalizeClassName(raw));
  };

  const handlePillClick = (cls: string) => {
    onChange(cls);
  };

  const currentNormalized = normalizeClassName(value);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="label mb-0 flex items-center gap-1.5 font-bold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {registeredClasses.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 py-0.5 px-2 rounded-lg hover:bg-indigo-50"
          >
            {isCustomMode ? (
              <>
                <ListFilter size={13} />
                Pilih Dari Kelas Terdaftar
              </>
            ) : (
              <>
                <Plus size={13} />
                Tambah / Ketik Kelas Baru
              </>
            )}
          </button>
        )}
      </div>

      {!isCustomMode && registeredClasses.length > 0 ? (
        <div className="space-y-1.5">
          <select
            className="input font-semibold w-full bg-white border-indigo-200 focus:border-indigo-500"
            value={currentNormalized}
            onChange={handleSelectChange}
            disabled={disabled}
            required={required}
          >
            <option value="" disabled>-- Pilih Kelas Siswa --</option>
            {registeredClasses.map(c => (
              <option key={c} value={c}>
                Kelas {c}
              </option>
            ))}
            {currentNormalized && !registeredClasses.includes(currentNormalized) && (
              <option value={currentNormalized}>
                Kelas {currentNormalized} (Baru)
              </option>
            )}
            <option value="__ADD_NEW__">➕ + Tambah / Ketik Kelas Baru Lainnya...</option>
          </select>
          <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
            <span>Kelas aktif otomatis mengikuti data siswa yang tersimpan.</span>
            <span className="font-semibold text-indigo-600 font-mono">
              Terpilih: {currentNormalized ? `Kelas ${currentNormalized}` : '-'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="input bg-white font-bold text-indigo-950 text-base placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Ketik kelas (contoh: 1A, 7A, 8B, 9C, 1D, dsb)..."
              value={currentNormalized}
              onChange={(e) => handleCustomInput(e.target.value)}
              disabled={disabled}
              required={required}
            />
            {currentNormalized && (
              <span className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs flex items-center gap-1">
                <Check size={14} /> Kelas {currentNormalized}
              </span>
            )}
          </div>

          {/* Quick preset selector */}
          <div className="space-y-2 pt-1 border-t border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                Pilihan Cepat Sesuai Jenjang
              </span>
              <div className="flex rounded-lg bg-white/80 p-0.5 border border-indigo-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('SD')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
                    activeTab === 'SD'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <School size={12} /> SD (1-6)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('SMP')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition flex items-center gap-1 ${
                    activeTab === 'SMP'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <GraduationCap size={12} /> SMP (7-9)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {(activeTab === 'SD' ? SD_CLASSES : SMP_CLASSES).map((cls) => {
                const isSelected = currentNormalized === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handlePillClick(cls)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm scale-105 ring-2 ring-indigo-300'
                        : 'bg-white hover:bg-indigo-100/70 text-gray-700 border border-indigo-100 hover:border-indigo-300'
                    }`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-indigo-700/80 leading-tight">
              💡 <em>Tips:</em> Klik tombol pilihan di atas atau ketik langsung huruf/angka kelas jika memiliki kelas lain (contoh: 1D, 7D, 8B). Kelas aktif akan langsung menyesuaikan dengan yang diinput.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
