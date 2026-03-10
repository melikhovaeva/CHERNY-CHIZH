import { type ReactNode, useRef, useState } from "react";
import { DropdownMenu } from "../../overlay/DropdownMenu";
import { UserAvatar } from "../UserAvatar";
import styles from "./UserDropdownMenu.module.scss";

export interface UserDropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  tone?: "default" | "danger";
}

export interface UserDropdownMenuProps {
  avatarSrc?: string | null;
  avatarAlt?: string;
  avatarSize?: number;
  avatarFallbackText?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  items: UserDropdownMenuItem[];
}

export function UserDropdownMenu({
  avatarSrc,
  avatarAlt,
  avatarSize = 50,
  avatarFallbackText = "?",
  className,
  triggerClassName,
  dropdownClassName,
  itemClassName,
  items,
}: UserDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => setIsOpen(false);

  return (
    <div className={`${styles.userMenu} ${className ?? ""}`}>
      <button
        type="button"
        ref={triggerRef}
        className={`${styles.userMenuTrigger} ${triggerClassName ?? ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <UserAvatar
          src={avatarSrc}
          alt={avatarAlt}
          size={avatarSize}
          fallbackText={avatarFallbackText}
        />
      </button>

      <DropdownMenu
        isOpen={isOpen}
        onClose={handleClose}
        anchorRef={triggerRef}
        className={`${styles.dropdownMenu} ${dropdownClassName ?? ""}`}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            className={`${styles.item} ${item.tone === "danger" ? styles.itemDanger : ""} ${itemClassName ?? ""} ${item.className ?? ""}`}
            onClick={() => {
              handleClose();
              item.onClick?.();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </DropdownMenu>
    </div>
  );
}
