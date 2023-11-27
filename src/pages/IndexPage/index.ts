import { withAuthGuard } from '@/routes/utils';
import IndexPage from './IndexPage';

export default withAuthGuard(IndexPage, '/login');
