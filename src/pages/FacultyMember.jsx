import { createPortal } from 'react-dom';
import FacultyMemberBio from '../components/FacultyMember/FacultyMemberBio';

const FacultyMember = () => {
  const sectionEl = document.getElementById('faculty-member');

  if (!sectionEl) return null;

  return createPortal(<FacultyMemberBio />, sectionEl);
};

export default FacultyMember;
