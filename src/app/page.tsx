import { Hero } from "@/components/home/hero"
import { SilhouetteRow } from "@/components/home/silhouette-row"
import { ColorGallery } from "@/components/home/color-gallery"
import { ComparisonSlider } from "@/components/home/comparison-slider"

/** Home page, following the enabled sections of templates/index.json in order. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SilhouetteRow />
      <ColorGallery />
      <section className="page-width space-y-8 pb-16">
        <h2 className="font-body text-center text-[1.5rem] font-light">Meet the New Summer Colors</h2>
        <ComparisonSlider />
      </section>
    </>
  )
}
