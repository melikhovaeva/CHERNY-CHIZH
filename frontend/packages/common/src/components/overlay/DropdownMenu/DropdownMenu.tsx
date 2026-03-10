import {
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useRef,
} from "react";
import styles from "./DropdownMenu.module.scss";

export interface DropdownMenuProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  anchorRef?: RefObject<HTMLElement | null>;
}

export function DropdownMenu({
  isOpen,
  onClose,
  className,
  anchorRef,
  children,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorRef, isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`${styles.menu} ${isOpen ? styles.menuOpen : ""} ${className ?? ""}`}
      role="menu"
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  );
}
