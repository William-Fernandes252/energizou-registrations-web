import { axiosInstance as axios } from '@/axios';
import { ServerError, ValidationError } from '@/errors';
import { AxiosError } from 'axios';

const resourceUri = '/companies/';

export type ListResponse =
  EnergizouRegistrations.RestAPI.ResponsePaginatedData<EnergizouRegistrations.Models.CompanyPreview>;

/**
 * @throws `ServerError` when `response.status` is not 200
 */
export async function getCompanies(
  page: number,
  limit: number,
  params?: {
    sort?: EnergizouRegistrations.RestAPI.CompanySortableField;
    order?: 'ASC' | 'DESC';
  },
): Promise<ListResponse> {
  try {
    const { data } = await axios.get(resourceUri, {
      params: { page, limit, ...params },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new ServerError(error);
    } else {
      throw error;
    }
  }
}

/**
 * @throws `AxiosError` when `response.status` is not 201
 */
export async function registerCompany(
  company: EnergizouRegistrations.RestAPI.RegisterCompanyForm,
): Promise<EnergizouRegistrations.Models.Company> {
  try {
    const { data } = await axios.post(resourceUri, company);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if ([400, 422].includes(error.response.status)) {
        throw new ValidationError(error);
      } else {
        throw new ServerError(error);
      }
    } else {
      throw error;
    }
  }
}
