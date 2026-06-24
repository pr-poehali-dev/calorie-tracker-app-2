import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Props {
  onClose: () => void;
}

const STEPS = [
  {
    icon: 'Sprout',
    color: 'bg-sage text-white',
    title: 'Добро пожаловать в Зёрна',
    desc: 'Это спокойный трекер питания. Он помогает контролировать калории, следить за белками и жирами — без стресса и сложностей.',
    tip: 'Всё приложение умещается в три простых шага. Давай разберём каждый.',
  },
  {
    icon: 'CircleGauge',
    color: 'bg-clay text-white',
    title: 'Главный экран — твой день',
    desc: 'Кольцо в центре показывает, сколько калорий ты уже съел и сколько ещё осталось до нормы.',
    tip: 'Зелёное кольцо — ты в норме. Красное — небольшой перебор, ничего критичного. Шкалы под кольцом — белки, жиры и углеводы.',
    visual: (
      <div className="flex justify-center my-3">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--sage))" strokeWidth="14"
              strokeLinecap="round" strokeDasharray={502} strokeDashoffset={502 * 0.35} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-semibold text-sage">680</span>
            <span className="text-[10px] text-muted-foreground">осталось</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: 'PenLine',
    color: 'bg-honey text-white',
    title: 'Дневник — записывай еду',
    desc: 'Напиши, что съел, прямо в поле ввода — например «тарелка борща» или «бутерброд с сыром». Приложение сразу добавит запись в дневник.',
    tip: 'Выбери приём пищи (Завтрак / Обед / Ужин / Перекус) перед добавлением — так дневник будет аккуратным.',
  },
  {
    icon: 'Archive',
    color: 'bg-berry text-white',
    title: 'Кладовая — быстрый выбор',
    desc: 'Один раз настрой свой обычный завтрак, обед и ужин. После этого можно добавить весь приём пищи в дневник одним нажатием.',
    tip: 'Кнопка «Создать кладовую» появляется в разделе Кладовая. После настройки приложение подскажет, насколько твой рацион сбалансирован.',
  },
  {
    icon: 'Sparkles',
    color: 'bg-sage text-white',
    title: 'AI-помощник — твой советник',
    desc: 'В конце каждого экрана есть блок с советом. Он анализирует, что ты ел, и подсказывает — что добавить до нормы или как скомпенсировать перебор.',
    tip: 'Если перебрал с калориями — помощник предложит лёгкое упражнение. Без осуждения, только поддержка.',
  },
  {
    icon: 'CheckCircle2',
    color: 'bg-sage text-white',
    title: 'Всё готово!',
    desc: 'Ты знаешь всё необходимое. Начни с записи сегодняшнего завтрака — это займёт 20 секунд.',
    tip: 'Совет: пиши в приложение сразу после еды — так ничего не забудешь.',
  },
];

const Guide = ({ onClose }: Props) => {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-card rounded-3xl border border-border p-6 shadow-2xl animate-rise">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-400 ${i <= step ? 'bg-sage' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}>
          <Icon name={s.icon} size={24} />
        </div>

        <h2 className="font-display text-2xl font-semibold mb-2">{s.title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>

        {'visual' in s && s.visual}

        <div className="bg-muted/60 rounded-2xl px-4 py-3 mt-4 flex gap-2 items-start">
          <Icon name="Info" size={15} className="text-sage mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{s.tip}</p>
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-xl">
              <Icon name="ChevronLeft" size={16} />
            </Button>
          )}
          <Button
            onClick={isLast ? onClose : () => setStep((s) => s + 1)}
            className="flex-1 rounded-xl bg-sage hover:bg-sage/90"
          >
            {isLast ? (
              <>Начать пользоваться <Icon name="Sprout" size={16} className="ml-1" /></>
            ) : (
              <>Далее <Icon name="ChevronRight" size={16} className="ml-1" /></>
            )}
          </Button>
        </div>

        {!isLast && (
          <button onClick={onClose} className="w-full mt-3 text-xs text-muted-foreground hover:text-sage transition-colors">
            Пропустить путеводитель
          </button>
        )}
      </div>
    </div>
  );
};

export default Guide;
