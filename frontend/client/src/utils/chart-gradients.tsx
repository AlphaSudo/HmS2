export function ChartGradients() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* Area chart gradients */}
        <linearGradient id="chartPurpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9747FF" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#9747FF" stopOpacity={0} />
        </linearGradient>
        
        <linearGradient id="chartOrangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF5757" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#FF5757" stopOpacity={0} />
        </linearGradient>
        
        <linearGradient id="chartBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3DB9FF" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#3DB9FF" stopOpacity={0} />
        </linearGradient>
        
        {/* Line chart gradients */}
        <linearGradient id="blueLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3DB9FF" />
          <stop offset="100%" stopColor="#0A004A" />
        </linearGradient>
        
        <linearGradient id="purpleLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF57E6" />
          <stop offset="100%" stopColor="#9747FF" />
        </linearGradient>
        
        {/* Bar chart gradients */}
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3DB9FF" />
          <stop offset="100%" stopColor="#0A004A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
