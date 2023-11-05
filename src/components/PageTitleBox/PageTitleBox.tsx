import { Box, Typography, Divider, type BoxProps } from '@mui/material';

type Props = {
  title: string;
} & Omit<BoxProps, 'component'>;

export default function PageTitleBox({
  title,
  marginBottom = 2,
  ...boxProps
}: Props) {
  return (
    <Box marginBottom={marginBottom} {...boxProps}>
      <Typography variant="h4" marginBottom={1}>
        {title}
      </Typography>
      <Divider></Divider>
    </Box>
  );
}
