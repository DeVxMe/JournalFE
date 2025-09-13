import { PublicKey } from '@solana/web3.js';

export interface JournalEntry {
  title: string;
  message: string;
  owner: PublicKey;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JournalEntryState {
  title: string;
  message: string;
  owner: PublicKey;
}