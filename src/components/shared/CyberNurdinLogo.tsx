import Image from 'next/image';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'default' | 'light' | 'dark' | 'iconOnly' | 'wordmark';
type LogoAssetVariant = 'mark' | 'markLight' | 'wordmark' | 'stacked' | 'stackedLight' | 'stackedTagline';

const logoAssets: Record<LogoAssetVariant, { src: string; width: number; height: number }> = {
  mark: { src: '/logo (4).png', width: 1254, height: 1254 },
  markLight: { src: '/logo (2).png', width: 1254, height: 1254 },
  wordmark: { src: '/logo (1).png', width: 2172, height: 724 },
  stacked: { src: '/logo (3).png', width: 1536, height: 1024 },
  stackedLight: { src: '/logo (5).png', width: 1536, height: 1024 },
  stackedTagline: { src: '/logo (6).png', width: 1536, height: 1024 },
};

const sizeClasses: Record<LogoSize, { iconClass: string; wordmarkClass: string; text: string; gap: string }> = {
  xs: { iconClass: 'h-6 w-6', wordmarkClass: 'h-7 w-[84px]', text: 'text-sm', gap: 'gap-1.5' },
  sm: { iconClass: 'h-8 w-8', wordmarkClass: 'h-9 w-[108px]', text: 'text-lg', gap: 'gap-2.5' },
  md: { iconClass: 'h-10 w-10', wordmarkClass: 'h-11 w-[132px]', text: 'text-xl', gap: 'gap-3' },
  lg: { iconClass: 'h-12 w-12', wordmarkClass: 'h-14 w-[168px]', text: 'text-2xl', gap: 'gap-3' },
  xl: { iconClass: 'h-16 w-16', wordmarkClass: 'h-16 w-[192px]', text: 'text-3xl', gap: 'gap-3.5' },
};

export function CyberNurdinLogoImage({
  variant = 'mark',
  className = '',
  alt = '',
  priority = false,
}: {
  variant?: LogoAssetVariant;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const asset = logoAssets[variant];

  return (
    <Image
      src={asset.src}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      className={`shrink-0 object-contain ${className}`}
      width={asset.width}
      height={asset.height}
      priority={priority}
    />
  );
}

export function CyberNurdinLogoMark({
  tone = 'full',
  className = 'h-8 w-8',
  alt = '',
}: {
  tone?: 'full' | 'light';
  className?: string;
  alt?: string;
}) {
  return (
    <CyberNurdinLogoImage
      variant={tone === 'light' ? 'markLight' : 'mark'}
      className={className}
      alt={alt}
    />
  );
}

export default function CyberNurdinLogo({
  size = 'md',
  variant = 'default',
  showText = true,
  className = '',
}: {
  size?: LogoSize;
  variant?: LogoVariant;
  showText?: boolean;
  className?: string;
}) {
  const config = sizeClasses[size];
  const iconOnly = variant === 'iconOnly' || !showText;
  const textColor = variant === 'light' ? 'text-white' : 'text-[#061C36]';

  if (!iconOnly && variant !== 'light') {
    return (
      <span
        className={[
          'inline-flex shrink-0 items-center whitespace-nowrap align-middle',
          className,
        ].filter(Boolean).join(' ')}
      >
        <CyberNurdinLogoImage
          variant="wordmark"
          alt="CyberNurdin"
          className={config.wordmarkClass}
          priority={size === 'lg' || size === 'xl'}
        />
      </span>
    );
  }

  return (
    <span
      className={[
        'inline-flex shrink-0 items-center whitespace-nowrap align-middle',
        iconOnly ? 'justify-center' : config.gap,
        className,
      ].filter(Boolean).join(' ')}
      aria-label={iconOnly ? 'CyberNurdin' : undefined}
    >
      <CyberNurdinLogoMark
        tone={variant === 'light' ? 'light' : 'full'}
        className={config.iconClass}
      />
      {!iconOnly && (
        <span className={`${config.text} font-black tracking-tight ${textColor}`}>
          CyberNurdin
        </span>
      )}
    </span>
  );
}
