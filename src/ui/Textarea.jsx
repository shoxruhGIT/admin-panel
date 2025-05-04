const TextareaField = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium" htmlFor={label}>
        {label}
      </label>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextareaField;
