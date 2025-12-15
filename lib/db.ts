import Dexie, { Table } from 'dexie';
import { ItemProgress } from '../types';
import { supabase } from './supabase';

// Define DB Interface
interface SyncJob {
  id?: number;
  type: 'PROGRESS_UPDATE' | 'PHOTO_UPLOAD';
  payload: any;
  status: 'pending' | 'processing' | 'failed';
  createdAt: number;
}

class KidBoostDB extends Dexie {
  progress!: Table<ItemProgress, string>;
  syncQueue!: Table<SyncJob, number>;

  constructor() {
    super('KidBoostDB');
    (this as any).version(1).stores({
      progress: '[childId+itemId], childId', // Composite PK
      syncQueue: '++id, status, type'
    });
  }
}

export const db = new KidBoostDB();

// --- API Helpers ---

export const saveProgressLocal = async (items: ItemProgress[]) => {
    // Bulk put to Dexie (Client-side immediate persistence)
    await db.progress.bulkPut(items);
    
    // Queue Sync Job
    await db.syncQueue.add({
        type: 'PROGRESS_UPDATE',
        payload: items, 
        status: 'pending',
        createdAt: Date.now()
    });

    // Try sync immediately if online
    if (navigator.onLine) {
        processSyncQueue();
    }
};

export const processSyncQueue = async () => {
    if (!navigator.onLine) return;

    // Get all pending jobs
    const jobs = await db.syncQueue.where('status').equals('pending').toArray();
    if (jobs.length === 0) return;

    // Mark as processing
    const processingJobs = jobs.map(j => ({ ...j, status: 'processing' as const }));
    await db.syncQueue.bulkPut(processingJobs);

    const progressUpdates: ItemProgress[] = [];
    const progressJobIds: number[] = [];
    const otherJobs = [];

    // Separate jobs
    for (const job of jobs) {
        if (job.type === 'PROGRESS_UPDATE') {
            progressUpdates.push(...job.payload);
            progressJobIds.push(job.id!);
        } else {
            otherJobs.push(job);
        }
    }

    // 1. Batch Progress Update (Single Query for multiple items/activities)
    if (progressUpdates.length > 0) {
        try {
            // Deduplicate
            const uniqueMap = new Map<string, ItemProgress>();
            progressUpdates.forEach(item => {
                uniqueMap.set(`${item.childId}_${item.itemId}`, item);
            });
            const payload = Array.from(uniqueMap.values());

            const { error } = await supabase
                .from('item_progress')
                .upsert(payload, { onConflict: 'childId, itemId' });

            if (error) throw error;

            // Success: Delete jobs
            await db.syncQueue.bulkDelete(progressJobIds);
        } catch (err) {
            console.error('Batch sync failed', err);
            // Revert status to pending for retry
            const jobsToRevert = processingJobs.filter(j => progressJobIds.includes(j.id!)).map(j => ({ ...j, status: 'pending' as const }));
            await db.syncQueue.bulkPut(jobsToRevert);
        }
    }

    // 2. Process Other Jobs
    for (const job of otherJobs) {
        try {
            await db.syncQueue.delete(job.id!);
        } catch (err) {
            console.error('Job sync failed', job.id, err);
            await db.syncQueue.update(job.id!, { status: 'pending' });
        }
    }
};

export const syncDown = async (childId: string, since?: number) => {
    if (!navigator.onLine) return;

    let query = supabase
        .from('item_progress')
        .select('*')
        .eq('childId', childId);

    if (since) {
        query = query.gt('updatedAt', since);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
        await db.progress.bulkPut(data as ItemProgress[]);
    }
    
    return Date.now();
};

export const getLocalProgressMap = async (childId: string): Promise<Record<string, ItemProgress>> => {
    const items = await db.progress.where('childId').equals(childId).toArray();
    const map: Record<string, ItemProgress> = {};
    items.forEach(i => {
        map[`${i.childId}_${i.itemId}`] = i;
    });
    return map;
};