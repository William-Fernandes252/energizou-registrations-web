import { withAuthGuard } from '@/routes/utils';
import CompanyRegistrationPage from './CompanyRegistrationPage';

export default withAuthGuard(CompanyRegistrationPage, '/login');
