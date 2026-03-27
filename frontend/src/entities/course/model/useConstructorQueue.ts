import { useCallback, useRef, useState } from 'react';
import {
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from '../api/courses.api';

// ─── Types ───────────────────────────────────────────────────────────────────

type QueueActionType = 'create' | 'update' | 'delete';
type QueueEntityType = 'step' | 'lesson';

interface QueueEntry {
  action: QueueActionType;
  entity: QueueEntityType;
  /** Local ID (for local items) or server ID string */
  localId: string;
  /** Server ID once known */
  serverId?: number;
  /** Parent local step ID (for lessons) */
  parentLocalId?: string;
  /** Parent server step ID (for lessons) */
  parentServerId?: number;
  title: string;
  order: number;
}

export interface ConstructorQueueResult {
  queue: QueueEntry[];
  hasChanges: boolean;
  enqueueCreateStep: (localId: string, title: string, order: number) => void;
  enqueueUpdateStep: (
    localId: string,
    serverId: number | undefined,
    title: string,
    order: number,
  ) => void;
  enqueueDeleteStep: (
    localId: string,
    serverId: number | undefined,
    lessonLocalIds: string[],
  ) => void;
  enqueueCreateLesson: (
    localId: string,
    parentLocalId: string,
    parentServerId: number | undefined,
    title: string,
    order: number,
  ) => void;
  enqueueUpdateLesson: (
    localId: string,
    serverId: number | undefined,
    parentLocalId: string,
    parentServerId: number | undefined,
    title: string,
    order: number,
  ) => void;
  enqueueDeleteLesson: (
    localId: string,
    serverId: number | undefined,
    parentLocalId: string,
    parentServerId: number | undefined,
  ) => void;
  flush: (
    courseId: number,
    localToServerIdMap: React.MutableRefObject<Record<string, number>>,
  ) => Promise<void>;
  clear: () => void;
}

// ─── Self-filtering logic ────────────────────────────────────────────────────

function addToQueue(queue: QueueEntry[], entry: QueueEntry): QueueEntry[] {
  const { action, localId } = entry;

  // Find existing entry for this localId
  const existingIdx = queue.findIndex((e) => e.localId === localId);

  if (action === 'delete') {
    if (existingIdx !== -1) {
      const existing = queue[existingIdx];
      if (existing.action === 'create') {
        // create + delete = remove both (item never existed on server)
        // Also remove any child entries (lessons of this step)
        return queue.filter(
          (e) =>
            e.localId !== localId &&
            e.parentLocalId !== localId,
        );
      }
      // update + delete = replace with delete
      const next = [...queue];
      next[existingIdx] = entry;
      return next;
    }
    // No existing entry — item exists on server, just add delete
    return [...queue, entry];
  }

  if (action === 'update') {
    if (existingIdx !== -1) {
      const existing = queue[existingIdx];
      if (existing.action === 'create') {
        // create + update = update the create entry with new data
        const next = [...queue];
        next[existingIdx] = { ...existing, title: entry.title, order: entry.order };
        return next;
      }
      // update + update = replace with latest update
      const next = [...queue];
      next[existingIdx] = entry;
      return next;
    }
    return [...queue, entry];
  }

  // action === 'create'
  return [...queue, entry];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useConstructorQueue(): ConstructorQueueResult {
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  const [createStepApi] = useCreateStepMutation();
  const [updateStepApi] = useUpdateStepMutation();
  const [deleteStepApi] = useDeleteStepMutation();
  const [createLessonApi] = useCreateLessonMutation();
  const [updateLessonApi] = useUpdateLessonMutation();
  const [deleteLessonApi] = useDeleteLessonMutation();

  // Stable refs for the API functions so flush always uses latest
  const apiRef = useRef({
    createStepApi,
    updateStepApi,
    deleteStepApi,
    createLessonApi,
    updateLessonApi,
    deleteLessonApi,
  });
  apiRef.current = {
    createStepApi,
    updateStepApi,
    deleteStepApi,
    createLessonApi,
    updateLessonApi,
    deleteLessonApi,
  };

  const enqueueCreateStep = useCallback(
    (localId: string, title: string, order: number) => {
      setQueue((prev) =>
        addToQueue(prev, {
          action: 'create',
          entity: 'step',
          localId,
          title,
          order,
        }),
      );
    },
    [],
  );

  const enqueueUpdateStep = useCallback(
    (
      localId: string,
      serverId: number | undefined,
      title: string,
      order: number,
    ) => {
      setQueue((prev) =>
        addToQueue(prev, {
          action: 'update',
          entity: 'step',
          localId,
          serverId,
          title,
          order,
        }),
      );
    },
    [],
  );

  const enqueueDeleteStep = useCallback(
    (
      localId: string,
      serverId: number | undefined,
      lessonLocalIds: string[],
    ) => {
      setQueue((prev) => {
        // First remove any queued lesson actions for lessons in this step
        let next = prev.filter(
          (e) => !lessonLocalIds.includes(e.localId),
        );
        return addToQueue(next, {
          action: 'delete',
          entity: 'step',
          localId,
          serverId,
          title: '',
          order: 0,
        });
      });
    },
    [],
  );

  const enqueueCreateLesson = useCallback(
    (
      localId: string,
      parentLocalId: string,
      parentServerId: number | undefined,
      title: string,
      order: number,
    ) => {
      setQueue((prev) =>
        addToQueue(prev, {
          action: 'create',
          entity: 'lesson',
          localId,
          parentLocalId,
          parentServerId,
          title,
          order,
        }),
      );
    },
    [],
  );

  const enqueueUpdateLesson = useCallback(
    (
      localId: string,
      serverId: number | undefined,
      parentLocalId: string,
      parentServerId: number | undefined,
      title: string,
      order: number,
    ) => {
      setQueue((prev) =>
        addToQueue(prev, {
          action: 'update',
          entity: 'lesson',
          localId,
          serverId,
          parentLocalId,
          parentServerId,
          title,
          order,
        }),
      );
    },
    [],
  );

  const enqueueDeleteLesson = useCallback(
    (
      localId: string,
      serverId: number | undefined,
      parentLocalId: string,
      parentServerId: number | undefined,
    ) => {
      setQueue((prev) =>
        addToQueue(prev, {
          action: 'delete',
          entity: 'lesson',
          localId,
          serverId,
          parentLocalId,
          parentServerId,
          title: '',
          order: 0,
        }),
      );
    },
    [],
  );

  const flush = useCallback(
    async (
      courseId: number,
      localToServerIdMap: React.MutableRefObject<Record<string, number>>,
    ) => {
      const api = apiRef.current;
      const coursePk = String(courseId);

      // Process in order: creates first, then updates, then deletes
      // But we must respect the original queue order for creates
      // so that step creates happen before their lesson creates.
      const currentQueue = queue;

      for (const entry of currentQueue) {
        const resolveServerId = (localId: string, existingServerId?: number) =>
          existingServerId ?? localToServerIdMap.current[localId];

        if (entry.entity === 'step') {
          const sid = resolveServerId(entry.localId, entry.serverId);

          if (entry.action === 'create') {
            const result = await api
              .createStepApi({
                coursePk,
                courseStepCreateUpdate: {
                  title: entry.title,
                  order: entry.order,
                },
              })
              .unwrap();
            localToServerIdMap.current[entry.localId] = result.id;
          } else if (entry.action === 'update' && sid) {
            await api
              .updateStepApi({
                coursePk,
                id: String(sid),
                courseStepCreateUpdate: {
                  title: entry.title,
                  order: entry.order,
                },
              })
              .unwrap();
          } else if (entry.action === 'delete' && sid) {
            await api
              .deleteStepApi({ coursePk, id: String(sid) })
              .unwrap();
          }
        } else if (entry.entity === 'lesson') {
          const parentSid = resolveServerId(
            entry.parentLocalId!,
            entry.parentServerId,
          );
          const sid = resolveServerId(entry.localId, entry.serverId);

          if (!parentSid && entry.action !== 'delete') continue;

          const stepPk = String(parentSid);

          if (entry.action === 'create') {
            const result = await api
              .createLessonApi({
                coursePk,
                stepPk,
                courseLessonCreateUpdate: {
                  title: entry.title,
                  order: entry.order,
                },
              })
              .unwrap();
            localToServerIdMap.current[entry.localId] = result.id;
          } else if (entry.action === 'update' && sid && parentSid) {
            await api
              .updateLessonApi({
                coursePk,
                stepPk,
                id: String(sid),
                courseLessonCreateUpdate: {
                  title: entry.title,
                  order: entry.order,
                },
              })
              .unwrap();
          } else if (entry.action === 'delete' && sid && parentSid) {
            await api
              .deleteLessonApi({
                coursePk,
                stepPk,
                id: String(sid),
              })
              .unwrap();
          }
        }
      }
    },
    [queue],
  );

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    hasChanges: queue.length > 0,
    enqueueCreateStep,
    enqueueUpdateStep,
    enqueueDeleteStep,
    enqueueCreateLesson,
    enqueueUpdateLesson,
    enqueueDeleteLesson,
    flush,
    clear,
  };
}
