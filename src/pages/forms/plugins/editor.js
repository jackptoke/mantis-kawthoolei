// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ReactDraft from 'sections/forms/plugins/ReactDraft';
import ReactQuill from 'sections/forms/plugins/ReactQuill';

// ==============================|| PLUGINS - EDITOR ||============================== //

const Editor = () => {
  const theme = useTheme();

  return (
    <Page title="Editor">
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sx={{
            '& .rdw-editor-wrapper': {
              bgcolor: theme.palette.background.paper,
              border: '1px solid',
              borderColor: theme.palette.divider,
              borderRadius: '4px',
              overflow: 'hidden',
              '& .rdw-editor-main': {
                px: 2,
                py: 0.5,
                border: 'none',
                minHeight: 225
              },
              '& .rdw-editor-toolbar': {
                pt: 1.25,
                border: 'none',
                borderBottom: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.50',
                '& .rdw-option-wrapper': {
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.50',
                  borderColor: theme.palette.divider
                },
                '& .rdw-dropdown-wrapper': {
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.50',
                  borderColor: theme.palette.divider,
                  '& .rdw-dropdown-selectedtext': {
                    color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : 'grey.900'
                  },
                  '& .rdw-dropdownoption-default': {
                    color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : 'grey.900'
                  }
                }
              }
            }
          }}
        >
          <MainCard title="React Draft">
            <ReactDraft />
          </MainCard>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            '& .quill': {
              bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
              borderRadius: '4px',
              '& .ql-toolbar': {
                bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                borderColor: theme.palette.divider,
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
              },
              '& .ql-container': {
                borderColor: `${theme.palette.divider} !important`,
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
                '& .ql-editor': {
                  minHeight: 225
                }
              }
            }
          }}
        >
          <MainCard title="React Quill">
            <ReactQuill />
          </MainCard>
        </Grid>
      </Grid>
    </Page>
  );
};

Editor.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Editor;
