export const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  id = "input-field",
  className="w-full px-4 py-3 bg-purple-900/50 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all",
  ...props
}) => {
  return (
    <input
        {...props}
        id={id}
        className={className}
    />
  );
};