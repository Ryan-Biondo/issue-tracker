'use client';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiFillBug } from 'react-icons/ai';

const NavBar = () => {
  const currentPath = usePathname();
  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'Issues', href: '/issues/list' },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map(({ href, label }) => (
          <Link
            href={href}
            key={href}
            className={classNames({
              'text-zinc-900': href === currentPath,
              'text-zinc-500': href !== currentPath,
              'hover:text-zinc-800 transition-colors': true,
            })}>
            {label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
