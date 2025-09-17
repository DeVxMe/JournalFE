import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { JournalList } from './JournalList';
import { CreateJournalForm } from './CreateJournalForm';
import { Button } from './ui/button';
import { Plus, Book, User, LogOut, Loader2 } from 'lucide-react';
import { WalletButton } from './WalletButton';
import { useJournalProgram } from '../hooks/useJournalProgram';
import { useToast } from './ui/use-toast';
import type { JournalEntry } from '../types/journal';

export const Dashboard = () => {
  const { connected, disconnect, publicKey } = useWallet();
  const { fetchJournalEntries, deleteJournalEntry } = useJournalProgram();
  const { toast } = useToast();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // If wallet is not connected, this component shouldn't render
  if (!connected || !publicKey) {
    return null;
  }

  useEffect(() => {
    loadJournals();
  }, [connected, publicKey]);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const entries = await fetchJournalEntries();
      setJournals(entries);
    } catch (error) {
      console.error('Error loading journals:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJournal = (journal: JournalEntry) => {
    setJournals(prev => [journal, ...prev]);
    setShowCreateForm(false);
    toast({
      title: "Success",
      description: "Journal entry created successfully",
    });
  };

  const handleDeleteJournal = async (title: string) => {
    try {
      await deleteJournalEntry(title);
      setJournals(prev => prev.filter(j => j.title !== title));
      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
    }
  };

  const handleUpdateJournal = (updatedJournal: JournalEntry) => {
    setJournals(prev => 
      prev.map(j => j.title === updatedJournal.title ? updatedJournal : j)
    );
    toast({
      title: "Success",
      description: "Journal entry updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-glass-border glass backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Book className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Solana Journal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <User className="h-4 w-4" />
              <span className="font-mono text-sm">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={disconnect}
              className="text-text-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Journals</h1>
              <p className="text-text-secondary">
                {loading 
                  ? "Loading your entries..." 
                  : journals.length === 0 
                    ? "Start your on-chain journaling journey" 
                    : `${journals.length} ${journals.length === 1 ? 'entry' : 'entries'} stored on Solana`
                }
              </p>
            </div>
            
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setShowCreateForm(true)}
              className="shadow-glow"
              disabled={loading}
            >
              <Plus className="h-5 w-5" />
              New Entry
            </Button>
          </div>

          {/* Create Form Modal/Overlay */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowCreateForm(false);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl"
              >
                <CreateJournalForm 
                  onSubmit={handleCreateJournal}
                  onCancel={() => setShowCreateForm(false)}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-text-secondary">Loading journal entries...</span>
            </div>
          )}

          {/* Journal List */}
          {!loading && (
            <JournalList 
              journals={journals}
              onDelete={handleDeleteJournal}
              onUpdate={handleUpdateJournal}
            />
          )}

          {/* Empty State */}
          {!loading && journals.length === 0 && !showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-card flex items-center justify-center mb-6 mx-auto shadow-card">
                <Book className="h-12 w-12 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Start your decentralized journaling journey. Your thoughts will be permanently stored on Solana blockchain.
              </p>
              <Button 
                variant="hero" 
                onClick={() => setShowCreateForm(true)}
                className="shadow-glow"
              >
                <Plus className="h-5 w-5" />
                Create Your First Entry
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};