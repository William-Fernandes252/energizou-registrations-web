import { cnpj } from 'cpf-cnpj-validator';

export function formatCnpj(value: string) {
  return cnpj.format(value);
}

export function formatPhoneNumber(value: string) {
  return value.replace(/(\d{1,2})(\d{4})(\d{4})/, '+55 ($1) $2-$3');
}
