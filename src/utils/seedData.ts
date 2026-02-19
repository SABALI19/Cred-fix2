import { creditService } from "@/services/creditService";
import { disputeService } from "@/services/disputeService";

export const seedSampleData = async () => {
  const sampleAccounts = [
    {
      accountName: "Chase Freedom Unlimited",
      accountType: "credit_card" as const,
      creditorName: "Chase Bank",
      balance: 2450,
      creditLimit: 5000,
      paymentHistory: "On Time",
      lastPaymentDate: null,
      accountStatus: "open" as const,
      bureauExperian: true,
      bureauEquifax: true,
      bureauTransunion: true,
    },
    {
      accountName: "Wells Fargo Auto Loan",
      accountType: "auto_loan" as const,
      creditorName: "Wells Fargo",
      balance: 18500,
      creditLimit: 25000,
      paymentHistory: "1 Late (30 days)",
      lastPaymentDate: null,
      accountStatus: "open" as const,
      bureauExperian: true,
      bureauEquifax: true,
      bureauTransunion: false,
    },
  ];

  for (const account of sampleAccounts) {
    await creditService.addCreditAccount(account);
  }

  const sampleScores = [
    { bureau: "experian" as const, score: 720, utilizationRate: 24, paymentHistoryScore: 95, creditAge: 6, scoreFactors: null },
    { bureau: "equifax" as const, score: 715, utilizationRate: 26, paymentHistoryScore: 93, creditAge: 5, scoreFactors: null },
    { bureau: "transunion" as const, score: 725, utilizationRate: 23, paymentHistoryScore: 96, creditAge: 7, scoreFactors: null },
  ];

  for (const score of sampleScores) {
    await creditService.addCreditScore(score);
  }

  await disputeService.createDispute({
    accountId: null,
    disputeReason: "Unauthorized collection account",
    bureau: "all",
    status: "pending",
    priority: "high",
    resolutionNotes: "",
  });
};
