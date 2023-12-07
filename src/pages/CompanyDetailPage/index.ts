import { withAuthGuard } from '@/utils/auth';
import CompanyDetailPage from './CompanyDetailPage';

export default withAuthGuard(CompanyDetailPage, '/login');
export { getCompanyDetailLoader } from './CompanyDetailPage';
