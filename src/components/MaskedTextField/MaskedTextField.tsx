import { forwardRef } from 'react';
import { IMaskInput, ReactMaskProps } from 'react-imask';

type Props = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
} & ReactMaskProps<HTMLInputElement>;

export default forwardRef<HTMLInputElement, Props>(
  function MaskedTextField(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  },
);
