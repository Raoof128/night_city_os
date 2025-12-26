import { COLORS } from '../utils/theme';

const NetworkMapApp = () => {
  const nodes = [
    { id: 1, x: 20, y: 20, label: 'MAIN_FRAME' },
    { id: 2, x: 50, y: 30, label: 'PROXY_01' },
    { id: 3, x: 80, y: 20, label: 'ARASAKA_DB' },
    { id: 4, x: 35, y: 60, label: 'ICE_WALL' },
    { id: 5, x: 70, y: 70, label: 'GHOST_SERVER' },
  ];

  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 4 },
    { from: 4, to: 5 },
    { from: 2, to: 5 },
  ];

  return (
    <div className="h-full w-full p-6 relative overflow-hidden bg-black text-cyan-500 font-mono">
      <div className="absolute top-4 left-4 z-10 bg-black/80 border border-cyan-500 p-2 text-xs">
        <div>
          STATUS: <span className="text-[var(--color-blue)]">ACTIVE_TRACE</span>
        </div>
        <div>NODES: 5</div>
        <div>PING: 12ms</div>
      </div>

      <svg className="w-full h-full">
        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from);
          const toNode = nodes.find((n) => n.id === conn.to);
          return (
            <g key={i}>
              <line
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={COLORS.BLUE}
                strokeWidth="1"
                opacity="0.4"
              />
              <circle r="3" fill={COLORS.YELLOW}>
                <animateMotion
                  dur={`${2 + i}s`}
                  repeatCount="indefinite"
                  path={`M ${fromNode.x * 8} ${fromNode.y * 5} L ${toNode.x * 8} ${toNode.y * 5}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur={`${2 + i}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="6"
              fill="black"
              stroke={COLORS.RED}
              strokeWidth="2"
              className="cursor-pointer hover:fill-red-900"
            />
            <text
              x={`${node.x}%`}
              y={`${node.y + 5}%`}
              textAnchor="middle"
              fill={COLORS.YELLOW}
              fontSize="10"
              className="font-bold tracking-widest"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default NetworkMapApp;
