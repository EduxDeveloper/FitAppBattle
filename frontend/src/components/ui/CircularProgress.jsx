const CircularProgress = ({ 
  value = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 10, 
  color = "text-accent-red",
  label,
  subLabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center flex-col" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          className="text-white/5"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`${color} transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {label && <span className="text-xl font-bold text-white">{label}</span>}
        {subLabel && <span className="text-xs text-gray-400 mt-1">{subLabel}</span>}
      </div>
    </div>
  );
};

export default CircularProgress;
