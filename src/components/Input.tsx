import { classNames } from "../utils/classNames";
interface IInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: string;
}
export const Input: React.FC<IInputProps> = ({ error, ...inputProps }) => {
  return (
    <div className="w-full space-y-1">
      <input
        className={classNames(
          !error ? "border-slate-400" : "border-red-600",
          "px-2 py-1 border border-slate-400 rounded-md w-full"
        )}
        {...inputProps}
      />
      {!!error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};
