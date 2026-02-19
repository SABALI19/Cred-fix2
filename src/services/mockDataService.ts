// Mock data service used by frontend demo flows.
export interface MockCreditAccount {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  account_name: string
  account_type: 'credit_card' | 'auto_loan' | 'mortgage' | 'personal_loan' | 'student_loan' | 'other'
  creditor_name: string
  balance: number
  credit_limit: number | null
  payment_history: string
  last_payment_date: string | null
  account_status: 'open' | 'closed' | 'dispute'
  bureau_experian: boolean
  bureau_equifax: boolean
  bureau_transunion: boolean
}

export interface MockCreditScore {
  id: string
  user_id: string
  created_at: string
  bureau: 'experian' | 'equifax' | 'transunion'
  score: number
  score_factors: Record<string, any> | null
  utilization_rate: number | null
  payment_history_score: number | null
  credit_age: number | null
}

export interface MockDispute {
  id: string
  user_id: string
  account_id: string | null
  created_at: string
  updated_at: string
  dispute_reason: string
  bureau: 'experian' | 'equifax' | 'transunion' | 'all'
  status: 'pending' | 'investigating' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  expected_resolution_date: string | null
  resolution_notes: string | null
  documents: string[] | null
}

export const mockCreditAccounts: MockCreditAccount[] = [
  {
    id: 'mock-1',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    account_name: 'Chase Freedom Unlimited',
    account_type: 'credit_card',
    creditor_name: 'Chase Bank',
    balance: 2450,
    credit_limit: 5000,
    payment_history: 'On Time',
    last_payment_date: '2024-01-15',
    account_status: 'open',
    bureau_experian: true,
    bureau_equifax: true,
    bureau_transunion: true,
  },
  {
    id: 'mock-2',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    account_name: 'Bank of America Cash Rewards',
    account_type: 'credit_card',
    creditor_name: 'Bank of America',
    balance: 890,
    credit_limit: 3000,
    payment_history: 'On Time',
    last_payment_date: '2024-01-14',
    account_status: 'open',
    bureau_experian: true,
    bureau_equifax: true,
    bureau_transunion: true,
  },
  {
    id: 'mock-3',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    account_name: 'Wells Fargo Auto Loan',
    account_type: 'auto_loan',
    creditor_name: 'Wells Fargo',
    balance: 18500,
    credit_limit: 25000,
    payment_history: '1 Late (30 days)',
    last_payment_date: '2024-01-10',
    account_status: 'open',
    bureau_experian: true,
    bureau_equifax: true,
    bureau_transunion: false,
  }
]

export const mockCreditScores: MockCreditScore[] = [
  {
    id: 'mock-score-1',
    user_id: 'mock-user',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    bureau: 'experian',
    score: 720,
    score_factors: null,
    utilization_rate: 24,
    payment_history_score: 95,
    credit_age: 48,
  },
  {
    id: 'mock-score-2',
    user_id: 'mock-user',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    bureau: 'experian',
    score: 680,
    score_factors: null,
    utilization_rate: 35,
    payment_history_score: 90,
    credit_age: 47,
  },
  {
    id: 'mock-score-3',
    user_id: 'mock-user',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    bureau: 'experian',
    score: 650,
    score_factors: null,
    utilization_rate: 45,
    payment_history_score: 85,
    credit_age: 46,
  },
  {
    id: 'mock-score-4',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    bureau: 'equifax',
    score: 715,
    score_factors: null,
    utilization_rate: 26,
    payment_history_score: 93,
    credit_age: 48,
  },
  {
    id: 'mock-score-5',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    bureau: 'transunion',
    score: 725,
    score_factors: null,
    utilization_rate: 23,
    payment_history_score: 96,
    credit_age: 48,
  }
]

