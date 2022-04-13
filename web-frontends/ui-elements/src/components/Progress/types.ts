export type HorizontalLayoutType = 'left' | 'right' | 'center' | '';
export type VerticalLayoutType = 'top' | 'bottom' | '';
export type SizeType = 'full' | 'half' | 'quarter' | '';
export interface ProgressProps {
  percent: number;
  text?: string;
  size?: SizeType;
  horizontalTextLayout?: HorizontalLayoutType;
  verticalTextLayout?: VerticalLayoutType;
}