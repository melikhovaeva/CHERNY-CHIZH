import clsx from 'clsx';

const cn = (
  classes: string[],
  options?: { [key: string]: boolean | undefined },
) => clsx(...classes, { ...options });
export { cn };
