import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

// ==============================|| CODE HIGHLIGHTER ||============================== //

export default function SyntaxHighlight({ children, ...others }) {
  const theme = useTheme();

  return (
    <SyntaxHighlighter language="javascript" showLineNumbers style={theme.palette.mode === 'dark' ? a11yLight : a11yDark} {...others}>
      {children}
    </SyntaxHighlighter>
  );
}

SyntaxHighlight.propTypes = {
  children: PropTypes.string
};
