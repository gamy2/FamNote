import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
  // const defaultClasses = 'bg-background';
  return <View className={[className].filter(Boolean).join(' ')} {...otherProps} />;
}
