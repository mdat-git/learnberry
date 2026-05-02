import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import NetWorthSimulator from '@/components/simulators/NetWorthSimulator';

export default function NetWorthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-1">
            Net Worth Growth
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            Track assets minus liabilities over time.
          </p>
          <NetWorthSimulator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
