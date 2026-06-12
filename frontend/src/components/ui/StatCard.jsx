import GlassCard from './GlassCard';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'accent-red' }) => {
  return (
    <GlassCard className="flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}/10 rounded-full blur-2xl group-hover:bg-${color}/20 transition-colors`}></div>
      
      <div className="flex items-center justify-between z-10">
        <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
        <div className={`w-8 h-8 rounded-lg bg-${color}/10 flex items-center justify-center text-${color}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="z-10">
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={trend === 'up' ? 'text-success' : 'text-accent-red'}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-gray-500 ml-1">vs last week</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default StatCard;
