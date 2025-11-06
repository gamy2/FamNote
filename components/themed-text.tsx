import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({ type = 'default', className, ...rest }: ThemedTextProps) {
  const base = 'text-base leading-6 text-zinc-900 dark:text-zinc-100';
  const variants: Record<NonNullable<ThemedTextProps['type']>, string> = {
    default: base,
    defaultSemiBold: base + ' font-semibold',
    title: 'text-3xl font-bold leading-8 text-zinc-900 dark:text-zinc-100',
    subtitle: 'text-xl font-bold text-zinc-900 dark:text-zinc-100',
    link: 'text-base leading-[30px] text-primary',
  };

  return <Text className={[variants[type], className].filter(Boolean).join(' ')} {...rest} />;
}
