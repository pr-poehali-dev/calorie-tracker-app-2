import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export interface PantryItem {
  id: number;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface PantryData {
  breakfast: PantryItem[];
  lunch: PantryItem[];
  dinner: PantryItem[];
}

interface Props {
  initial?: PantryData;
  onSave: (data: PantryData) => void;
  onBack: () => void;
}

type MealKey = 'breakfast' | 'lunch' | 'dinner';

const MEAL_META: { key: MealKey; label: string; icon: string; color: string; hint: string }[] = [
  { key: 'breakfast', label: 'Завтрак', icon: 'Sunrise', color: 'text-honey', hint: 'Лёгкий старт — каши, яйца, творог' },
  { key: 'lunch', label: 'Обед', icon: 'Sun', color: 'text-clay', hint: 'Главный приём — суп, мясо, гарнир' },
  { key: 'dinner', label: 'Ужин', icon: 'Moon', color: 'text-sage', hint: 'Сытно, но не тяжело — рыба, овощи' },
];

const SUGGESTIONS: Record<MealKey, { name: string; kcal: number; protein: number; fat: number; carbs: number; icon: string }[]> = {
  breakfast: [
    { name: 'Овсянка', kcal: 150, protein: 5, fat: 3, carbs: 27, icon: '🌾' },
    { name: 'Яйца варёные 2шт', kcal: 156, protein: 13, fat: 11, carbs: 1, icon: '🥚' },
    { name: 'Творог 150г', kcal: 170, protein: 24, fat: 5, carbs: 6, icon: '🫙' },
    { name: 'Тост с маслом', kcal: 145, protein: 3, fat: 9, carbs: 14, icon: '🍞' },
    { name: 'Греческий йогурт', kcal: 100, protein: 10, fat: 3, carbs: 7, icon: '🥣' },
    { name: 'Банан', kcal: 90, protein: 1, fat: 0, carbs: 23, icon: '🍌' },
  ],
  lunch: [
    { name: 'Куриная грудка 150г', kcal: 248, protein: 46, fat: 5, carbs: 0, icon: '🍗' },
    { name: 'Гречка 150г', kcal: 165, protein: 6, fat: 2, carbs: 31, icon: '🌰' },
    { name: 'Борщ', kcal: 180, protein: 8, fat: 6, carbs: 22, icon: '🍲' },
    { name: 'Рис 150г', kcal: 195, protein: 4, fat: 1, carbs: 43, icon: '🍚' },
    { name: 'Салат с овощами', kcal: 80, protein: 2, fat: 4, carbs: 8, icon: '🥗' },
    { name: 'Суп куриный', kcal: 120, protein: 10, fat: 4, carbs: 12, icon: '🥣' },
  ],
  dinner: [
    { name: 'Рыба запечённая', kcal: 180, protein: 30, fat: 7, carbs: 0, icon: '🐟' },
    { name: 'Овощи на гриле', kcal: 90, protein: 3, fat: 3, carbs: 13, icon: '🥦' },
    { name: 'Творог с ягодами', kcal: 160, protein: 22, fat: 4, carbs: 10, icon: '🫐' },
    { name: 'Омлет 2 яйца', kcal: 185, protein: 14, fat: 14, carbs: 2, icon: '🍳' },
    { name: 'Кефир стакан', kcal: 80, protein: 7, fat: 3, carbs: 6, icon: '🥛' },
    { name: 'Тушёные овощи', kcal: 110, protein: 3, fat: 5, carbs: 14, icon: '🥕' },
  ],
};

function getMealAdvice(items: PantryItem[], mealKey: MealKey): { ok: boolean; text: string } {
  const total = items.reduce((s, i) => s + i.kcal, 0);
  const totalProtein = items.reduce((s, i) => s + i.protein, 0);
  if (items.length === 0) return { ok: false, text: 'Добавь хотя бы один продукт.' };

  if (mealKey === 'breakfast') {
    if (total > 600) return { ok: false, text: `Завтрак тяжеловат — ${total} ккал. Попробуй убрать один продукт, оставь в пределах 400–500 ккал.` };
    if (totalProtein < 10) return { ok: false, text: `Маловато белка. Добавь яйца или творог — будет сытнее и меньше тянуть на перекус.` };
    return { ok: true, text: `Отличный завтрак — ${total} ккал, ${totalProtein}г белка. Бодрое начало дня! 🌿` };
  }
  if (mealKey === 'lunch') {
    if (total < 300) return { ok: false, text: `Обед маловат — ${total} ккал. Добавь гарнир или суп, иначе будешь голоден к вечеру.` };
    if (total > 900) return { ok: false, text: `Плотный обед — ${total} ккал. Можно заменить часть гарнира на овощной салат — сытнее, но легче.` };
    return { ok: true, text: `Хороший обед — ${total} ккал. Сбалансированно и сытно. 👍` };
  }
  if (mealKey === 'dinner') {
    if (total > 700) return { ok: false, text: `Ужин тяжёлый — ${total} ккал перед сном. Замени что-нибудь на овощи или кефир.` };
    const hasCarbs = items.some((i) => i.carbs > 20);
    if (hasCarbs && total > 500) return { ok: false, text: `Много углеводов на ужин. Попробуй рыбу с овощами — меньше калорий, лучше качество сна.` };
    return { ok: true, text: `Лёгкий и правильный ужин — ${total} ккал. Организм скажет спасибо! 🌙` };
  }
  return { ok: true, text: '' };
}

function getPantryAdvice(data: PantryData): string {
  const advices: string[] = [];
  const b = getMealAdvice(data.breakfast, 'breakfast');
  const l = getMealAdvice(data.lunch, 'lunch');
  const d = getMealAdvice(data.dinner, 'dinner');
  if (!b.ok) advices.push(`Завтрак: ${b.text}`);
  if (!l.ok) advices.push(`Обед: ${l.text}`);
  if (!d.ok) advices.push(`Ужин: ${d.text}`);
  const total =
    [...data.breakfast, ...data.lunch, ...data.dinner].reduce((s, i) => s + i.kcal, 0);
  if (advices.length === 0) return `Кладовая настроена отлично! Сумма трёх приёмов — ${total} ккал. Рацион выглядит сбалансированно. 🌿`;
  return advices.join(' ');
}

const empty = (): PantryData => ({ breakfast: [], lunch: [], dinner: [] });

const Pantry = ({ initial, onSave, onBack }: Props) => {
  const [phase, setPhase] = useState<'setup' | 'summary'>(initial ? 'summary' : 'setup');
  const [activeMeal, setActiveMeal] = useState<MealKey>('breakfast');
  const [data, setData] = useState<PantryData>(initial ?? empty());
  const [customText, setCustomText] = useState('');

  const current = data[activeMeal];

  const toggle = (s: (typeof SUGGESTIONS)[MealKey][0]) => {
    const exists = current.find((i) => i.name === s.name);
    if (exists) {
      setData((d) => ({ ...d, [activeMeal]: d[activeMeal].filter((i) => i.name !== s.name) }));
    } else {
      setData((d) => ({
        ...d,
        [activeMeal]: [...d[activeMeal], { id: Date.now(), ...s }],
      }));
    }
  };

  const addCustom = () => {
    if (!customText.trim()) return;
    const guess = Math.round(200 + customText.length * 5);
    setData((d) => ({
      ...d,
      [activeMeal]: [
        ...d[activeMeal],
        { id: Date.now(), name: customText, kcal: guess, protein: Math.round(guess * 0.08), fat: Math.round(guess * 0.03), carbs: Math.round(guess * 0.12) },
      ],
    }));
    setCustomText('');
  };

  const removeItem = (mealKey: MealKey, id: number) => {
    setData((d) => ({ ...d, [mealKey]: d[mealKey].filter((i) => i.id !== id) }));
  };

  const advice = getMealAdvice(current, activeMeal);

  if (phase === 'summary') {
    const pantryAdvice = getPantryAdvice(data);
    return (
      <div className="min-h-screen grain pb-12">
        <header className="max-w-2xl mx-auto px-4 pt-8 flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-sage transition-colors">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <h1 className="font-display text-2xl font-semibold">Моя кладовая</h1>
        </header>

        <main className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
          <div className={`rounded-3xl p-5 border animate-rise ${pantryAdvice.includes('отлично') || pantryAdvice.includes('✓') ? 'bg-sage/10 border-sage/25' : 'bg-honey/15 border-honey/30'}`}>
            <div className="flex gap-3 items-start">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${pantryAdvice.includes('отлично') ? 'bg-sage text-white' : 'bg-honey text-white'}`}>
                <Icon name={pantryAdvice.includes('отлично') ? 'Sparkles' : 'Lightbulb'} size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-0.5">Общий совет по рациону</h3>
                <p className="text-sm text-muted-foreground">{pantryAdvice}</p>
              </div>
            </div>
          </div>

          {MEAL_META.map((m) => {
            const items = data[m.key];
            const total = items.reduce((s, i) => s + i.kcal, 0);
            const adv = getMealAdvice(items, m.key);
            return (
              <div key={m.key} className="bg-card border border-border rounded-3xl p-5 animate-rise">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name={m.icon} size={18} className={m.color} />
                    <span className="font-medium">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{total} ккал</span>
                  </div>
                  <button
                    onClick={() => { setActiveMeal(m.key); setPhase('setup'); }}
                    className="text-xs text-sage hover:underline"
                  >
                    Изменить
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Не заполнено</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {items.map((i) => (
                      <span key={i.id} className="bg-muted text-xs px-2.5 py-1 rounded-full">
                        {i.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className={`text-xs ${adv.ok ? 'text-sage' : 'text-clay'}`}>{adv.text}</p>
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setPhase('setup')}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Редактировать
            </Button>
            <Button
              onClick={() => onSave(data)}
              className="flex-1 rounded-xl bg-sage hover:bg-sage/90"
            >
              Использовать <Icon name="Check" size={16} className="ml-1" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen grain pb-12">
      <header className="max-w-2xl mx-auto px-4 pt-8 flex items-center gap-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-sage transition-colors">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-semibold">Настройка кладовой</h1>
          <p className="text-xs text-muted-foreground">Собери свои обычные приёмы пищи</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {MEAL_META.map((m) => {
            const count = data[m.key].length;
            return (
              <button
                key={m.key}
                onClick={() => setActiveMeal(m.key)}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  activeMeal === m.key ? 'border-sage bg-sage/10' : 'border-border'
                }`}
              >
                <Icon name={m.icon} size={22} className={`mx-auto mb-1 ${m.color}`} />
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  {count > 0 ? `${count} поз.` : 'пусто'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-3xl p-5 animate-rise" key={activeMeal}>
          <div className="flex items-center gap-2 mb-1">
            <Icon name={MEAL_META.find((m) => m.key === activeMeal)!.icon} size={18}
              className={MEAL_META.find((m) => m.key === activeMeal)!.color} />
            <h3 className="font-medium">{MEAL_META.find((m) => m.key === activeMeal)!.label}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {MEAL_META.find((m) => m.key === activeMeal)!.hint}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS[activeMeal].map((s) => {
              const selected = !!current.find((i) => i.name === s.name);
              return (
                <button
                  key={s.name}
                  onClick={() => toggle(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm ${
                    selected
                      ? 'border-sage bg-sage text-white'
                      : 'border-border text-foreground hover:border-sage/50'
                  }`}
                >
                  <span>{s.icon}</span>
                  {s.name}
                  <span className="text-[10px] opacity-70">{s.kcal}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <Input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="Например: бутерброд с маслом и сыром"
              className="rounded-xl"
            />
            <Button onClick={addCustom} className="rounded-xl bg-sage hover:bg-sage/90 shrink-0">
              <Icon name="Plus" size={18} />
            </Button>
          </div>

          {current.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {current.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2 group">
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.kcal} ккал</span>
                  </div>
                  <button
                    onClick={() => removeItem(activeMeal, item.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {current.length > 0 && (
            <div className={`rounded-2xl p-3 flex gap-2 items-start ${advice.ok ? 'bg-sage/10' : 'bg-honey/15'}`}>
              <Icon name={advice.ok ? 'Leaf' : 'Lightbulb'} size={16}
                className={advice.ok ? 'text-sage mt-0.5' : 'text-clay mt-0.5'} />
              <p className="text-xs leading-relaxed">{advice.text}</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => setPhase('summary')}
          className="w-full rounded-xl bg-sage hover:bg-sage/90 h-12"
        >
          Посмотреть итог кладовой <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </main>
    </div>
  );
};

export default Pantry;
