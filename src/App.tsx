import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Save, Activity, Scale, Ruler, Calendar, Clock, Utensils,
  TrendingUp, PlusCircle, BookOpen, ChevronRight, Target,Zap
} from 'lucide-react';
const App = () => {
  // Estado principal de la aplicación
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntries] = useState([]);
 
  // Estado para el formulario
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [intensity, setIntensity] = useState('Moderado');
  const [tomorrowEvent, setTomorrowEvent] = useState('Entrenamiento Regular');

  // Cargar datos al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('giancarloTrackerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Migración automática: Si hay datos antiguos guardados en Kg, los pasamos a Lbs
      const migratedData = parsedData.map(item => {
        if(item.weightKg && !item.weightLbs) {
          return { ...item, weightLbs: parseFloat((item.weightKg * 2.20462).toFixed(1)) };
        }
        return item;
      });
      setEntries(migratedData);
    } else {
      // Datos de ejemplo para que no esté vacío inicialmente
      const dummyData = [
        { id: 1, date: '2023-10-20T14:30:00', weightLbs: 122.4, heightM: 1.65, intensity: 'Fuerte', tomorrowEvent: 'Entrenamiento Regular' },
        { id: 2, date: '2023-10-22T16:45:00', weightLbs: 121.7, heightM: 1.65, intensity: 'Moderado', tomorrowEvent: 'Partido Importante' },
        { id: 3, date: '2023-10-24T08:15:00', weightLbs: 121.3, heightM: 1.66, intensity: 'Ligero', tomorrowEvent: 'Visoria' },
      ];
      setEntries(dummyData);
    }
  }, []);

  // Guardar datos cada vez que cambien
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('giancarloTrackerData', JSON.stringify(entries));
    }
  }, [entries]);

  const lbsToKg = (lbs) => (lbs / 2.20462).toFixed(2);
  const mToFt = (m) => {
    const totalInches = m * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!weight || !height) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      weightLbs: parseFloat(weight),
      heightM: parseFloat(height),
      intensity,
      tomorrowEvent
    };

    setEntries([newEntry, ...entries]);
    setWeight('');
    setActiveTab('dashboard'); // Volver al inicio tras guardar
  };

  const getRecommendations = () => {
    if (entries.length === 0) return null;
    const latest = entries[0];
    
    let advice = {
      meals: [],
      tips: [],
      exercises: []
    };

    // Lógica para comidas basada en el día de hoy y mañana
    if (latest.intensity === 'Fuerte') {
      advice.meals.push("Cena de hoy: Alta en proteínas (Pollo/Pescado) y carbohidratos complejos (Quinoa/Camote) para recuperar glucógeno muscular tras el esfuerzo fuerte.");
      advice.tips.push("Hidratación extra: Beber al menos 500ml de agua con electrolitos antes de dormir.");
      advice.exercises.push("Ejercicios de hoy en casa: Estiramientos pasivos (Yoga ligero) y uso de Foam Roller en piernas por 15 mins.");
    } else {
      advice.meals.push("Cena de hoy: Balanceada, porción moderada de carbohidratos, vegetales y proteína magra.");
      advice.tips.push("Buen momento para revisar videos tácticos o descansar la mente.");
      advice.exercises.push("Ejercicios en casa: Movilidad articular, core (planchas) y trabajo de técnica individual con balón estático.");
    }

    if (latest.tomorrowEvent === 'Partido Importante' || latest.tomorrowEvent === 'Visoria') {
      advice.meals.push(`Desayuno de mañana (${latest.tomorrowEvent}): Carga de carbohidratos de rápida absorción 2.5 horas antes (Avena con plátano y miel, pan tostado con mermelada). Evitar grasas pesadas.`);
      advice.tips.push("Descanso CRUCIAL: Asegurar 9 horas de sueño esta noche. La hormona del crecimiento actúa mejor en sueño profundo.");
      if (latest.tomorrowEvent === 'Visoria') {
         advice.tips.push("Mentalidad: Visualización positiva antes de dormir. En la visoria buscan actitud, esfuerzo en la recuperación del balón y comunicación, no solo técnica.");
      }
    } else {
      advice.meals.push("Desayuno de mañana: Huevos revueltos, pan integral y fruta variada.");
    }

    return advice;
  };

  const recommendations = getRecommendations();
  const latestEntry = entries.length > 0 ? entries[0] : null;

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Resumen Actual */}
      {latestEntry && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-4 opacity-90">Métricas Actuales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-200 mb-1">
                <Scale size={18} /> <span className="text-sm">Peso</span>
              </div>
              <div className="text-2xl font-bold">{latestEntry.weightLbs} lbs</div>
              <div className="text-sm text-blue-200">{lbsToKg(latestEntry.weightLbs)} kg</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-200 mb-1">
                <Ruler size={18} /> <span className="text-sm">Altura</span>
              </div>
              <div className="text-2xl font-bold">{latestEntry.heightM} m</div>
              <div className="text-sm text-blue-200">{mToFt(latestEntry.heightM)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500"/> Tendencia de Peso
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...entries].reverse()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9ca3af" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                labelFormatter={(val) => formatDate(val)}
                formatter={(val) => [`${val} lbs`, 'Peso']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="weightLbs" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimas entradas */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-500"/> Últimos Registros
        </h3>
        <div className="space-y-3">
          {entries.slice(0, 5).map((entry, index) => (
            <div key={entry.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{formatDate(entry.date)}</span>
                <span className="text-xs text-gray-500">{formatTime(entry.date)}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{entry.weightLbs} lbs</div>
                <div className="text-xs text-gray-500">
                  {entry.intensity.substring(0,3)} • {entry.tomorrowEvent.substring(0,7)}...
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No hay registros aún.</p>}
        </div>
      </div>
    </div>
  );

  const renderLogForm = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in pb-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Registro</h2>
      <form onSubmit={handleSaveEntry} className="space-y-5">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Peso (lbs)</label>
            <input 
              type="number" step="0.1" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej. 130.5"
            />
            {weight && <p className="text-xs text-blue-600 font-medium">{lbsToKg(weight)} kg</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Altura (metros)</label>
            <input 
              type="number" step="0.01" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder="Ej. 1.70"
            />
            {height && <p className="text-xs text-blue-600 font-medium">{mToFt(height)}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Intensidad del Entrenamiento (Hoy)</label>
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={intensity} onChange={(e) => setIntensity(e.target.value)}
          >
            <option value="Ligero">🟢 Ligero (Recuperación / Caminata)</option>
            <option value="Moderado">🟡 Moderado (Entrenamiento Táctico)</option>
            <option value="Fuerte">🔴 Fuerte (Partido / Físico Intenso)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Evento de Mañana</label>
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={tomorrowEvent} onChange={(e) => setTomorrowEvent(e.target.value)}
          >
            <option value="Entrenamiento Regular">Entrenamiento Regular</option>
            <option value="Partido Importante">⚽ Partido Importante</option>
            <option value="Visoria">⭐ Visoria (Scouting)</option>
            <option value="Descanso">Descanso Activo</option>
          </select>
        </div>

        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
          <PlusCircle size={20} /> Guardar Datos
        </button>
      </form>
    </div>
  );

  const renderPlan = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Target size={24} /> Plan de Acción
        </h2>
        <p className="text-emerald-50 opacity-90">
          Basado en tu última actividad ({latestEntry?.intensity}) y tu evento de mañana ({latestEntry?.tomorrowEvent}).
        </p>
      </div>

      {!latestEntry ? (
        <div className="text-center p-8 text-gray-500 bg-white rounded-2xl">
          Registra tus datos de hoy para ver tu plan personalizado.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
              <Utensils className="text-orange-500" /> Nutrición Recomendada
            </h3>
            <ul className="space-y-3">
              {recommendations.meals.map((meal, i) => (
                <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-orange-500 mt-1">•</span> {meal}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
              <Zap className="text-yellow-500" /> Tips de Recuperación y Mentalidad
            </h3>
            <ul className="space-y-3">
              {recommendations.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-yellow-500 mt-1">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
              <Activity className="text-blue-500" /> Ejercicios en Casa
            </h3>
            <ul className="space-y-3">
              {recommendations.exercises.map((ex, i) => (
                <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="text-blue-500 mt-1">•</span> {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecipes = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="bg-orange-500 p-6 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <BookOpen size={24} /> Recetario de Atleta
        </h2>
        <p className="text-orange-50 opacity-90">
          Menús sugeridos para el alto rendimiento de jóvenes prospectos.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { title: 'Batido de Súper Recuperación', time: '5 min', desc: '1 plátano, 1 scoop de proteína (o yogur griego), espinaca, leche de almendras y crema de cacahuate. Ideal post-partido.' },
          { title: 'Pasta Integral con Pavo Magro', time: '20 min', desc: 'Carbohidratos complejos para cargar energía. Carne de pavo molida con salsa de tomate natural. Cenar la noche antes del partido.' },
          { title: 'Avena Nocturna (Overnight Oats)', time: '10 min', desc: 'Avena, chía, leche, miel y moras. Dejar en el refri toda la noche. Desayuno perfecto 3 horas antes de la visoria.' },
          { title: 'Snack de Medio Tiempo', time: '2 min', desc: 'Gomitas deportivas, medio plátano o dátiles. Energía inmediata sin pesadez estomacal.' },
        ].map((recipe, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group">
            <div>
              <h4 className="font-bold text-gray-800">{recipe.title}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2 pr-4">{recipe.desc}</p>
              <span className="inline-block mt-2 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                ⏱ {recipe.time}
              </span>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-orange-500 transition-colors" />
          </div>
        ))}
        
        {/* Placeholder para la integración de los libros */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-6 rounded-2xl text-center mt-4">
          <BookOpen className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-600 text-sm font-medium">
            Aquí se integrarán las recetas específicas de tus libros de Notebook LM próximamente.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb- bezpieczna">
      {/* Header Fijo */}
      <header className="bg-white sticky top-0 z-10 shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Giancarlo Tracker
          </h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Alto Rendimiento</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <Activity size={24} />
        </div>
      </header>

      {/* Contenido Principal con padding para móvil */}
      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'log' && <FormularioRegistro />}
        {activeTab === 'plan' && renderPlan()}
        {activeTab === 'recipes' && renderRecipes()}
      </main>

      {/* Navegación Inferior (Estilo App Nativa) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-md mx-auto flex justify-around p-2">
          {[
            { id: 'dashboard', icon: TrendingUp, label: 'Resumen' },
            { id: 'log', icon: PlusCircle, label: 'Registrar' },
            { id: 'plan', icon: Target, label: 'El Plan' },
            { id: 'recipes', icon: Utensils, label: 'Recetas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'stroke-2' : 'stroke-[1.5]'} />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      {/* CSS extra para asegurar que las animaciones y el safe-area de iOS funcionen */}
      <style dangerouslySetInnerHTML={{__html: `
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};
export function FormularioRegistro() {
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: '',
    peso: '',
    tipoSesion: 'Academia', // Nuevo campo para diferenciar la actividad
    intensidad: 'Moderado',
    notasEntrenamiento: ''
  });

  const manejarCambio = (e: any) => {
    setNuevoRegistro({
      ...nuevoRegistro,
      [e.target.name]: e.target.value
    });
  };

  const guardarDatos = (e: any) => {
    e.preventDefault();
    console.log("Sesión lista:", nuevoRegistro);
    alert(`¡Entrenamiento de ${nuevoRegistro.tipoSesion} guardado con éxito!`);
    
    // Truco: Al guardar, reiniciamos las notas y la sesión, pero DEJAMOS la fecha y el peso 
    // por si Osmar necesita registrar otra sesión el mismo día.
    setNuevoRegistro({ 
      ...nuevoRegistro, 
      tipoSesion: 'Academia', 
      intensidad: 'Moderado', 
      notasEntrenamiento: '' 
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm mt-6 border-2 border-blue-100">
      <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
        <PlusCircle size={24} />
        Registrar Sesión
      </h2>
      
      <form onSubmit={guardarDatos} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
            <input 
              type="date" 
              name="fecha"
              value={nuevoRegistro.fecha}
              onChange={manejarCambio}
              className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Peso (lbs)</label>
            <input 
              type="number" 
              step="0.1"
              name="peso"
              value={nuevoRegistro.peso}
              onChange={manejarCambio}
              placeholder="Ej: 122.4"
              className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* NUEVO: Selector de Tipo de Actividad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Actividad</label>
          <select 
            name="tipoSesion"
            value={nuevoRegistro.tipoSesion}
            onChange={manejarCambio}
            className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Escuela">🏫 Entrenamiento Escolar</option>
            <option value="Academia">⚽ Entrenamiento Academia</option>
            <option value="Partido">🏆 Partido Oficial</option>
            <option value="Fisico">🏃 Trabajo Físico / Extra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Intensidad</label>
          <select 
            name="intensidad"
            value={nuevoRegistro.intensidad}
            onChange={manejarCambio}
            className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Ligero">🟢 Ligero (Recuperación / Soltura)</option>
            <option value="Moderado">🟡 Moderado (Táctico / Práctica Regular)</option>
            <option value="Fuerte">🔴 Fuerte (Partido Intenso / Físico Pesado)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sensación / Notas</label>
          <textarea 
            name="notasEntrenamiento"
            value={nuevoRegistro.notasEntrenamiento}
            onChange={manejarCambio}
            placeholder="Ej: Mucha carga en los gemelos, buen rendimiento en pases..."
            className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          Guardar Sesión
        </button>
      </form>
    </div>
  );
}

  export default App;