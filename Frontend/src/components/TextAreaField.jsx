export function TextAreaField({ id, label, value, onChange, placeholder, error }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea
        className={`field__input field__textarea ${error ? "field__input--error" : ""}`}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={6}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
