import { Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { randScoreData } from '../utils/rand';

// const apiRoot = 'http://127.0.0.1:5000/api';
const apiRoot = 'https://tck-wedding-b97c8.web.app/api';

interface RouteDefinition {
  method: 'GET' | 'POST';
  command: string;
  pathExample?: string;
  bodyExample?: Object;
}

interface DebugItemProps {
  routeDefinition: RouteDefinition;
}

function tryPrettifyJSON(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch (err) {
    return text;
  }
}

function DebugItem({ routeDefinition }: DebugItemProps) {
  const { method, command, pathExample, bodyExample } = routeDefinition;
  const editPath = !!pathExample;
  const editBody = method === 'POST';
  const [path, setPath] = useState(pathExample ? `/${command}/${pathExample}` : `/${command}`);
  const [pathInput, setPathInput] = useState(pathExample || '');
  const [bodyInput, setBodyInput] = useState(bodyExample ? JSON.stringify(bodyExample, null, 2) : '');
  const [res, setRes] = useState('');

  const onPathInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const pathInputNew = e.target.value;
    setPathInput(pathInputNew);
    let pathNew = `/${command}`;
    if (pathInputNew.length) {
      pathNew = `/${command}/${[pathInputNew]}`;
    }
    setPath(pathNew);
  };

  const onBodyInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const bodyInputNew = e.target.value;
    setBodyInput(bodyInputNew);
  };

  const onButtonClick = () => {
    setRes('');
    const url = `${apiRoot}${path}`;
    fetch(url, {
      method,
      body: editBody ? bodyInput : undefined
    })
      .then(res => {
        return res.text();
      })
      .then(resText => {
        setRes(resText);
      })
      .catch(err => {
        setRes(err.message || err.toString());
      });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
        {method} - {path}
        </span>
        <button value="Send" onClick={onButtonClick}>Send</button>
      </div>
      {editPath && (
        <input
          type="text"
          onChange={onPathInputChange}
          value={pathInput}
        />
      )}
      {editBody && (
        <textarea
          onChange={onBodyInputChange}
          rows={bodyInput.split('\n').length}
          value={bodyInput}
        />
      )}
      <div>Response:</div>
      <div
        title={tryPrettifyJSON(res)}
        style={{ wordBreak: 'break-all', maxHeight: '80px', overflowX: 'auto' }}>{res}</div>
    </div>
  );
}

const api: RouteDefinition[] = [
  { method: 'GET', command: 'user', pathExample: '123' },
  { method: 'GET', command: 'userTopScores', pathExample: '123/BOB' },
  { method: 'GET', command: 'topScores', pathExample: '0' },
  { method: 'POST', command: 'unlockStage', bodyExample: { userId: '123', stageId: '0' } },
  {
    method: 'POST',
    command: 'submitScore',
    bodyExample: { userId: '123', name: 'BOB', stageId: '0', score: 99, data: '' }
  },
];

function initRandomSampleData(count: number) {
  const scoreData = randScoreData(count);
  return Promise.all(scoreData.map((score) => {
    return fetch(`${apiRoot}/submitScore`, {
      method: 'POST',
      body: JSON.stringify(score)
    })
      .catch(console.error);
  }));
}

export function DebugPanel() {
  const onButtonClick = () => {
    initRandomSampleData(20).catch(console.error);
  };

  return (
    <div style={{ width: '300px', backgroundColor: 'rgb(199,204,215)', overflowX: 'auto' }}>
      <div style={{ padding: '16px' }}>
        <Typography variant={'h4'}>Debug Tools</Typography>
      </div>
      {api.map((routeDefinition) => {
        return (
          <DebugItem
            key={`${routeDefinition.method}-${routeDefinition.command}`}
            routeDefinition={routeDefinition}
          />
        );
      })}
      <div style={{ padding: '16px' }}>
        <button value="Send" onClick={onButtonClick}>Send Random Scores</button>
      </div>
    </div>
  );
}
