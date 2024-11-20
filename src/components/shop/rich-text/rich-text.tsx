import styles from './rich-text.module.css';

type Props = {
  html: string;
};

export const RichText = ({ html }: Props) => (
  <div className="richtext space-y-6 text-base text-gray-700">
    <div
      className={styles.richtext}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    ></div>
  </div>
);
