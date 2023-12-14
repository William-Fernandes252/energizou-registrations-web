import { type GridProps, Grid, Typography, Divider } from '@mui/material';
import type { PropsWithChildren, ElementType } from 'react';

type Props = PropsWithChildren<
  {
    title: ElementType | string;
  } & GridProps
>;

export default function CompanyMutationFormSectionGrid({
  children,
  title,
  ...props
}: Props) {
  return (
    <Grid {...props}>
      <Grid item xs={12}>
        <Typography variant="h6">{title}</Typography>
        <Divider />
      </Grid>
      {children}
    </Grid>
  );
}
