import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import FacultyMemberBio from '@/components/Faculty/FacultyMemberBio';
import useSettings from '@/hooks/useSettings';
import Faculty from './Faculty';
import SubscriptionPage from './SubscriptionPage';

const templates = (props) => ({
  'page-faculty': <Faculty {...props} />,
  'page-faculty-member': <FacultyMemberBio {...props} />,
  'page-subscription': <SubscriptionPage {...props} />
});

const PROSE_CLASSES = [
  'body',
  'prose',
  'max-w-none',
  'prose-h1:text-primary',
  'prose-h2:text-primary',
  'prose-h3:text-primary',
  'prose-h4:text-primary',
  'prose-p:text-primary'
];

const IGNORED_TEMPLATES = ['page-mcle', 'page-faq', 'page-directory'];

const Page = () => {
  const {
    title,
    body,
    updatedAt,
    displayTitle = true,
    displayLastUpdated = true
  } = useLoaderData();
  const { templateName } = useSettings();

  const lastUpdated = useMemo(() => {
    return new Date(updatedAt).toLocaleDateString();
  }, [updatedAt]);

  if (IGNORED_TEMPLATES.includes(templateName)) {
    return null;
  }

  if (templateName in templates()) {
    return templates()[templateName];
  }

  return templateName !== 'page' ? (
    <div dangerouslySetInnerHTML={{ __html: body }}></div>
  ) : (
    <div className="page min-h-full bg-grey-light p-5 py-10 md:py-20">
      <div className="mx-auto max-w-[828px]">
        <div className="rounded-lg border border-grey bg-white p-5 md:p-12">
          {displayLastUpdated?.value === 'true' && (
            <p className="mb-5 text-callout">Last Updated: {lastUpdated}</p>
          )}
          {displayTitle?.value === 'true' && (
            <>
              <h1 className="text-h3 md:text-h2">{title}</h1>
              <hr className="my-8" />
            </>
          )}
          <div
            className={PROSE_CLASSES.join(' ')}
            dangerouslySetInnerHTML={{ __html: body }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
