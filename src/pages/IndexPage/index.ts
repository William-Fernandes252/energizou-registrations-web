import { withAuthGuard } from '@/utils/auth';
import IndexPage from './IndexPage';

export default withAuthGuard(IndexPage, '/login');
