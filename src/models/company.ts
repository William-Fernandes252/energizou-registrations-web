import { ErrorFactory } from '@/errors';
import { AxiosError, type AxiosInstance } from 'axios';

const resourceUri = '/companies';

export type ListResponse =
  EnergizouRegistrations.RestAPI.ResponsePaginatedData<EnergizouRegistrations.Models.CompanyPreview>;

export type CompanyRegistrationPayload = Omit<
  EnergizouRegistrations.Models.Company,
  'users' | 'address' | 'created' | 'updated' | 'representative'
> & {
  representative: Omit<EnergizouRegistrations.Models.User, 'id' | 'company'> & {
    password: string;
  };
  address: EnergizouRegistrations.Models.Address;
};

export type SortableField = keyof Pick<
  EnergizouRegistrations.Models.Company,
  'reason' | 'created'
>;

export type ListParams = EnergizouRegistrations.RestAPI.PaginationParams &
  EnergizouRegistrations.RestAPI.SortParams<SortableField>;

/**
 * @throws `ServerError` when `response.status` is not 200
 */
export async function getCompanies(
  axiosInstance: AxiosInstance,
  params?: ListParams,
): Promise<ListResponse> {
  try {
    const { data } = await axiosInstance.get(resourceUri, { params });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw ErrorFactory.createFromAxiosError(error);
    } else {
      throw error;
    }
  }
}

export async function getCompany(
  axiosInstance: AxiosInstance,
  cnpj: EnergizouRegistrations.Models.Company['cnpj'],
): Promise<EnergizouRegistrations.Models.Company> {
  try {
    const { data } = await axiosInstance.get(`${resourceUri}/${cnpj}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw ErrorFactory.createFromAxiosError(error);
    } else {
      throw error;
    }
  }
}

/**
 * @throws `AxiosError` when `response.status` is not 201
 */
export async function registerCompany(
  axiosInstance: AxiosInstance,
  company: CompanyRegistrationPayload,
): Promise<EnergizouRegistrations.Models.Company> {
  try {
    const { data } = await axiosInstance.post(
      `${resourceUri}/register`,
      company,
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw ErrorFactory.createFromAxiosError(error);
    } else {
      throw error;
    }
  }
}
