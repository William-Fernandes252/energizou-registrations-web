import { withAuthGuard } from '@/routes/utils';
import CompanyDetailPage from './CompanyDetailPage';

export default withAuthGuard(CompanyDetailPage, '/login');
export { getCompanyDetailLoader } from './CompanyDetailPage';
