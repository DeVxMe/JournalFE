import { useWallet } from '@solana/wallet-adapter-react';
import { LandingPage } from '../components/LandingPage';
import { Dashboard } from '../components/Dashboard';

const Index = () => {
  const { connected } = useWallet();

  return connected ? <Dashboard /> : <LandingPage />;
};

export default Index;
