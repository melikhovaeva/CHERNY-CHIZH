import { cn } from '@/shared/lib/utils';
import styles from './Button.module.scss';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'crm' | 'destructive';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  variant = 'primary',
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn([
        styles.button,
        styles[`variant-${variant}`],
        className || '',
      ])}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};
