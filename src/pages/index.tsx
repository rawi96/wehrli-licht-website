import { GetStaticProps, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { AllOffersGallery } from '../components/AllOffersGallery'
import { Feedback } from '../components/Feedback'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { HolidayModal } from '../components/HolidayModal'
import { PageContainer } from '../components/PageContainer'
import { ProjectsTeaserRow } from '../components/ProjectsTeaserRow'
import TdoT from '../components/TdoT'
import { Testimonial as TestimonialComponent } from '../components/Testimonial'
import { TitleSection } from '../components/TitleSection'
import { global } from '../data/global'
import { home } from '../data/home'
import { testimonials } from '../data/testimonials'
import { getAllProjectsWithHeaderImages } from '../helpers/getAllProjectsWithHeaderImages'
import { ProjectWithHeaderImage } from '../types/ProjectWithHeaderImage'
import { Testimonial } from '../types/Testimonial'

type HomePageProps = {
  projectsWithHeaderImages: ProjectWithHeaderImage[]
}

const HomePage: NextPage<HomePageProps> = ({ projectsWithHeaderImages }) => {
  const [randomTestimonials, setRandomTestimonials] = useState<Testimonial[]>(
    []
  )

  useEffect(() => {
    const shuffled = testimonials.sort(() => Math.random() - 0.5)
    setRandomTestimonials(shuffled.slice(0, 2))
  }, [])

  return (
    <>
      {global.showHolidays && <HolidayModal />}
      <NextSeo title="Wehrli Licht GmbH" description={home.intro} />
      <Hero
        image={{
          src: '/images/essbereich.jpg',
          altText: 'Essbereich Beleuchtung',
        }}
        title={home.title}
        intro={home.intro}
        primaryButton={home.primaryButton}
        secondaryButton={home.secondaryButton}
      />
      {/* <TdoT /> */}
      <PageContainer>
        <TitleSection title={home.offerSubTitle} />
        <AllOffersGallery />

        <TitleSection title={home.projectsSubTitle} />
        <ProjectsTeaserRow
          projectsWithHeaderImages={projectsWithHeaderImages.slice(0, 5)}
        />

        <TitleSection title={home.testimonialsSubTitle} />
        {randomTestimonials.map((testimonial, index) => (
          <TestimonialComponent key={index} {...testimonial} />
        ))}

        <Feedback />
      </PageContainer>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = () => ({
  props: {
    projectsWithHeaderImages: getAllProjectsWithHeaderImages(),
  },
})

export default HomePage
