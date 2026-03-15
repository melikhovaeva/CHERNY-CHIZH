import { cn } from '@/shared';
import styles from './Form.module.scss';

interface FormProps {
  children: React.ReactNode;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  className?: string;
}

export const Form = ({ onSubmit, children, className }: FormProps) => {
  return (
    <form
      className={cn([styles.form, className ?? ''])}
      onSubmit={onSubmit}
      noValidate
    >
      {children}
    </form>
  );
};
