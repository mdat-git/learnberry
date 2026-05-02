import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 px-6 pt-20 pb-12">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-base font-semibold text-gray-800 mb-6">Privacy</h1>
          <div className="flex flex-col gap-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Learnberry does not collect any personal data. There are no accounts,
              no login, and no forms that submit information to a server.
            </p>
            <p>
              All inputs you enter into the simulators are processed entirely in your
              browser. Nothing is transmitted, stored, or logged anywhere.
            </p>
            <p>
              There is no analytics, no advertising, and no third-party tracking of
              any kind on this site.
            </p>
            <p>
              If that ever changes, this page will say so plainly.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
