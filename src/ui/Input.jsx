const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium" htmlFor="name">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md h-[40px] p-4"
        id={name}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputField


