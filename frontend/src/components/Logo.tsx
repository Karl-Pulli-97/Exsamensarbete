import mainLogo from '../assets/anglers-ledger-main.svg';
import horizontalLogo from '../assets/anglers-ledger-horizontal.svg';
import iconLogo from '../assets/anglers-ledger-icon.svg';

interface LogoProps {
    variant?: 'main' | 'horizontal' | 'icon';
    className?: string;
}

export function Logo({ variant = 'main', className = '' }: LogoProps) {
    const sources = {
        main: mainLogo,
        horizontal: horizontalLogo,
        icon: iconLogo,
    };

    return <img src={sources[variant]} alt="Anglers' Ledger" className={className} />;
}