import { Typography } from '@mui/material';
import Page from 'components/Page';
import Layout from 'layout';

const ArticlesPage = () => {
  return (
    <Page title="Subjects List">
      <Typography variant="h3" gutterBottom>
        Subject Add
      </Typography>
    </Page>
  );
};

NewsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ArticlesPage;
