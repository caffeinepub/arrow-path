import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useHighestLevelReached() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["highestLevel"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getHighestLevelReached();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkLevelCompleted() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      levelId,
      moveCount,
    }: { levelId: string; moveCount: number }) => {
      if (!actor) return;
      await actor.markLevelCompleted(levelId, BigInt(moveCount));
    },
  });
}

export function useResetProgress() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.resetProgress();
    },
  });
}
