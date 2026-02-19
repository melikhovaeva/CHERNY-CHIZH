import styles from './Form.module.scss';

interface FormProps {
  children: React.ReactNode;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export const Form = ({ onSubmit, children }: FormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
};
