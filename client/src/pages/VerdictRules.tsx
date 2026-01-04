import { Navbar } from "@/components/Navbar";
import { VerdictBadge } from "@/components/VerdictBadge";

export default function VerdictRules() {
  const rules = [
    { verdict: "Blockbuster", rule: "Recovered > 200% of theatrical business", desc: "Huge profit for everyone involved." },
    { verdict: "Super Hit", rule: "Recovered 150% - 199% of business", desc: "Highly profitable venture." },
    { verdict: "Hit", rule: "Recovered 100% - 149% of business", desc: "Profitable for buyers." },
    { verdict: "Average", rule: "Recovered 80% - 99% of business", desc: "Minor losses or break-even." },
    { verdict: "Flop", rule: "Recovered 50% - 79% of business", desc: "Significant losses." },
    { verdict: "Disaster", rule: "Recovered < 50% of business", desc: "Total wash out." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-2">VERDICT RULES</h1>
        <p className="text-muted-foreground mb-8">How we calculate box office verdicts based on pre-release business.</p>

        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="bg-card p-4 rounded-lg border flex items-center gap-4">
              <div className="w-32 flex-shrink-0">
                <VerdictBadge verdict={rule.verdict} className="w-full text-center block" />
              </div>
              <div>
                <p className="font-bold text-sm">{rule.rule}</p>
                <p className="text-xs text-muted-foreground">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
