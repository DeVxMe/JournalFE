import { motion } from 'framer-motion';
import { WalletButton } from './WalletButton';
import { Book, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center p-6 lg:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Book className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Solana Journal</span>
          </div>
          
          <WalletButton />
        </motion.header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 lg:px-8 pt-16 lg:pt-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Your thoughts,{' '}
                <span className="text-gradient">
                  forever on-chain
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                A decentralized journaling platform built on Solana. 
                Write, store, and own your memories with complete sovereignty.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button variant="hero" size="xl">
                <Sparkles className="h-5 w-5" />
                Start Writing
              </Button>
              <Button variant="glass" size="xl">
                Learn More
              </Button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid md:grid-cols-3 gap-8 mt-24"
            >
              <div className="glass rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Truly Decentralized</h3>
                <p className="text-text-secondary leading-relaxed">
                  Your journal entries are stored on Solana blockchain, ensuring permanent access and true ownership.
                </p>
              </div>

              <div className="glass rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
                <p className="text-text-secondary leading-relaxed">
                  Built on Solana's high-performance blockchain for instant writing and seamless experience.
                </p>
              </div>

              <div className="glass rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Beautiful Writing</h3>
                <p className="text-text-secondary leading-relaxed">
                  Clean, distraction-free interface designed for the perfect writing experience.
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32 pb-8 text-center text-text-muted"
        >
          <p>Built with ❤️ on Solana</p>
        </motion.footer>
      </div>
    </div>
  );
};