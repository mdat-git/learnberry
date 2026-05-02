import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import DebtSimulator from '@/components/simulators/DebtSimulator';

export default function DebtPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-1">
            Debt Paydown
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            Compare payoff strategies and total interest paid.
          </p>
          <DebtSimulator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
