import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { X, Save, Edit } from 'lucide-react';
import { useJournalProgram } from '../hooks/useJournalProgram';
import { useToast } from './ui/use-toast';
import type { JournalEntry } from '../types/journal';

interface EditJournalFormProps {
  journal: JournalEntry;
  onSubmit: (journal: JournalEntry) => void;
  onCancel: () => void;
}

export const EditJournalForm = ({ journal, onSubmit, onCancel }: EditJournalFormProps) => {
  const { updateJournalEntry } = useJournalProgram();
  const { toast } = useToast();
  const [title, setTitle] = useState(journal.title);
  const [message, setMessage] = useState(journal.message);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    try {
      await updateJournalEntry(title.trim(), message.trim());
      
      const updatedJournal: JournalEntry = {
        ...journal,
        title: title.trim(),
        message: message.trim(),
        updatedAt: new Date(),
      };

      onSubmit(updatedJournal);
    } catch (error) {
      console.error('Error updating journal:', error);
      toast({
        title: "Error",
        description: "Failed to update journal entry. Please try again.",
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
              <Edit className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Edit Journal Entry</h2>
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
              {isSubmitting ? 'Updating on Blockchain...' : 'Update Entry'}
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