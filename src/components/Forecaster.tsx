import React, { useState } from 'react';
import { Activity, Gauge, Zap, ChevronRight } from 'lucide-react';

const Forecaster = () => {
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [formData, setFormData] = useState({
        hour: 12,
        day_of_week: 0,
        month: 1,
        power_lag_1: 1.5
    });

    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            console.error("Prediction failed", error);
            alert("Backend not reachable. Start the backend_main.py first!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-1 rounded-[3rem] group max-w-4xl mx-auto mt-20">
            <div className="bg-slate-950/80 rounded-[2.9rem] p-12 relative overflow-hidden">
                {/* Decorative background pulse */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="flex items-center space-x-4 mb-12">
                    <div className="p-4 bg-blue-500/20 rounded-2xl">
                        <Gauge className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tighter text-hifi">NEURAL SIMULATOR</h3>
                        <p className="text-[10px] uppercase font-bold tracking-[.3em] text-slate-500">Real-time Inference Engine // RF_V2</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Target Hour (0-23)</label>
                            <input 
                                type="range" min="0" max="23" 
                                value={formData.hour}
                                onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between mt-2 text-[11px] font-bold tabular-nums text-blue-400">
                                <span>00:00</span>
                                <span>{formData.hour.toString().padStart(2, '0')}:00</span>
                                <span>23:00</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Month (1-12)</label>
                                <select 
                                    value={formData.month}
                                    onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
                                >
                                    {Array.from({length: 12}).map((_, i) => <option key={i} value={i+1}>{new Date(2026, i).toLocaleString('default', { month: 'short' })}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Day of Week</label>
                                <select 
                                    value={formData.day_of_week}
                                    onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
                                >
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => <option key={i} value={i}>{day}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Power Lag (Previous KW)</label>
                            <div className="relative">
                                <input 
                                    type="number" step="0.1"
                                    value={formData.power_lag_1}
                                    onChange={(e) => setFormData({...formData, power_lag_1: parseFloat(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black tabular-nums text-white focus:outline-none focus:border-blue-500/50"
                                />
                                <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700" />
                            </div>
                        </div>

                        <button 
                            onClick={handlePredict}
                            disabled={loading}
                            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center space-x-3"
                        >
                            {loading ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Initiate Forecasting</span>
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col justify-center items-center border-l border-white/5 pl-12">
                        {prediction ? (
                            <div className="text-center w-full animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500 mb-2">Predicted Consumption</div>
                                <div className="text-7xl font-black text-hifi tabular-nums mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                    {prediction.predicted_power} <span className="text-2xl text-blue-500">kW</span>
                                </div>
                                <div className={`inline-flex items-center px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${prediction.class_id === 1 ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                                    <span className="mr-2 h-2 w-2 rounded-full bg-current animate-pulse"></span>
                                    T-Class: {prediction.usage_class} Usage
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-30 select-none">
                                <Gauge className="w-20 h-20 mx-auto text-slate-600 mb-6 stroke-[1]" />
                                <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Awaiting Signal Input...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forecaster;
