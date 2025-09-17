import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import { Journal } from '../idl/journal';
import type { JournalEntry } from '../types/journal';

const PROGRAM_ID = new web3.PublicKey('ETYD4aem41fzbewZr3FgHEWg1Hn1j2VZwq47HAG2kbyJ');

export const useJournalProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();

  const program = useMemo(() => {
    if (!wallet) return null;
    
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    
    return new Program<Journal>({
      address: PROGRAM_ID,
      metadata: {
        name: "journal",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor"
      },
      instructions: [
        {
          name: "createJournalEntry",
          discriminator: [48, 65, 201, 186, 25, 41, 127, 0],
          accounts: [
            {
              name: "journalEntry",
              writable: true,
              pda: {
                seeds: [
                  { kind: "arg", path: "title" },
                  { kind: "account", path: "owner" }
                ]
              }
            },
            {
              name: "owner",
              writable: true,
              signer: true
            },
            {
              name: "systemProgram",
              address: "11111111111111111111111111111111"
            }
          ],
          args: [
            { name: "title", type: "string" },
            { name: "message", type: "string" }
          ]
        },
        {
          name: "deleteJournalEntry",
          discriminator: [156, 50, 93, 5, 157, 97, 188, 114],
          accounts: [
            {
              name: "journalEntry",
              writable: true,
              pda: {
                seeds: [
                  { kind: "arg", path: "title" },
                  { kind: "account", path: "owner" }
                ]
              }
            },
            {
              name: "owner",
              writable: true,
              signer: true
            },
            {
              name: "systemProgram",
              address: "11111111111111111111111111111111"
            }
          ],
          args: [
            { name: "title", type: "string" }
          ]
        },
        {
          name: "updateJournalEntry",
          discriminator: [113, 164, 49, 62, 43, 83, 194, 172],
          accounts: [
            {
              name: "journalEntry",
              writable: true,
              pda: {
                seeds: [
                  { kind: "arg", path: "title" },
                  { kind: "account", path: "owner" }
                ]
              }
            },
            {
              name: "owner",
              writable: true,
              signer: true
            },
            {
              name: "systemProgram",
              address: "11111111111111111111111111111111"
            }
          ],
          args: [
            { name: "title", type: "string" },
            { name: "message", type: "string" }
          ]
        }
      ],
      accounts: [
        {
          name: "journalEntryState",
          discriminator: [113, 86, 110, 124, 140, 14, 58, 66]
        }
      ],
      types: [
        {
          name: "journalEntryState",
          type: {
            kind: "struct",
            fields: [
              { name: "owner", type: "pubkey" },
              { name: "title", type: "string" },
              { name: "message", type: "string" }
            ]
          }
        }
      ]
    } as any, provider);
  }, [connection, wallet]);

  const getJournalPda = (title: string, owner: web3.PublicKey) => {
    return web3.PublicKey.findProgramAddressSync(
      [Buffer.from(title), owner.toBuffer()],
      PROGRAM_ID
    );
  };

  const createJournalEntry = async (title: string, message: string) => {
    if (!program || !publicKey) throw new Error('Program or wallet not connected');

    const [journalPda] = getJournalPda(title, publicKey);

    const tx = await program.methods
      .createJournalEntry(title, message)
      .accountsPartial({
        journalEntry: journalPda,
        owner: publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  };

  const updateJournalEntry = async (title: string, message: string) => {
    if (!program || !publicKey) throw new Error('Program or wallet not connected');

    const [journalPda] = getJournalPda(title, publicKey);

    const tx = await program.methods
      .updateJournalEntry(title, message)
      .accountsPartial({
        journalEntry: journalPda,
        owner: publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  };

  const deleteJournalEntry = async (title: string) => {
    if (!program || !publicKey) throw new Error('Program or wallet not connected');

    const [journalPda] = getJournalPda(title, publicKey);

    const tx = await program.methods
      .deleteJournalEntry(title)
      .accountsPartial({
        journalEntry: journalPda,
        owner: publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    return tx;
  };

  const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
    if (!program || !publicKey) return [];

    try {
      const accounts = await program.account.journalEntryState.all([
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts.map((account) => ({
        title: account.account.title,
        message: account.account.message,
        owner: account.account.owner,
        createdAt: new Date(), // You might want to add this to your program
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  };

  const getJournalEntry = async (title: string): Promise<JournalEntry | null> => {
    if (!program || !publicKey) return null;

    try {
      const [journalPda] = getJournalPda(title, publicKey);
      const account = await program.account.journalEntryState.fetch(journalPda);

      return {
        title: account.title,
        message: account.message,
        owner: account.owner,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      return null;
    }
  };

  return {
    program,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    fetchJournalEntries,
    getJournalEntry,
    connected: !!program && !!publicKey,
  };
};