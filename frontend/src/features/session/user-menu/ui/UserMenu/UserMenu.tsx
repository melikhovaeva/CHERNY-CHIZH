import { UserImage } from '@/features/session';
import { LogoutButton } from '@/features/session/logout/ui/LogoutButton';
import { ProfileButton } from '@/features/session/user-menu';
import { cn } from '@/shared/lib/utils';
import { DropdownMenu } from '@/shared/ui/components';
import { useRef, useState } from 'react';
import styles from './UserMenu.module.scss';

const AVATAR_SIZE = 50;

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleProfile = () => {
    handleClose();
  };

  return (
    <div className={styles.userMenu}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.userMenuTrigger}
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <UserImage size={AVATAR_SIZE} />
      </button>
      <DropdownMenu
        isOpen={isOpen}
        onClose={handleClose}
        anchorRef={triggerRef}
        className={styles.dropdownMenu}
      >
        <ProfileButton className={cn([styles.item])} onClick={handleProfile} />
        <LogoutButton className={styles.item} />
      </DropdownMenu>
    </div>
  );
}
