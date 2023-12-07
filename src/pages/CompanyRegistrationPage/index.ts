import { withAuthGuard } from '@/utils/auth';
import CompanyRegistrationPage from './CompanyRegistrationPage';

export default withAuthGuard(CompanyRegistrationPage, '/login');