export const mockDisputes: MockDispute[] = [
  {
    id: 'mock-dispute-1',
    user_id: 'mock-user',
    account_id: 'mock-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    dispute_reason: 'Incorrect balance reported',
    bureau: 'experian',
    status: 'investigating',
    priority: 'high',
    expected_resolution_date: '2024-02-15',
    resolution_notes: null,
    documents: null,
  },
  {
    id: 'mock-dispute-2',
    user_id: 'mock-user',
    account_id: 'mock-3',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    dispute_reason: 'Late payment should be removed',
    bureau: 'equifax',
    status: 'resolved',
    priority: 'medium',
    expected_resolution_date: '2024-01-30',
    resolution_notes: 'Successfully removed late payment',
    documents: null,
  },
  {
    id: 'mock-dispute-3',
    user_id: 'mock-user',
    account_id: null,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    dispute_reason: 'Unauthorized collection account',
    bureau: 'all',
    status: 'pending',
    priority: 'high',
    expected_resolution_date: '2024-02-28',
    resolution_notes: null,
    documents: null,
  }
]

class MockDataService {
  // Mock credit accounts
  async getCreditAccounts() {
    return new Promise<MockCreditAccount[]>((resolve) => {
      setTimeout(() => resolve(mockCreditAccounts), 100)
    })
  }

  // Mock credit score history
  async getCreditScoreHistory(limit = 12) {
    return new Promise<MockCreditScore[]>((resolve) => {
      setTimeout(() => resolve(mockCreditScores.slice(0, limit)), 100)
    })
  }

  // Mock disputes
  async getDisputes() {
    return new Promise<MockDispute[]>((resolve) => {
      setTimeout(() => resolve(mockDisputes), 100)
    })
  }

  // Mock latest credit scores
  async getLatestCreditScores() {
    return new Promise<Record<string, MockCreditScore>>((resolve) => {
      const latestScores: Record<string, MockCreditScore> = {}
      mockCreditScores.forEach(score => {
        if (!latestScores[score.bureau] || 
            new Date(score.created_at) > new Date(latestScores[score.bureau].created_at)) {
          latestScores[score.bureau] = score
        }
      })
      setTimeout(() => resolve(latestScores), 100)
    })
  }

  // Mock account summary
  async getAccountSummary() {
    const accounts = await this.getCreditAccounts()
    const creditCardAccounts = accounts.filter(account => 
      account.account_type === 'credit_card' && account.credit_limit
    )

    const totalBalance = creditCardAccounts.reduce((sum, account) => sum + account.balance, 0)
    const totalLimit = creditCardAccounts.reduce((sum, account) => sum + (account.credit_limit || 0), 0)
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0

    const onTimePayments = accounts.filter(account => 
      account.payment_history.includes('On Time')
    ).length

    return {
      totalAccounts: accounts.length,
      totalBalance,
      totalCreditLimit: totalLimit,
      utilization,
      onTimePaymentRate: accounts.length > 0 ? (onTimePayments / accounts.length) * 100 : 0,
      accounts
    }
  }

  // Mock dispute stats
  async getDisputeStats() {
    const disputes = await this.getDisputes()
    
    const total = disputes.length
    const pending = disputes.filter(d => d.status === 'pending').length
    const investigating = disputes.filter(d => d.status === 'investigating').length
    const resolved = disputes.filter(d => d.status === 'resolved').length
    const rejected = disputes.filter(d => d.status === 'rejected').length
    
    const highPriority = disputes.filter(d => d.priority === 'high').length
    const mediumPriority = disputes.filter(d => d.priority === 'medium').length
    const lowPriority = disputes.filter(d => d.priority === 'low').length

    const completedDisputes = resolved + rejected
    const successRate = completedDisputes > 0 ? (resolved / completedDisputes) * 100 : 0

    return {
      total,
      pending,
      investigating,
      resolved,
      rejected,
      highPriority,
      mediumPriority,
      lowPriority,
      successRate,
      activeDisputes: pending + investigating,
    }
  }
}

export const mockDataService = new MockDataService()
