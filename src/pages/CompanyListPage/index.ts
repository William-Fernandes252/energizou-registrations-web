import { withAuthGuard } from '@/routes/utils';
import CompanyListPage from './CompanyListPage';

export default withAuthGuard(CompanyListPage, '/login');
export { getCompaniesLoader } from './CompanyListPage';
