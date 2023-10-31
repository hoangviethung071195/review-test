import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <Box hidden={value !== index} sx={{ p: 3 }}>
      {value === index && children}
    </Box>
  );
}