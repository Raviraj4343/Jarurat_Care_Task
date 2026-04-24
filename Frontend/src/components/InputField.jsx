export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text"
}) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className={`field__input ${error ? "field__input--error" : ""}`}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
