import { Breadcrumbs, Link, Typography } from '@mui/material';

const UserBreadcrumb = ({ current }) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    <Link underline="hover" color="inherit" href="/">
      Home
    </Link>
    <Link underline="hover" color="inherit" href="/edit">
      BuilderPage
    </Link>
    <Typography color="text.primary">{current}</Typography>
  </Breadcrumbs>
);

export default UserBreadcrumb;