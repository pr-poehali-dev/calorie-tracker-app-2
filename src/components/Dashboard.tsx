import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import type { Targets } from '@/lib/nutrition';

interface Entry {
  id: number;
  name: string;
  meal: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Props {
  targets: Targets;
  onReset: () => void;
}

const SAMPLE: Entry[] = [
  { id: 1, name: 'Овсянка с ягодами', meal: 'Завтрак', kcal: 320, protein: 12, fat: 8, carbs: 52 },
  { id: 2, name: 'Гречка с курицей', meal: 'Обед', kcal: 480, protein: 38, fat: 12, carbs: 55 },
  { id: 3, name: 'Греческий йогурт', meal: 'Перекус', kcal: 140, protein: 15, fat: 4, carbs: 9 },
];

const QUICK = [
  { name: 'Протеиновый коктейль', kcal: 180, protein: 30, fat: 3, carbs: 8, icon: 'Milk' },
  { name: 'Куриная грудка 150г', kcal: 248, protein: 46, fat: 5, carbs: 0, icon: 'Drumstick' },
  { name: 'Авокадо тост', kcal: 290, protein: 8, fat: 18, carbs: 26, icon: 'Sandwich' },
];

const MEALS = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];
const mealIcon: Record<string, string> = {
  Завтрак: 'Sunrise',
  Обед: 'Sun',
  Ужин: 'Moon',
  Перекус: 'Cookie',
};

const Ring = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.min(value / max, 1);
  const r = 80;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 -rotate-90">
      <circle cx="100" cy="100" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="hsl(var(--sage))"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
};

const Dashboard = ({ targets, onReset }: Props) => {
  const [entries, setEntries] = useState<Entry[]>(SAMPLE);
  const [text, setText] = useState('');
  const [meal, setMeal] = useState('Обед');

  const consumed = entries.reduce((s, e) => s + e.kcal, 0);
  const protein = entries.reduce((s, e) => s + e.protein, 0);
  const fat = entries.reduce((s, e) => s + e.fat, 0);
  const carbs = entries.reduce((s, e) => s + e.carbs, 0);
  const left = targets.calories - consumed;

  const addText = () => {
    if (!text.trim()) return;
    const guess = Math.round(250 + text.length * 6);
    setEntries((e) => [
      ...e,
      {
        id: Date.now(),
        name: text,
        meal,
        kcal: guess,
        protein: Math.round(guess * 0.07),
        fat: Math.round(guess * 0.03),
        carbs: Math.round(guess * 0.1),
      },
    ]);
    setText('');
  };

  const addQuick = (q: (typeof QUICK)[0]) =>
    setEntries((e) => [...e, { id: Date.now(), meal, ...q }]);

  const remove = (id: number) => setEntries((e) => e.filter((x) => x.id !== id));

  const macros = [
    { l: 'Белки', v: protein, max: targets.protein, color: 'hsl(var(--clay))' },
    { l: 'Жиры', v: fat, max: targets.fat, color: 'hsl(var(--honey))' },
    { l: 'Углеводы', v: carbs, max: targets.carbs, color: 'hsl(var(--sage))' },
  ];

  return (
    <div className="min-h-screen grain pb-12">
      <header className="max-w-2xl mx-auto px-4 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sage">
          <Icon name="Sprout" size={26} />
          <span className="font-display text-2xl font-semibold">Зёрна</span>
        </div>
        <button
          onClick={onReset}
          className="text-muted-foreground hover:text-sage transition-colors"
          title="Настройки профиля"
        >
          <Icon name="Settings" size={20} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-5">
        <p className="text-muted-foreground text-sm animate-fade-in">
          {new Date().toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        <section className="bg-card rounded-3xl border border-border p-6 animate-rise">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <Ring value={consumed} max={targets.calories} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-semibold text-sage">
                  {left > 0 ? left : 0}
                </span>
                <span className="text-xs text-muted-foreground">ккал осталось</span>
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Съедено</span>
                <span className="font-medium">
                  {consumed} / {targets.calories} ккал
                </span>
              </div>
              {macros.map((m) => (
                <div key={m.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.l}</span>
                    <span className="font-medium">
                      {m.v} / {m.max}г
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((m.v / m.max) * 100, 100)}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card rounded-3xl border border-border p-5 animate-rise" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-2 mb-3 flex-wrap">
            {MEALS.map((m) => (
              <button
                key={m}
                onClick={() => setMeal(m)}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
                  meal === m ? 'bg-sage text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon name={mealIcon[m]} size={13} />
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addText()}
              placeholder="Напиши, что съел — например «тарелка борща»"
              className="rounded-xl"
            />
            <Button onClick={addText} className="rounded-xl bg-sage hover:bg-sage/90 shrink-0">
              <Icon name="Plus" size={18} />
            </Button>
          </div>
          <div className="flex gap-3 mt-3 text-muted-foreground">
            <button className="flex items-center gap-1 text-xs hover:text-sage transition-colors">
              <Icon name="Camera" size={15} /> Фото
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-sage transition-colors">
              <Icon name="ScanBarcode" size={15} /> Штрих-код
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-sage transition-colors">
              <Icon name="Search" size={15} /> Поиск
            </button>
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: '0.15s' }}>
          <h3 className="font-display text-xl mb-2 px-1">Кладовая</h3>
          <div className="grid grid-cols-3 gap-2">
            {QUICK.map((q) => (
              <button
                key={q.name}
                onClick={() => addQuick(q)}
                className="bg-card border border-border rounded-2xl p-3 text-left hover:border-sage hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-clay/15 text-clay flex items-center justify-center mb-2">
                  <Icon name={q.icon} size={18} />
                </div>
                <div className="text-xs font-medium leading-tight">{q.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{q.kcal} ккал</div>
              </button>
            ))}
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display text-xl mb-2 px-1">Дневник</h3>
          <div className="space-y-2">
            {entries.map((e) => (
              <div
                key={e.id}
                className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-sage/12 text-sage flex items-center justify-center shrink-0">
                  <Icon name={mealIcon[e.meal] ?? 'Utensils'} size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {e.meal} · Б{e.protein} Ж{e.fat} У{e.carbs}
                  </div>
                </div>
                <div className="text-sm font-medium text-sage shrink-0">{e.kcal}</div>
                <button
                  onClick={() => remove(e.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section
          className="bg-sage/10 border border-sage/20 rounded-3xl p-5 animate-rise"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage text-white flex items-center justify-center shrink-0">
              <Icon name="Sparkles" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-sage">AI-помощник</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {left > 0
                  ? `У тебя осталось ${left} ккал. Попробуй творог с орехами — добавит ${targets.protein - protein > 0 ? `${targets.protein - protein}г белка` : 'лёгкости'} до нормы.`
                  : 'Норма на сегодня достигнута. Отличная работа — так держать!'}
              </p>
              <Button variant="outline" size="sm" className="rounded-xl mt-3 border-sage/40 text-sage">
                Спросить совет <Icon name="MessageCircle" size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
