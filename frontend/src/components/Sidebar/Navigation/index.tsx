import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { NavItem } from './NavItem';

export interface NavigationProps {}

export function Navigation(props: NavigationProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      <Link href="/" passHref>
        <NavItem icon={Home} title="Cadastrar" />
      </Link>
      <Link href="/register" passHref>
        <NavItem icon={Search} title="Encontrar locais" />
      </Link>
    </nav>
  );
}
