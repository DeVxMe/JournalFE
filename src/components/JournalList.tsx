import { motion } from 'framer-motion';
import { JournalCard } from './JournalCard';
import type { JournalEntry } from '../types/journal';

interface JournalListProps {
  journals: JournalEntry[];
  onDelete: (title: string) => void;
  onUpdate: (journal: JournalEntry) => void;
}

export const JournalList = ({ journals, onDelete, onUpdate }: JournalListProps) => {
  if (journals.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journals.map((journal, index) => (
        <motion.div
          key={journal.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <JournalCard
            journal={journal}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </motion.div>
      ))}
    </div>
  );
};