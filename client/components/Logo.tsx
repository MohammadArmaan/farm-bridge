import Image from "next/image";

interface LogoInterface {
    height: number;
    width: number;
    className?: string;
}

export default function Logo({ height, width, className }: LogoInterface) {
    return (
        <Image
            src="/logo.png"
            height={height}
            width={width}
            className={className}
            alt="Logo"
        />
    );
}
