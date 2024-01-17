/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { joinClasses } from '../../utils/join-classes';

interface ButtonProps {
  'data-test-id'?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}
function Button({
  'data-test-id': dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={joinClasses(
        'Button__root',
        disabled && 'Button__disabled',
        small && 'Button__small',
        className
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { 'data-test-id': dataTestId })}
    >
      {children}
    </button>
  );
}

export default Button;
