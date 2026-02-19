import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  DollarSign,
  CreditCard,
  Home,
  Car,
  Building,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";

const ROICalculator = () => {
  const [currentScore, setCurrentScore] = useState([580]);
  const [targetScore, setTargetScore] = useState([750]);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currentDebts, setCurrentDebts] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanType, setLoanType] = useState("mortgage");
  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    const current = currentScore[0];
    const target = targetScore[0];
    const income = parseFloat(monthlyIncome) || 0;
    const debts = parseFloat(currentDebts) || 0;
    const loan = parseFloat(loanAmount) || 0;

    // Credit score improvement calculations
    const scoreImprovement = target - current;
    const improvementMonths = Math.max(1, Math.ceil(scoreImprovement / 30)); // Rough estimate

    // Interest rate improvements based on credit score ranges
    const getCurrentRate = (score: number, type: string) => {
      if (type === "mortgage") {
        if (score < 580) return 8.5;
        if (score < 620) return 7.8;
        if (score < 680) return 6.9;
        if (score < 740) return 6.2;
        return 5.8;
      } else if (type === "auto") {
        if (score < 580) return 18.5;
        if (score < 620) return 15.2;
        if (score < 680) return 11.8;
        if (score < 740) return 8.4;
        return 5.9;
      } else if (type === "personal") {
        if (score < 580) return 28.5;
        if (score < 620) return 24.2;
        if (score < 680) return 18.8;
        if (score < 740) return 14.4;
        return 10.9;
      }
      return 15.0; // Default for business loans
    };

    const currentRate = getCurrentRate(current, loanType);
    const targetRate = getCurrentRate(target, loanType);
    const rateDifference = currentRate - targetRate;

    // Monthly payment calculations
    const loanTermYears =
      loanType === "mortgage" ? 30 : loanType === "auto" ? 5 : 3;
    const loanTermMonths = loanTermYears * 12;

    const calculateMonthlyPayment = (
      principal: number,
      rate: number,
      term: number,
    ) => {
      const monthlyRate = rate / 100 / 12;
      return (
        (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1)
      );
    };

    const currentMonthlyPayment = calculateMonthlyPayment(
      loan,
      currentRate,
      loanTermMonths,
    );
    const targetMonthlyPayment = calculateMonthlyPayment(
      loan,
      targetRate,
      loanTermMonths,
    );
    const monthlySavings = currentMonthlyPayment - targetMonthlyPayment;
    const totalSavings = monthlySavings * loanTermMonths;

    // Credit repair service cost
    const serviceCost = 149 * improvementMonths; // Professional plan

    // Additional benefits
    const creditCardSavings = ((debts * (rateDifference / 100)) / 12) * 12; // Annual savings
    const qualificationBonus = target >= 620 && current < 620 ? 5000 : 0; // Loan qualification value

    setResults({
      scoreImprovement,
      improvementMonths,
      currentRate: currentRate.toFixed(2),
      targetRate: targetRate.toFixed(2),
      rateDifference: rateDifference.toFixed(2),
      currentMonthlyPayment,
      targetMonthlyPayment,
      monthlySavings,
      totalSavings,
      serviceCost,
      creditCardSavings,
      qualificationBonus,
      netROI:
        totalSavings + creditCardSavings + qualificationBonus - serviceCost,
      roiMultiplier:
        (totalSavings + creditCardSavings + qualificationBonus) / serviceCost,
    });
  };

  useEffect(() => {
    if (monthlyIncome && currentDebts && loanAmount) {
      calculateROI();
    }
  }, [
    currentScore,
    targetScore,
    monthlyIncome,
    currentDebts,
    loanAmount,
    loanType,
  ]);

  const loanTypes = [
    {
      id: "mortgage",
      name: "Mortgage",
      icon: Home,
      description: "Home purchase or refinance",
    },
    {
      id: "auto",
      name: "Auto Loan",
      icon: Car,
      description: "Car, truck, or vehicle financing",
    },
    {
      id: "personal",
      name: "Personal Loan",
      icon: CreditCard,
      description: "Personal or debt consolidation",
    },
    {
      id: "business",
      name: "Business Loan",
      icon: Building,
      description: "Business expansion or equipment",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Credit Repair{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ROI Calculator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculate how much money you could save by improving your credit
              score
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credit Score Range */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Current Credit Score
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={currentScore}
                      onValueChange={setCurrentScore}
                      max={850}
                      min={300}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>300</span>
                      <span className="font-medium text-lg text-foreground">
                        {currentScore[0]}
                      </span>
                      <span>850</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Target Credit Score
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={targetScore}
                      onValueChange={setTargetScore}
                      max={850}
                      min={currentScore[0]}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{currentScore[0]}</span>
                      <span className="font-medium text-lg text-primary">
                        {targetScore[0]}
                      </span>
                      <span>850</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debts">Current Credit Card Debt</Label>
                  <Input
                    id="debts"
                    type="number"
                    placeholder="15000"
                    value={currentDebts}
                    onChange={(e) => setCurrentDebts(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan">Planned Loan Amount</Label>
                  <Input
                    id="loan"
                    type="number"
                    placeholder="300000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Loan Type */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Loan Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {loanTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          loanType === type.id
                            ? "ring-2 ring-primary border-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setLoanType(type.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon
                            className={`w-6 h-6 mx-auto mb-2 ${
                              loanType === type.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <h4 className="font-medium text-sm">{type.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={calculateROI}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate My Savings
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Your Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.scoreImprovement}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Point Improvement
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {results.improvementMonths}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Months to Target
                      </div>
                    </div>
                  </div>

                  {/* Interest Rate Comparison */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Interest Rate Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Rate:</span>
                        <span className="font-medium text-red-600">
                          {results.currentRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Rate:</span>
                        <span className="font-medium text-green-600">
                          {results.targetRate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-primary font-medium">
                        <span>Rate Reduction:</span>
                        <span>{results.rateDifference}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Impact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Financial Impact</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monthly Loan Savings:</span>
                          <span className="font-bold text-green-600">
                            ${results.monthlySavings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Loan Savings:</span>
                          <span className="font-bold text-blue-600">
                            ${results.totalSavings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {results.creditCardSavings > 0 && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Credit Card Savings:
                            </span>
                            <span className="font-bold text-purple-600">
                              ${results.creditCardSavings.toLocaleString()}/year
                            </span>
                          </div>
                        </div>
                      )}
                      {results.qualificationBonus > 0 && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              Qualification Value:
                            </span>
                            <span className="font-bold text-orange-600">
                              ${results.qualificationBonus.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* ROI Summary */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">ROI Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service Investment:</span>
                        <span className="font-medium text-red-600">
                          -${results.serviceCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Net ROI:</span>
                        <span className="text-green-600">
                          ${results.netROI.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                        <div className="text-3xl font-bold text-primary">
                          {results.roiMultiplier.toFixed(1)}x
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Return on Investment
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      size="lg"
                      onClick={() => (window.location.href = "/booking")}
                    >
                      Start Saving Money Today
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Free consultation • 30-day money-back guarantee
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Calculate Your Savings
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Fill in your information to see how much you could save with
                    better credit.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      <span>Personalized calculations</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      <span>Real interest rate data</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Important Disclaimer:</p>
                <p>
                  This calculator provides estimates based on industry averages
                  and historical data. Actual results may vary based on
                  individual circumstances, credit history, and market
                  conditions. Credit score improvements and timeline estimates
                  are not guaranteed. Interest rates are subject to lender
                  approval and market fluctuations. For personalized advice,
                  please consult with our credit specialists.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ROICalculator;
