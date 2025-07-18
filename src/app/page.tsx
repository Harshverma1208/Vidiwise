import EarlyAdopters from "~/components/EarlyAdopters/EarlyAdopters";
import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import Hero from "~/components/Hero/Hero";
import KeyFeatures from "~/components/KeyFeatures/KeyFeatures";
import Steps from "~/components/Steps/Steps";

// export const dynamic = 'force-dynamic'
// export const maxDuration = 59;

export default function HomePage({
  searchParams
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // const { session_id } = searchParams;

  // if(session_id) {
  //   // continue;
  // }

  // console.log(searchParams)
  return (
      <main className="relative min-h-screen">
        <Header />
        <div className="space-y-24">
          <Hero />
          <EarlyAdopters />
          <div className="space-y-32">
            <Steps />
            <KeyFeatures />
          </div>
          <Footer />
        </div>
      </main>
  );
}
