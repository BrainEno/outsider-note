/* eslint-disable react/button-has-type */
import React, { useMemo } from 'react';

interface SwithcProps {
  checked: boolean;
  id?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}

function Switch({
  checked,
  onClick,
  text,
  id,
}: Readonly<SwithcProps>): JSX.Element {
  const buttonId = useMemo(() => `id_${Math.floor(Math.random() * 10000)}`, []);
  return (
    <div className="switch" id={id}>
      <label htmlFor={buttonId}>{text}</label>
      <button
        role="switch"
        aria-checked={checked}
        id={buttonId}
        onClick={onClick}
      >
        {' '}
        <span />
      </button>
    </div>
  );
}

export default Switch;
