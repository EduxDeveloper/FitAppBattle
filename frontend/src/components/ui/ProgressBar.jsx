import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ProgressBar = ({ progress, label, value, colorClass = "bg-accent-red" }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-xs font-semibold text-gray-400">{value}</span>
      </div>
      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={twMerge(
            clsx("h-full rounded-full transition-all duration-1000", colorClass)
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
