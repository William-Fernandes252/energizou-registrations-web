import { forwardRef } from 'react';
import { IMaskInput, type MaskOpts, type ReactMaskProps } from 'react-imask';

type Props = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
} & Omit<ReactMaskProps<HTMLInputElement>, 'definitions' | 'mask'>;

export function getMaskedInput({
  mask,
  unmask,
  definitions,
}: Pick<MaskOpts<HTMLInputElement>, 'mask' | 'unmask'> & {
  definitions: Record<string, unknown>;
}) {
  return forwardRef<HTMLInputElement, Props>(function (props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        // @ts-ignore
        definitions={definitions}
        unmask={unmask}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  });
}
