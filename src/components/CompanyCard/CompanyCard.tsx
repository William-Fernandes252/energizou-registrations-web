import { Card, type CardProps } from '@mui/material';

type Props = { id: number } & CardProps;

export default function CompanyCard({ id, ...cardProps }: Props) {
  return <Card {...cardProps}>Product {id}</Card>;
}
