

const Input = ({ icon, className = "", ...props }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {icon ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          {icon}
        </div>
      ) : null}
      <input
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          icon ? "pl-10" : ""
        }`}
        {...props}
      />
    </div>
  );
};

export default Input;
