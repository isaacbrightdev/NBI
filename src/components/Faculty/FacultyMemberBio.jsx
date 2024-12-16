import log from 'loglevel';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '@/components/Badge';
import FacultyBreadCrumbs from '@/components/Faculty/FacultyBreadCrumbs';
import FacultyCourses from '@/components/Faculty/FacultyCourses';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';
import {
  AlgoliaFacultyAccountsIndexName,
  searchClient
} from '@/utils/searchClient';
import LoadingPage from '../LoadingPage';

const NotFound = () => (
  <div className="page min-h-full bg-grey-light p-5 py-10 md:py-20">
    <div className="mx-auto max-w-[828px]">
      <div className="rounded-lg border border-grey bg-white p-5 md:p-12">
        <h4>Faculty member not found</h4>
      </div>
    </div>
  </div>
);

const FacultyMemberBio = () => {
  const [faculty, setFaculty] = useState(null);
  // tease the id from the url, url is like this: firstname-lastname-id
  const { id } = useParams();
  const [isLoading, setisLoading] = useState(true);
  // split the last item in id to get the handle
  const handle = id.split('-').pop();
  const index = searchClient.initIndex(AlgoliaFacultyAccountsIndexName);
  const title = useMemo(() => {
    try {
      if (!faculty) return '';
      document.title = `${faculty?.firstName} ${faculty?.lastName} | Faculty`;
    } catch (error) {
      log.error('Error computing title from faculty name: FacultyMember.jsx');
      log.error(error);
      return '';
    }
  }, [faculty]);

  const getFacultyMember = async () => {
    try {
      const { hits } = await index.search('', {
        filters: `objectID:${handle}`,
        attributesToHighlight: []
      });
      setFaculty(hits[0]);
    } catch (error) {
      log.error(`Error fetching faculty member: in FacultyMember.jsx`);
      log.error(error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    getFacultyMember();
  }, []);

  const breadCrumbLinks = [
    {
      title: 'Home',
      url: '/'
    },
    {
      title: 'Directory',
      url: window.FacultyMember?.url || ''
    },
    {
      title,
      url: null
    }
  ];

  if (isLoading) return <LoadingPage />;
  if (!id) return <NotFound />;

  return (
    <section className="page min-h-full bg-grey-light p-5 py-10 md:py-20">
      <div className="mx-auto max-w-[828px]">
        {faculty ? (
          <div className="flex flex-col">
            <FacultyBreadCrumbs links={breadCrumbLinks} />
            <div className="mt-[20px] flex flex-col rounded-[10px] border border-grey bg-white px-[20px] py-[50px] lg:flex-row lg:p-[50px]">
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-[165px]">
                    <div className="mx-auto h-[100px] w-[100px] lg:mx-0 lg:h-[150px] lg:w-[150px]">
                      {faculty.imageUrl ? (
                        <img
                          src={faculty.imageUrl}
                          alt=""
                          className="aspect-square rounded-full object-cover"
                          loading="lazy"
                          width="46"
                            height="46"
                        />
                      ) : faculty.firstName && faculty.lastName ? (
                        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-tl from-primary to-[#0069A5] lg:h-[150px] lg:w-[150px]">
                          <span className="text-[30px] font-light text-white lg:text-[40px]">
                            {faculty.firstName.charAt(0)}
                            {faculty.lastName.charAt(0)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-[20px] w-full lg:mt-0 lg:w-auto">
                    <div className="flex flex-col items-center lg:items-start lg:pl-5">
                      <h2 className="text-secondary">
                        {faculty.accountName
                          ? faculty.accountName
                          : `${faculty.firstName} ${faculty.lastName}`}
                      </h2>
                      {faculty.companyName && (
                        <p className="text-sm mt-[5px]">
                          {faculty.companyName}
                        </p>
                      )}
                      {faculty.billAddress &&
                        faculty.billAddress.trim() !== '' &&
                        faculty.billAddress.trim() !== ',' && (
                          <div className="mt-[20px] flex items-center">
                            <SvgIcon
                              className="icon-location w-[10px]"
                              width={8}
                              height={12}
                              name="location"
                            />
                            <p className="ml-2 text-sm-body">
                              {faculty.billAddress}
                            </p>
                          </div>
                        )}
                      {faculty.website && (
                        <div className="mt-1 flex items-center">
                          <div className="w-[10px]">
                            <SvgIcon
                              className="icon-platform "
                              width={10}
                              height={10}
                              name="platform"
                            />
                          </div>
                          <Link
                            to={faculty.website}
                            target="_blank"
                            className="ml-2 leading-tight text-primary underline"
                          >
                            <span className="break-all text-sm-body">
                              {faculty.website}
                            </span>
                          </Link>
                        </div>
                      )}
                      {faculty.areasOfPractice &&
                        faculty.areasOfPractice.length > 0 && (
                          <div className="mt-[20px] flex flex-wrap items-center justify-center gap-y-2 lg:justify-normal">
                            {faculty.areasOfPractice.map((badge) => (
                              <Badge key={badge} color="grey">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {faculty.accountFacultyBio && (
                  <div className="border-gray mt-[30px] border-t pt-[30px]">
                    <p
                      className="text-sm-body"
                      dangerouslySetInnerHTML={{
                        __html: faculty.accountFacultyBio
                      }}
                    ></p>
                  </div>
                )}
              </div>
            </div>
            {faculty.courses && faculty.courses.length > 0 && (
              <div className="mt-[30px]">
                <FacultyCourses
                  courses={faculty.courses}
                  firstName={faculty.firstName ? faculty.firstName : ''}
                />
              </div>
            )}
          </div>
        ) : (
          <p>Faculty member not found</p>
        )}
      </div>
    </section>
  );
};

export default FacultyMemberBio;
