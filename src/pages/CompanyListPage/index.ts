import { withAuthGuard } from '@/utils/auth';
import CompanyListPage from './CompanyListPage';

export default withAuthGuard(CompanyListPage, '/login');
export { getCompaniesLoader } from './CompanyListPage';
