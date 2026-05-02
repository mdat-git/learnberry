import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import SavingsSimulator from '@/components/simulators/SavingsSimulator';

export default function SavingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-1">
            Savings Trajectory
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            See how regular contributions compound over time.
          </p>
          <SavingsSimulator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
