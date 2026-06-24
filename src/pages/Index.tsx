import { useState } from 'react';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import type { Profile, Targets } from '@/lib/nutrition';

const Index = () => {
  const [data, setData] = useState<{ profile: Profile; targets: Targets } | null>(null);

  if (!data) {
    return (
      <Onboarding onComplete={(profile, targets) => setData({ profile, targets })} />
    );
  }

  return <Dashboard targets={data.targets} onReset={() => setData(null)} />;
};

export default Index;
