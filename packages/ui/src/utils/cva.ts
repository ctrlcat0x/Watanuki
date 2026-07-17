type ClassDictionary = Record<string, unknown>;
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];

type VariantSchema = Record<string, Record<string, ClassValue>>;
type StringToBoolean<Value> = Value extends 'true' | 'false' ? boolean : Value;
type VariantPropsOf<Schema extends VariantSchema> = {
  [Key in keyof Schema]?: StringToBoolean<keyof Schema[Key]> | null;
};
type ClassProps = {
  class?: ClassValue;
  className?: ClassValue;
};

interface VariantConfig<Schema extends VariantSchema> {
  variants: Schema;
  defaultVariants?: VariantPropsOf<Schema>;
}

export type VariantProps<Component extends (...args: never[]) => unknown> = Omit<
  NonNullable<Parameters<Component>[0]>,
  'class' | 'className'
>;

export function cva<Schema extends VariantSchema>(
  base?: ClassValue,
  config?: VariantConfig<Schema>,
) {
  return (props?: VariantPropsOf<Schema> & ClassProps): string => {
    const classes: ClassValue[] = [base];

    if (config) {
      for (const key of Object.keys(config.variants) as (keyof Schema)[]) {
        if (props?.[key] === null) continue;

        const value = props?.[key] ?? config.defaultVariants?.[key];
        if (value !== undefined) {
          classes.push(config.variants[key][String(value)]);
        }
      }
    }

    classes.push(props?.class, props?.className);
    return joinClasses(classes);
  };
}

function joinClasses(values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;
    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value));
    } else if (Array.isArray(value)) {
      const nested = joinClasses(value);
      if (nested) classes.push(nested);
    } else if (typeof value === 'object') {
      for (const [name, enabled] of Object.entries(value)) {
        if (enabled) classes.push(name);
      }
    }
  }

  return classes.join(' ');
}
