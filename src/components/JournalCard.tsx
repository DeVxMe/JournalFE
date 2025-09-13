import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Calendar, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { EditJournalForm } from './EditJournalForm';
import type { JournalEntry } from '../types/journal';

interface JournalCardProps {
  journal: JournalEntry;
  onDelete: (title: string) => void;
  onUpdate: (journal: JournalEntry) => void;
}

// Function to get avatar from free API
const getAvatarUrl = (seed: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
};

export const JournalCard = ({ journal, onDelete, onUpdate }: JournalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(journal.title);
    setShowDeleteConfirm(false);
  };

  const handleUpdate = (updatedJournal: JournalEntry) => {
    onUpdate(updatedJournal);
    setIsEditing(false);
  };

  const avatarUrl = getAvatarUrl(journal.title);
  const truncatedMessage = journal.message.length > 150 
    ? journal.message.slice(0, 150) + '...' 
    : journal.message;

  if (isEditing) {
    return (
      <motion.div
        layout
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsEditing(false);
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <EditJournalForm
            journal={journal}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="glass border-glass-border shadow-card hover:shadow-elegant transition-smooth overflow-hidden group">
        <div className="p-6">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={`Avatar for ${journal.title}`}
                className="w-10 h-10 rounded-full bg-gradient-card shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{journal.title}</h3>
                {journal.createdAt && (
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <Calendar className="h-3 w-3" />
                    {journal.createdAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-smooth text-text-muted hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-glass-border">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-text-secondary leading-relaxed">
              {truncatedMessage}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-glass-border">
            <Badge variant="outline" className="text-xs">
              On-chain
            </Badge>
            
            {journal.message.length > 150 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary/80"
              >
                Read more
              </Button>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg"
          >
            <div className="glass rounded-xl p-6 text-center max-w-sm">
              <h4 className="font-semibold mb-2">Delete Journal Entry?</h4>
              <p className="text-text-secondary text-sm mb-4">
                This action cannot be undone. The entry will be permanently removed from the blockchain.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};