import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  ACTIVITY_LEVELS,
  GOALS,
  calcTargets,
  type Profile,
  type Gender,
  type Goal,
  type ActivityKey,
  type Targets,
} from '@/lib/nutrition';

interface Props {
  onComplete: (profile: Profile, targets: Targets) => void;
}

const STEPS = ['Тело', 'Активность', 'Цель', 'План'];

const Onboarding = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({
    weight: 70,
    height: 175,
    birthDate: '1995-01-01',
    gender: 'male',
    activity: 'light',
    goal: 'lose',
    pace: 0.5,
  });

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));
  const targets = calcTargets(p);
  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen grain flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-sage mb-2">
            <Icon name="Sprout" size={28} />
            <span className="font-display text-3xl font-semibold">Зёрна</span>
          </div>
          <p className="text-muted-foreground text-sm">Соберём твой персональный план питания</p>
        </div>

        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-sage' : 'bg-border'
                }`}
              />
              <span
                className={`text-[11px] mt-1.5 block text-center ${
                  i <= step ? 'text-sage font-medium' : 'text-muted-foreground'
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm" key={step}>
          <div className="animate-rise">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl">Расскажи о себе</h2>
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => set('gender', g)}
                      className={`rounded-2xl border-2 py-3 transition-all ${
                        p.gender === g
                          ? 'border-sage bg-sage/10 text-sage font-medium'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      <Icon name={g === 'male' ? 'Mars' : 'Venus'} size={20} className="mx-auto mb-1" />
                      {g === 'male' ? 'Мужчина' : 'Женщина'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Вес, кг</Label>
                    <Input
                      type="number"
                      value={p.weight}
                      onChange={(e) => set('weight', +e.target.value)}
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Рост, см</Label>
                    <Input
                      type="number"
                      value={p.height}
                      onChange={(e) => set('height', +e.target.value)}
                      className="rounded-xl mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Дата рождения</Label>
                  <Input
                    type="date"
                    value={p.birthDate}
                    onChange={(e) => set('birthDate', e.target.value)}
                    className="rounded-xl mt-1"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <h2 className="font-display text-2xl mb-3">Насколько ты активен?</h2>
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => set('activity', a.key as ActivityKey)}
                    className={`w-full text-left rounded-2xl border-2 p-3.5 transition-all ${
                      p.activity === a.key ? 'border-sage bg-sage/10' : 'border-border'
                    }`}
                  >
                    <div className="font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h2 className="font-display text-2xl mb-3">Какая твоя цель?</h2>
                {GOALS.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => set('goal', g.key as Goal)}
                    className={`w-full text-left rounded-2xl border-2 p-3.5 flex items-center gap-3 transition-all ${
                      p.goal === g.key ? 'border-sage bg-sage/10' : 'border-border'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        p.goal === g.key ? 'bg-sage text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon name={g.icon} size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{g.label}</div>
                      <div className="text-xs text-muted-foreground">{g.desc}</div>
                    </div>
                  </button>
                ))}
                {p.goal === 'lose' && (
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground">Темп: {p.pace} кг в неделю</Label>
                    <input
                      type="range"
                      min={0.25}
                      max={1}
                      step={0.25}
                      value={p.pace}
                      onChange={(e) => set('pace', +e.target.value)}
                      className="w-full mt-2 accent-[hsl(var(--sage))]"
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Мягко</span>
                      <span>Быстро</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl">Твой план готов</h2>
                <div className="bg-sage/10 rounded-2xl p-5 text-center">
                  <div className="text-xs text-sage uppercase tracking-wide">Дневная цель</div>
                  <div className="font-display text-5xl font-semibold text-sage my-1">
                    {targets.calories}
                  </div>
                  <div className="text-sm text-muted-foreground">ккал в день</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { l: 'Белки', v: targets.protein, c: 'text-clay' },
                    { l: 'Жиры', v: targets.fat, c: 'text-honey' },
                    { l: 'Углеводы', v: targets.carbs, c: 'text-sage' },
                  ].map((m) => (
                    <div key={m.l} className="bg-muted/60 rounded-xl py-3">
                      <div className={`font-semibold text-lg ${m.c}`}>{m.v}г</div>
                      <div className="text-[11px] text-muted-foreground">{m.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>BMR: {targets.bmr} ккал</span>
                  <span>TDEE: {targets.tdee} ккал</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={back} className="rounded-xl flex-1">
              Назад
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={next} className="rounded-xl flex-1 bg-sage hover:bg-sage/90">
              Далее
            </Button>
          ) : (
            <Button
              onClick={() => onComplete(p, targets)}
              className="rounded-xl flex-1 bg-sage hover:bg-sage/90"
            >
              Начать <Icon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
