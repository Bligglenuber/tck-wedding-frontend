import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from 'react';
import { useState } from 'react';
import { dataTopScores } from '../data/data';
import { ScoreTable } from './ScoreTable';

function NameFilterControls() {
  const [value, setValue] = useState(dataTopScores.nameFilter || '');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nameFilter = event.target.value;
    setValue(nameFilter);
    dataTopScores.setNameFilter(nameFilter || null);
  };

  const onClick = () => {
    setValue('');
    dataTopScores.setNameFilter(null);
  };

  return (
    <Box>
      <TextField
        label="Name"
        variant="outlined"
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={onClick}
              sx={{ visibility: value ? 'visible' : 'hidden' }}
            >
              <ClearIcon/>
            </IconButton>
          )
        }}
      />
    </Box>
  );
}

function StageFilterControls() {
  const [activeStages, setActiveStages] = React.useState(dataTopScores.allStageIds);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    activeStagesNew: string[],
  ) => {
    dataTopScores.setStageIdFilter(activeStagesNew);
    setActiveStages(activeStagesNew);
  };

  return (
    <ToggleButtonGroup
      value={activeStages}
      onChange={handleFormat}
      aria-label="stage selection"
    >
      {dataTopScores.allStageIds.map((stageId) => {
        const stage = `Stage ${stageId}`;
        return (
          <ToggleButton key={stageId} value={stageId} aria-label={stage}>
            {stage}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

export function Scoreboard() {

  return (
    <Box
      component={Paper}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'stretch'}
      flexGrow={2}
      m={6}
      p={3}
    >
      <Box textAlign={'center'}>
        <Typography variant={'h3'}>Top Scores</Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <NameFilterControls/>
        <StageFilterControls/>
      </Box>
      <ScoreTable/>
    </Box>
  );
}
