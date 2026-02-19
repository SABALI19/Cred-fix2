import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creditService, type CreditAccount, type CreditScore } from "@/services/creditService";
import { disputeService, type Dispute } from "@/services/disputeService";

export const useCreditAccounts = () =>
  useQuery({
    queryKey: ["creditAccounts"],
    queryFn: () => creditService.getCreditAccounts(),
    staleTime: 5 * 60 * 1000,
  });

export const useAddCreditAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account: Omit<CreditAccount, "_id" | "createdAt" | "updatedAt">) =>
      creditService.addCreditAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountSummary"] });
    },
  });
};

export const useUpdateCreditAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreditAccount> }) =>
      creditService.updateCreditAccount(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountSummary"] });
    },
  });
};

export const useDeleteCreditAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => creditService.deleteCreditAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountSummary"] });
    },
  });
};

export const useCreditScoreHistory = (limit?: number) =>
  useQuery({
    queryKey: ["creditScoreHistory", limit],
    queryFn: () => creditService.getCreditScoreHistory(limit),
    staleTime: 5 * 60 * 1000,
  });

export const useLatestCreditScores = () =>
  useQuery({
    queryKey: ["latestCreditScores"],
    queryFn: () => creditService.getLatestCreditScores(),
    staleTime: 5 * 60 * 1000,
  });

export const useAddCreditScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scoreData: Omit<CreditScore, "_id" | "createdAt" | "updatedAt">) =>
      creditService.addCreditScore(scoreData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditScoreHistory"] });
      queryClient.invalidateQueries({ queryKey: ["latestCreditScores"] });
    },
  });
};

export const useAccountSummary = () =>
  useQuery({
    queryKey: ["accountSummary"],
    queryFn: () => creditService.getAccountSummary(),
    staleTime: 5 * 60 * 1000,
  });

export const useDisputes = () =>
  useQuery({
    queryKey: ["disputes"],
    queryFn: () => disputeService.getDisputes(),
    staleTime: 5 * 60 * 1000,
  });

export const useCreateDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      dispute: Omit<Dispute, "_id" | "createdAt" | "updatedAt" | "documents">,
    ) => disputeService.createDispute(dispute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({ queryKey: ["disputeStats"] });
    },
  });
};

export const useUpdateDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Dispute> }) =>
      disputeService.updateDispute(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({ queryKey: ["disputeStats"] });
    },
  });
};

export const useDeleteDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disputeService.deleteDispute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({ queryKey: ["disputeStats"] });
    },
  });
};

export const useDisputeStats = () =>
  useQuery({
    queryKey: ["disputeStats"],
    queryFn: () => disputeService.getDisputeStats(),
    staleTime: 5 * 60 * 1000,
  });

export const useDisputesByBureau = () =>
  useQuery({
    queryKey: ["disputesByBureau"],
    queryFn: () => disputeService.getDisputesByBureau(),
    staleTime: 5 * 60 * 1000,
  });
