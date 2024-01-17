import './Placeholder.css';

import { ReactNode } from 'react';

export default function Placeholder({
  children,
  className = 'Placeholder__root',
}: {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}): JSX.Element {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}
