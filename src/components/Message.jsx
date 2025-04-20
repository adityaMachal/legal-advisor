import React from 'react';

function Message({ sender, content }) {
  const parseContent = (text) => {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = { type: null, content: [] };

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('Legal Basis')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { type: 'legalBasis', content: [] };
      } else if (line.startsWith('Key Considerations')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { type: 'keyConsiderations', content: [] };
      } else if (line.startsWith('Next Steps')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { type: 'nextSteps', content: [] };
      } else if (line.startsWith('Disclaimer')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { type: 'disclaimer', content: [] };
      } else if (line) {
        currentSection.content.push(line);
      }
    });
    if (currentSection.content.length > 0) sections.push(currentSection);

    return sections.map((section, index) => {
      const citationRegex = /(IPC Section \d+|Articles \d+(?:, \d+)*|CrPC Section \d+)/g;
      const parsedLines = section.content.map((line, lineIndex) => {
        if (line.startsWith('- ')) {
          const bulletContent = line.slice(2).trim();
          const parts = bulletContent.split(citationRegex);
          return (
            <li key={`${index}-${lineIndex}`} className="response-text">
              {parts.map((part, partIndex) => {
                if (citationRegex.test(part)) {
                  return <span key={`${index}-${lineIndex}-${partIndex}`} className="response-citation">{part}</span>;
                }
                return part;
              })}
            </li>
          );
        }
        const parts = line.split(citationRegex);
        return (
          <div key={`${index}-${lineIndex}`} className="response-text">
            {parts.map((part, partIndex) => {
              if (citationRegex.test(part)) {
                return <span key={`${index}-${lineIndex}-${partIndex}`} className="response-citation">{part}</span>;
              }
              return part;
            })}
          </div>
        );
      });

      return (
        <div key={index} className="response-section">
          {section.type && (
            <div className="response-heading">
              {section.type === 'legalBasis' && 'Legal Basis'}
              {section.type === 'keyConsiderations' && 'Key Considerations'}
              {section.type === 'nextSteps' && 'Next Steps'}
              {section.type === 'disclaimer' && 'Disclaimer'}
            </div>
          )}
          {section.content.some(line => line.startsWith('- ')) ? (
            <ul className="response-list">{parsedLines}</ul>
          ) : (
            parsedLines
          )}
        </div>
      );
    });
  };

  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      {parseContent(content)}
    </div>
  );
}

export default Message;