import { deleteCompany } from '@/models/company';
import { AxiosInstance } from 'axios';
import { ActionFunctionArgs, redirect } from 'react-router-dom';

export function getDeleteCompanyAction(axiosInstance: AxiosInstance) {
  return async function ({ params }: ActionFunctionArgs) {
    await deleteCompany(axiosInstance, params.id!);
    return redirect('/companies');
  };
}
