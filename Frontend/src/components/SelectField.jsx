export function SelectField({ id, label, value, onChange, options, error }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select
        className={`field__input ${error ? "field__input--error" : ""}`}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
