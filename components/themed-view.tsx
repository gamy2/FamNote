import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
  // Default container background respects light/dark using Tailwind utilities
  const defaultClasses = 'bg-background dark:bg-background-dark';
  return <View className={[defaultClasses, className].filter(Boolean).join(' ')} {...otherProps} />;
}
