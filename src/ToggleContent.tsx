import React, { useState } from 'react';

interface Props {
  toggle: (show: () => void) => void;
  content: (hide: () => void) => void;
}

const ToggleContent = ({ toggle, content }: Props) => {
  const [isShown, setIsShown] = useState(false);
  const hide = () => setIsShown(false);
  const show = () => setIsShown(true);

  return (
    <>
      {toggle(show)}
      {isShown && content(hide)}
    </>
  );
};

export default ToggleContent;
