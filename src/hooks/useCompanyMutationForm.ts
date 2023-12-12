import type { CompanyMutationPayload } from '@/models/company';
import { getRegisterCompanyAction } from '@/pages/CompanyRegistrationPage/CompanyRegistrationPage';
import { AvailableProviders } from 'cep-promise';
import { useState, useEffect } from 'react';
import { useNavigation, useSubmit, useActionData } from 'react-router-dom';
import useAddressByCEP from './useAddressByCEP';

export default function useCompanyMutationForm(
  action: `/companies/${string}`,
  method: 'POST' | 'PUT' = 'POST',
) {
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  const [infoInput, setInfoInput] = useState(
    {} as Omit<CompanyMutationPayload, 'representative' | 'address'>,
  );
  const [addressInput, setAddressInput] = useState(
    {} as CompanyMutationPayload['address'],
  );
  const [representativeInput, setRepresentativeInput] = useState(
    {} as CompanyMutationPayload['representative'],
  );
  const submit = useSubmit();
  const errors = useActionData() as Awaited<
    ReturnType<ReturnType<typeof getRegisterCompanyAction>>
  >;
  const { address, loading: fetchingCEP } = useAddressByCEP(
    addressInput?.cep || '',
    {
      providers: ['viacep', 'brasilapi'] as AvailableProviders[],
    },
  );

  useEffect(() => {
    if (address) {
      setAddressInput(prev => ({
        ...prev,
        street: address.street,
        cep: address.cep,
      }));
    }
  }, [address]);

  function handleInfoInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInfoInput(prev => ({ ...prev, [name]: value }));
  }

  function handleAddressInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;
    setAddressInput(prev => ({ ...prev, [name]: value }));
  }

  function handleRepresentativeInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;
    setRepresentativeInput(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: CompanyMutationPayload = {
      address: addressInput,
      representative: representativeInput,
      ...infoInput,
    };
    submit(payload, {
      method,
      action,
      encType: 'application/json',
    });
  }

  return {
    infoInput,
    addressInput,
    representativeInput,
    handleInfoInputChange,
    handleAddressInputChange,
    handleRepresentativeInputChange,
    handleSubmit,
    submitting,
    errors,
    fetchingCEP,
  };
}
