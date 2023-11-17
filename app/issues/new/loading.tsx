import { Skeleton } from '@/app/components';
import { Box } from '@radix-ui/themes';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingNewIssuePage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Skeleton height="20rem" />
    </Box>
  );
};

export default LoadingNewIssuePage;
