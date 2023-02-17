import { Container } from '@/components/Container'

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-wehrli py-20 sm:py-28"
    >
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Get your first tips today
          </h2>
        </div>
      </Container>
    </section>
  )
}
