import { Button } from '../button';
import type { ReactElement } from "react";
import React from 'react'
import { Link } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
    icon: ReactElement;
    href: string;
}

export const NavButton: React.FC<Props> = ({
    children,
    icon,
    href
}) => {

  return (
    <Button className='flex justufy-start text-xl' icon={icon}>
      <Link to={ href }>
        {children}
      </Link>
    </Button>
  )
}
