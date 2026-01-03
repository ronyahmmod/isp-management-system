// components/ui/FormInput.jsx
// it is a form input component that takes in a label, name, type, value, onChange, and error props

import { MessageSquare, DollarSign, Calendar, Tag } from "lucide-react";

const icons = {
  text: MessageSquare,
  number: DollarSign,
  date: Calendar,
  select: Tag,
};

export default function FormInput({
  label,
  name,
  register,
  error,
  type = "text",
  options = [],
  ...rest
}) {
  const Icon = icons[type] || MessageSquare;
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
          size={20}
        />
        {type === "select" ? (
          <select
            {...register(name)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all appearance-none cursor-pointer"
            {...rest}
          >
            <option value="">Select {label}</option>
            {options.map((opt, index) => {
              // Check if opt is an object; otherwise treat it as a string
              const isObject = typeof opt === "object" && opt !== null;
              const val = isObject ? opt.value : opt;
              const display = isObject ? opt.label : opt;

              return (
                <option
                  key={val || index}
                  value={val}
                  className="dark:bg-gray-900"
                >
                  {display}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            type={type}
            {...register(name)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
            {...rest}
          />
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
      )}
    </div>
  );
}
