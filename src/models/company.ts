import { useQueryClient, useQuery, useMutation } from 'react-query';
import type { AxiosError } from 'axios';
import { useAxios } from '@/contexts/axios';
import { useState } from 'react';

const resourceUri = '/products/';

export type ListResponse =
  EnergizouRegistrations.RestAPI.ResponsePaginatedData<EnergizouRegistrations.Models.CompanyPreview>;

export function useCompanies(
  page: number,
  limit: number,
  params?: {
    sort?: keyof Pick<
      EnergizouRegistrations.Models.Company,
      'reason' | 'created'
    >;
    order?: 'ASC' | 'DESC';
  },
  options: EnergizouRegistrations.RestAPI.UseModelOptions = {},
) {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(
    ['companies', { page, limit, ...params }],
    async () => {
      return (
        await axios.get(resourceUri, {
          params: { page, limit, ...params },
        })
      ).data;
    },
    options,
  );

  const mutation = useMutation(
    async (newProduct: Omit<EnergizouRegistrations.Models.Company, 'id'>) => {
      return (await axios.post(resourceUri, newProduct)).data;
    },
  );

  async function createCompany(
    registrationData: EnergizouRegistrations.RestAPI.RegisterCompanyForm,
  ) {
    return new Promise((resolve, reject) => {
      mutation.mutate(registrationData, {
        onSuccess(data) {
          queryClient.invalidateQueries('products');
          resolve(data);
        },
        onError(error) {
          reject(error);
          if (options.onError) {
            options.onError(error);
          }
        },
      });
    });
  }

  return { data, error, isLoading, create: createCompany } as {
    data: EnergizouRegistrations.RestAPI.ListResponseData<EnergizouRegistrations.Models.Company>;
    isLoading: boolean;
    error: AxiosError<EnergizouRegistrations.RestAPI.ErrorResponseData>;
    create: (
      registrationData: Omit<EnergizouRegistrations.Models.Company, 'id'>,
    ) => Promise<EnergizouRegistrations.Models.Company>;
  };
}

export function useCompany(
  options: EnergizouRegistrations.RestAPI.UseModelOptions = {},
) {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const [cnpj, setCnpj] = useState<
    EnergizouRegistrations.Models.Company['cnpj'] | null
  >(null);

  const query = useQuery(
    ['companies', cnpj],
    async () => {
      return cnpj ? (await axios.get(`${resourceUri}${cnpj}/`)).data : null;
    },
    options,
  );

  const updateMutation = useMutation(
    async (
      companyPatch: {
        cnpj: EnergizouRegistrations.Models.Company['cnpj'];
      } & Partial<EnergizouRegistrations.Models.Company>,
    ) => {
      return (
        await axios.put(`${resourceUri}${companyPatch.cnpj}/`, companyPatch)
      ).data;
    },
    options,
  );
  async function updateCompany(
    companyPatch: {
      cnpj: EnergizouRegistrations.Models.Company['cnpj'];
    } & Partial<Omit<EnergizouRegistrations.Models.Company, 'cnpj'>>,
  ) {
    return new Promise((resolve, reject) => {
      updateMutation.mutate(companyPatch, {
        onSuccess(data, variables) {
          queryClient.setQueryData(['companies', variables.cnpj], data);
          resolve(data);
        },
        onError(error) {
          reject(error);
        },
      });
    });
  }

  const deleteMutation = useMutation(
    async (companyId?: EnergizouRegistrations.Models.Company['cnpj']) => {
      return (await axios.delete(`${resourceUri}${companyId || cnpj}/`)).data;
    },
  );
  async function deleteCompany(
    companyId?: EnergizouRegistrations.Models.Company['cnpj'],
  ) {
    return new Promise((resolve, reject) => {
      deleteMutation.mutate(companyId, {
        onSuccess(data) {
          queryClient.invalidateQueries('companies');
          resolve(data);
          if (options.onSuccess) {
            options.onSuccess(data);
          }
        },
        onError(error) {
          reject(error);
          if (options.onError) {
            options.onError(error);
          }
        },
      });
    });
  }

  return {
    company: query.data,
    error: query.error,
    getCompany: setCnpj,
    update: updateCompany,
    delete: deleteCompany,
  };
}
