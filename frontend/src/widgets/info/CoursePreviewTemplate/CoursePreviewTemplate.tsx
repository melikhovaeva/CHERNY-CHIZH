import styles from './CoursePreviewTemplate.module.scss';

export const CoursePreviewTemplate = () => {
  return (
    <div className={styles.root}>
      <h2>Предпросмотр</h2>
      <p className={styles.placeholder}>Здесь будет предпросмотр курса</p>
    </div>
  );
};
