import type { AxiosInstance } from 'axios';
import { handleApiCallError } from './_utils';

const resourceUri = '/companies';

export type ListResponse =
  EnergizouRegistrations.RestAPI.ResponsePaginatedData<EnergizouRegistrations.Models.CompanyPreview>;

export type CompanyMutationPayload = Partial<
  Omit<
    EnergizouRegistrations.Models.Company,
    'users' | 'address' | 'created' | 'updated' | 'representative' | 'id'
  >
> & {
  representative:
    | Partial<
        Omit<EnergizouRegistrations.Models.User, 'id' | 'company'> & {
          password: string;
        }
      >
    | EnergizouRegistrations.Models.User['id'];
  address: Partial<EnergizouRegistrations.Models.Address>;
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
    throw handleApiCallError(error);
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
    throw handleApiCallError(error);
  }
}

/**
 * @throws `AxiosError` when `response.status` is not 201
 */
export async function registerCompany(
  axiosInstance: AxiosInstance,
  payload: CompanyMutationPayload,
): Promise<EnergizouRegistrations.Models.Company> {
  try {
    const { data } = await axiosInstance.post(
      `${resourceUri}/register`,
      payload,
    );
    return data;
  } catch (error) {
    throw handleApiCallError(error);
  }
}

export async function updateCompany(
  axiosInstance: AxiosInstance,
  id: EnergizouRegistrations.Models.Company['id'],
  payload: CompanyMutationPayload,
): Promise<EnergizouRegistrations.Models.Company> {
  try {
    const { data } = await axiosInstance.patch(`${resourceUri}/${id}`, payload);
    return data;
  } catch (error) {
    throw handleApiCallError(error);
  }
}

export async function addUserToCompany(
  axiosInstance: AxiosInstance,
  id: EnergizouRegistrations.Models.Company['id'],
  payload: Omit<EnergizouRegistrations.Models.User, 'id' | 'company'>,
): Promise<void> {
  try {
    await axiosInstance.post(`${resourceUri}/${id}/users`, payload);
  } catch (error) {
    throw handleApiCallError(error);
  }
}

export async function removeUserFromCompany(
  axios: AxiosInstance,
  id: EnergizouRegistrations.Models.Company['id'],
  userId: EnergizouRegistrations.Models.User['id'],
) {
  try {
    await axios.delete(`${resourceUri}/${id}/users/${userId}`);
  } catch (error) {
    throw handleApiCallError(error);
  }
}

export async function deleteCompany(
  axiosInstance: AxiosInstance,
  id: EnergizouRegistrations.Models.Company['id'],
): Promise<void> {
  try {
    await axiosInstance.delete(`${resourceUri}/${id}`);
  } catch (error) {
    throw handleApiCallError(error);
  }
}
