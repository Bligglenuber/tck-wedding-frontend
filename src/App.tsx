import { Box } from '@mui/material';
import React from 'react';
// import { DebugPanel } from './components/Debug';
import { Scoreboard } from './components/Scoreboard';

function App() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ height: '100vh' }}
    >
      <Box flexGrow={2} display={'flex'}>
        <Scoreboard/>
      </Box>
      {/*<DebugPanel/>*/}
    </Box>
  );
}

export default App;
