import type { JSX } from "react";

interface IconProps {
  className?: string;
}

export function ErrorIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3536 5.35355C11.5488 5.15829 11.5488 4.84171 11.3536 4.64645C11.1583 4.45118 10.8417 4.45118 10.6464 4.64645L11 5L11.3536 5.35355ZM4.64645 10.6464C4.45118 10.8417 4.45118 11.1583 4.64645 11.3536C4.84171 11.5488 5.15829 11.5488 5.35355 11.3536L5 11L4.64645 10.6464ZM10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6464L11 11L10.6464 11.3536ZM5.35355 4.64645C5.15829 4.45118 4.84171 4.45118 4.64645 4.64645C4.45118 4.84171 4.45118 5.15829 4.64645 5.35355L5 5L5.35355 4.64645ZM14 8H13.5C13.5 11.0376 11.0376 13.5 8 13.5V14V14.5C11.5899 14.5 14.5 11.5899 14.5 8H14ZM8 14V13.5C4.96243 13.5 2.5 11.0376 2.5 8H2H1.5C1.5 11.5899 4.41015 14.5 8 14.5V14ZM2 8H2.5C2.5 4.96243 4.96243 2.5 8 2.5V2V1.5C4.41015 1.5 1.5 4.41015 1.5 8H2ZM8 2V2.5C11.0376 2.5 13.5 4.96243 13.5 8H14H14.5C14.5 4.41015 11.5899 1.5 8 1.5V2ZM11 5L10.6464 4.64645L7.64645 7.64645L8 8L8.35355 8.35355L11.3536 5.35355L11 5ZM8 8L7.64645 7.64645L4.64645 10.6464L5 11L5.35355 11.3536L8.35355 8.35355L8 8ZM11 11L11.3536 10.6464L8.35355 7.64645L8 8L7.64645 8.35355L10.6464 11.3536L11 11ZM8 8L8.35355 7.64645L5.35355 4.64645L5 5L4.64645 5.35355L7.64645 8.35355L8 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SuccessIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 8L7.5 10.5L11 6M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8L8 11M8 5.77637V5.75M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WarningIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8V5M8 10.2236V10.25M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
