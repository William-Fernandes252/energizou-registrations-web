import cepPromise, {
  type CEP,
  type Configurations,
  type cep,
} from 'cep-promise';
import { useCallback, useEffect, useState } from 'react';

export interface CepPromiseError extends Error {
  type: string;
  errors: { message: string; service: string }[];
}

const useAddressByCEP: (...args: Parameters<typeof cep>) => {
  address: CEP | null;
  error: CepPromiseError | null;
  loading: boolean;
} = function (cep: string | number, options?: Configurations) {
  const [address, setAddress] = useState<CEP | null>(null);
  const [error, setError] = useState<CepPromiseError | null>(null);
  const [loading, setLoading] = useState(false);

  const doFetch = useCallback(
    async function () {
      setLoading(true);
      setError(null);
      try {
        const address = await cepPromise(cep, options);
        setAddress(address);
      } catch (error) {
        setError(error as CepPromiseError);
      } finally {
        setLoading(false);
      }
    },
    [cep, options],
  );

  useEffect(() => {
    if (cep && cep.toString().length === 8) {
      doFetch();
    }
  }, [cep]);

  return { address, error, loading };
};

export default useAddressByCEP;
