export default function FormField({ label, type = "text", value, onChange, name, placeholder, error, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink2">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`focus-ring w-full rounded-lg border bg-paper/60 px-3.5 py-2.5 text-ink placeholder:text-ink2/50 ${
          error ? "border-red-700" : "border-line"
        }`}
      />
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  );
}
