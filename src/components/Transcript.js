import React from 'react';
import { Card } from 'react-bootstrap';

function Transcript({ transcripts }) {
  return (
    <Card style={{ padding: 20 }}>
      <h5>Transcript History</h5>
      <ul>
        {transcripts.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </Card>
  );
}

export default Transcript;
