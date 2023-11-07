import { Navigation } from '../Navigation'
import { PageContainer } from '../PageContainer'
import { CallToActionProps } from './types'

export const CallToAction = ({ title, intro, children }: CallToActionProps) => {
  return (
    <>
    <div className="mb-20 bg-wehrli">
      <div className="px-6 lg:px-8">
        <Navigation />
      </div>
    </div>
    <PageContainer>
      {title && <h1 className="text-4xl pb-16 font-bold tracking-tight text-wehrli-500" dangerouslySetInnerHTML={{ __html: title }}></h1>} 
    </PageContainer>
    </>
  )
}
