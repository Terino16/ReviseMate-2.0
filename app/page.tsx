import Hero from "../components/Landing/hero"
import Feature from "../components/Landing/feature"
import HowItWorks from "../components/Landing/howitworks"
import Testimonials from "../components/Landing/testimonials"
import Pricing from "../components/Landing/pricing"
import Footer from "../components/Landing/footer"
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
