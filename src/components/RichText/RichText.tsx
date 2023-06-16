import styles from './RichText.module.css'
import { RichTextProps } from './types'

export const RichText = ({ html }: RichTextProps) => {
  return (
    <div className="richtext space-y-6 text-base text-gray-700">
      <div
        className={styles.richtext}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </div>
  )
}
