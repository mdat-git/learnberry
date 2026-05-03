import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-6">About</h1>
          <div className="flex flex-col gap-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Learnberry is a set of math-first interactive tools for thinking through personal
              finance decisions. Every simulator is built around a real equation.
              Not a black box, not a guess. 
            </p>
            <p>
              The goal is clarity. Most financial tools either oversimplify (a single
              number answer) or overwhelm (dozens of inputs). Learnberry sits in
              between: just enough parameters to be honest, simple enough to be useful.
            </p>
            <p>
              This is not financial advice. It is a thinking aid. Use it to build
              intuition, stress-test assumptions, and ask better questions.
            </p>
            <p>
              No accounts. No tracking. No data leaves your browser. The math runs
              locally and that is intentional.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
