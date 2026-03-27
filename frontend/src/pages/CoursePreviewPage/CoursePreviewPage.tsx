import styles from './CoursePreviewPage.module.scss';

export const CoursePreviewPage = () => {
  return (
    <div className={styles.root}>
      <h2>Предпросмотр</h2>
      <p className={styles.placeholder}>Здесь будет предпросмотр курса</p>
    </div>
  );
};
