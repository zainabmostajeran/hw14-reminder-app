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
    <div className="w-full space-y-2">
      <input
        className={classNames(
          !error ? "border-slate-400" : "border-red-600",
          "px-2 py-1 border border-slate-400 rounded-md w-full bg-[#2a4263] text-white  outline outline-2 focus:outline-green-400"
        )}
        {...inputProps}
      />
      {!!error && <p className="text-sm font-bold bg-white/70 py-1 px-3 rounded-md w-fit text-red-500">{error}</p>}
    </div>
  );
};
