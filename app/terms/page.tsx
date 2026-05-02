import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-6">Terms</h1>
          <div className="flex flex-col gap-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Learnberry is provided for educational and informational purposes only.
              Nothing on this site constitutes financial, legal, or tax advice.
            </p>
            <p>
              The simulators model simplified versions of real financial scenarios.
              They are useful for building intuition but should not be used as the
              sole basis for any financial decision.
            </p>
            <p>
              Learnberry makes no guarantees about the accuracy of the calculations
              or their applicability to your personal situation. Use the outputs as
              a starting point for further research, not as a final answer.
            </p>
            <p>
              By using this site you agree that you are responsible for how you
              interpret and act on any information presented here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
