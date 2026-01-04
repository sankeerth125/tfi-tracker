import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

export default function Pro() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 text-center max-w-4xl">
         <div className="mb-12 space-y-4">
           <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
             <Crown className="w-8 h-8 text-yellow-600" />
           </div>
           <h1 className="text-4xl md:text-5xl font-display font-bold">UPGRADE TO PRO</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             Get insider access to real-time box office data, distributor shares, and territory-wise breakdowns.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl border shadow-sm relative overflow-hidden">
               <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
               <p className="text-muted-foreground mb-6">For casual fans</p>
               <div className="text-4xl font-bold mb-8">₹0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
               
               <ul className="space-y-4 mb-8">
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Access to daily estimates</li>
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Basic comparisons</li>
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500" /> Verdict updates</li>
               </ul>
               
               <Button variant="outline" className="w-full" disabled>Current Plan</Button>
            </div>

            <div className="bg-primary text-primary-foreground p-8 rounded-2xl border shadow-xl relative overflow-hidden transform md:-translate-y-4">
               <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
               <h3 className="text-2xl font-bold mb-2">Analyst Pro</h3>
               <p className="text-primary-foreground/70 mb-6">For industry insiders</p>
               <div className="text-4xl font-bold mb-8">₹499<span className="text-sm font-normal text-primary-foreground/70">/mo</span></div>
               
               <ul className="space-y-4 mb-8">
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-yellow-400" /> Real-time collection feeds</li>
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-yellow-400" /> Territory breakdowns (Nizam, Ceeded, UA)</li>
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-yellow-400" /> Distributor share analysis</li>
                 <li className="flex items-center gap-3"><Check className="w-5 h-5 text-yellow-400" /> Historical archive access</li>
               </ul>
               
               <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold border-none">
                 Subscribe Now
               </Button>
            </div>
         </div>
      </main>
    </div>
  );
}
