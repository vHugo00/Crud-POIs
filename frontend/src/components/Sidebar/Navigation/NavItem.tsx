import { ChevronDown } from 'lucide-react';
import { ElementType } from 'react';

interface NavItemProps {
  title: string;
  icon: ElementType;
  children?: React.ReactNode; 
}

export function NavItem({ title, icon: Icon, children }: NavItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded px-3 py-2 outline-none hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-zinc-800">
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500" />
      <span className="font-medium text-zinc-700 group-hover:text-violet-500 dark:text-zinc-100 dark:group-hover:text-violet-300">
        {title}
      </span>
      {children}
      <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 dark:text-zinc-600" />
    </div>
  );
}
