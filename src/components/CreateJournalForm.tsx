import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { X, Save, BookOpen } from 'lucide-react';
import { useJournalProgram } from '../hooks/useJournalProgram';
import { useToast } from './ui/use-toast';
import type { JournalEntry } from '../types/journal';

interface CreateJournalFormProps {
  onSubmit: (journal: JournalEntry) => void;
  onCancel: () => void;
}

export const CreateJournalForm = ({ onSubmit, onCancel }: CreateJournalFormProps) => {
  const { publicKey } = useWallet();
  const { createJournalEntry } = useJournalProgram();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !publicKey) return;

    setIsSubmitting(true);
    
    try {
      await createJournalEntry(title.trim(), message.trim());
      
      const journal: JournalEntry = {
        title: title.trim(),
        message: message.trim(),
        owner: publicKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSubmit(journal);
    } catch (error) {
      console.error('Error creating journal:', error);
      toast({
        title: "Error",
        description: "Failed to create journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass border-glass-border shadow-elegant">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">New Journal Entry</h2>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCancel}
            className="text-text-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
              className="bg-glass-bg border-glass-border focus:border-primary/50"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Your thoughts
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your journal entry here..."
              rows={8}
              className="bg-glass-bg border-glass-border focus:border-primary/50 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="hero"
              disabled={!title.trim() || !message.trim() || isSubmitting}
              className="flex-1 shadow-glow"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving to Blockchain...' : 'Save Entry'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </Card>
  );
};