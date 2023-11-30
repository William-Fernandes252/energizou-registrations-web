import { getMaskedInput } from '@/utils/inputs';

export default getMaskedInput({
  mask: '+55 (##) #####-####',
  definitions: {
    '#': /[0-9]/,
  },
  unmask: true,
});
