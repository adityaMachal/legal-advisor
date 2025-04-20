import React from 'react';

function Message({ sender, content }) {
  const className = `message ${sender}-message`;
  const lines = content.split('\n');

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Message;