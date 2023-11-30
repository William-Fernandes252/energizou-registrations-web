import { getMaskedInput } from '@/utils/inputs';

export default getMaskedInput({
  mask: '###',
  definitions: {
    '#': /[0-9]/,
  },
  unmask: true,
});
