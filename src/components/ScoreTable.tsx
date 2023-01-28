import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { dataTopScores, TopScoreData } from '../data/data';
import { formatHSLCSS } from '../utils/formatHSLCSS';

const rowCount = 10;

export function ScoreTable() {
  const [topScores, setTopScores] = useState<TopScoreData[]>(dataTopScores.data);
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.ceil(topScores.length / rowCount);

  const rows = topScores.slice(pageIndex * rowCount, (pageIndex + 1) * rowCount);

  useEffect(() => {
    const onTopScoresHandler = (topScoresNew: TopScoreData[]) => {
      setTopScores(topScoresNew);
    };
    dataTopScores.on('update', onTopScoresHandler);
    return () => {
      dataTopScores.off('update', onTopScoresHandler);
    };
  }, [setTopScores]);

  const onPageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <TableContainer sx={{ flexGrow: 2, display: 'flex', flexDirection: 'column' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Stage</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ id, rank, name, stageId, score, date, colour }) => {
              const hslCss = formatHSLCSS(colour);
              return (
                <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{rank}</TableCell>
                  <TableCell>
                    <Typography
                      fontWeight={'bold'}
                      color={hslCss}
                    >{name}</Typography>
                  </TableCell>
                  <TableCell align="right">{stageId}</TableCell>
                  <TableCell align="right">{score}</TableCell>
                  <TableCell align="right">{date.toString()}</TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
      <Box
        flexGrow={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={4}
      >
        <Box flexGrow={2}/>
        <Pagination
          page={pageIndex + 1}
          count={pageCount}
          onChange={(event, page) => {
            onPageChange?.(page - 1);
          }}
        />
      </Box>
    </TableContainer>
  );
}
