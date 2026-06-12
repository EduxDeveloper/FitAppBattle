import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, ...props }) => {
  return (
    <div 
      className={twMerge(
        clsx("glass rounded-3xl p-6", className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
