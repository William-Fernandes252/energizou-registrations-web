import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type BoxProps,
  type SelectChangeEvent,
  Paper,
  Grid,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  onSortChange: (event: SelectChangeEvent<string>) => { value: unknown };
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    value: unknown;
  };
} & Omit<BoxProps, 'component'>;

export default function CompanyRegistrationForm({
  onSortChange,
  onSearchChange,
  ...boxProps
}: Props) {
  const [sortBy, setSortBy] = useState('price');

  function handleSelectChange(event: SelectChangeEvent<string>) {
    setSortBy(event.target.value);
    onSortChange(event);
  }

  return (
    <Paper>
      <Box component={'form'} {...boxProps} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              style={{ marginRight: '16px' }}
              onChange={onSearchChange}
            />
          </Grid>
          <Grid item>
            <FormControl variant="outlined">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={sortBy}
                onChange={handleSelectChange}
                label="Sort By">
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price">Name</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
