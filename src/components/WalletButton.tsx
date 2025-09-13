import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export const WalletButton = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet-button-wrapper">
      <style>{`
        .wallet-adapter-button {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: auto !important;
          font-family: inherit !important;
        }
        .wallet-adapter-button:not([disabled]):hover {
          background: transparent !important;
        }
      `}</style>
      
      <WalletMultiButton 
        style={{ 
          background: 'transparent',
          border: 'none',
          padding: 0,
          height: 'auto'
        }}
      >
        <Button variant="wallet" size="lg" className="w-full">
          <Wallet className="h-5 w-5" />
          {connected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </WalletMultiButton>
    </div>
  );
};