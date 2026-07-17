/**
 * Sample interface for AutoTypeTable demos.
 */
export interface SampleButtonProps {
  /**
   * Visible label for the button.
   */
  label: string;
  /**
   * Visual style.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  /**
   * Disable interactions.
   */
  disabled?: boolean;
  /**
   * Click handler.
   */
  onClick?: (event: MouseEvent) => void;
}
