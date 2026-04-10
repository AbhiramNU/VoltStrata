import React, { useEffect, useState } from 'react';

const DataVisualizer = () => {
    const [data, setData] = useState<any[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://voltstrata.onrender.com/visualize');
                const result = await response.json();

                if (Array.isArray(result)) {
                    setData(result);
                }
            } catch (err) {
                console.error("Viz failed", err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, []);

    // Placeholder if data isn't loaded yet
    const displayData = data.length > 0 ? data : Array.from({length: 24}).map((_, i) => ({ hour: i, val: 0.5 + Math.random() }));

    return (
        <div className="w-full flex justify-between items-end space-x-2 h-72 px-4 relative z-10 bg-white/[0.02] rounded-3xl border border-white/5">
            {displayData.map((item, i) => {
                const rawVal = Number(item.val) || 0;
                // Scale so 2.5kW is 100% height
                const height = Math.max(8, Math.min(100, (rawVal / 2.5) * 100)); 
                
                return (
                    <div 
                        key={i} 
                        className="flex-1 group relative h-full flex flex-col justify-end pb-8"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* The Actual Data Bar */}
                        <div 
                            className="w-full bg-gradient-to-t from-blue-600 via-blue-400 to-blue-200 rounded-lg cursor-crosshair transition-all duration-300 hover:brightness-125 relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                            style={{ height: `${height}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-0 group-hover:opacity-30 transition-opacity"></div>
                        </div>
                        
                        {/* Live Tooltip - Controlled by State to prevent multi-overlap */}
                        {hoveredIndex === i && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-in fade-in zoom-in-75 duration-200">
                                <div className="bg-blue-600 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center space-x-2 whitespace-nowrap border border-white/20">
                                    <span className="opacity-50 tracking-tighter">{item.hour.toString().padStart(2, '0')}h:</span>
                                    <span>{item.val.toFixed(2)}KW</span>
                                </div>
                                <div className="w-2 h-2 bg-blue-600 rotate-45 mx-auto -mt-[4px] border-r border-b border-white/10"></div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DataVisualizer;
