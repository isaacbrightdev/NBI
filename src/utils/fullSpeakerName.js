const fullSpeakerName = (speaker, sameLineJoinCharacter = ' ') =>
  `${speaker.prefix ? speaker.prefix + sameLineJoinCharacter : ''}${speaker['first-name'] ? speaker['first-name'] : ''}${speaker['middle-initial'] ? sameLineJoinCharacter + speaker['middle-initial'] + '.' : ''} ${speaker['last-name'] ? speaker['last-name'] : ''}${speaker.suffix ? sameLineJoinCharacter + speaker.suffix : ''}`;

export default fullSpeakerName;
