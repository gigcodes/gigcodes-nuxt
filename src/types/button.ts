export interface ImageModifiers {
  width: number
  height: number
  fit: string
  format: string
  [key: string]: any
}

export type btnTypes =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'dangerFill'
  | 'danger'
  | 'successFill'
  | 'success'
  | 'none';
export type btnSizes = 'normal' | 'sm' | 'lg' | 'xs' | 'none';

export interface BtnProps {
  type?: btnTypes;
  size?: btnSizes;
  disabled?: boolean;
  loading?: boolean;
}
