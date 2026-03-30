import Hero from "../components/landing/hero"
import Feature from "../components/landing/feature"
import HowItWorks from "../components/landing/howitworks"
import Testimonials from "../components/landing/testimonials"
import Pricing from "../components/landing/pricing"
import Footer from "../components/landing/footer"
export default function Home() {
  return (
    <div className="bg-[#F2EDEC]">
     
      <Hero/>
      <Feature/>
      <HowItWorks/>
      <Testimonials/>
      <Pricing/>
      <Footer/>
    </div>
  )
}
