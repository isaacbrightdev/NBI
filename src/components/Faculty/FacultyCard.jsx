import PropTypes from 'prop-types';
import { useState } from 'react';
import useSettings from '@/hooks/useSettings';
import useSpeakerNameSlug from '@/hooks/useSpeakerNameSlug';
import getInitials from '@/utils/getInitials';
import Badge from '../Badge';
import Link from '../Link';
import SvgIcon from '../SvgIcon';

const FacultyCard = ({
  accountName,
  facultyWebUserId: accountId,
  firstName,
  lastName,
  imageUrl,
  website,
  billAddress,
  areasOfPractice,
  companyName
}) => {
  const { faculty_member_url } = useSettings();

  const imgAlt = accountName || 'Faculty Image';
  const [image, setImage] = useState(imageUrl || null);
  const initials = getInitials(`${firstName}`, `${lastName}`).toUpperCase();

  const handle = useSpeakerNameSlug(accountName, accountId);
  const memberUrl = faculty_member_url ? `${faculty_member_url}/${handle}` : '';

  const displayBillAddress = () => {
    if (!billAddress || billAddress.trim() === '' || billAddress.trim() === ',')
      return null;
    return (
      <div className="flex items-center">
        <SvgIcon
          className="icon-location w-[10px]"
          width={8}
          height={12}
          name="location"
        />
        <p className="ml-2 text-fine-print">{billAddress}</p>
      </div>
    );
  };

  const displayWebsite = () => {
    if (!website) return null;
    return (
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
          to={website}
          target="_blank"
          className="ml-2 leading-tight text-primary underline"
        >
          <span className="break-all text-fine-print">{website}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex w-full rounded-[10px] border p-[20px] lg:items-center">
      <Link to={memberUrl}>
        {image ? (
          <img
            className="aspect-square h-[75px] min-h-[75px] w-[75px] min-w-[75px] rounded-[100px] object-cover lg:h-[100px] lg:min-h-[100px] lg:w-[100px] lg:min-w-[100px]"
            onError={() => setImage(null)}
            src={image}
            alt={imgAlt}
            loading="lazy"
            width="46"
            height="46"
          />
        ) : (
          <div className="w-[75px] lg:w-[100px]">
            <div className="flex h-[75px] w-[75px] items-center justify-center rounded-[100px] bg-gradient-to-tl from-primary to-[#0069A5] lg:h-[100px] lg:w-[100px]">
              <span className="text-[30px] font-light text-white lg:text-[40px]">
                {initials}
              </span>
            </div>
          </div>
        )}
      </Link>
      <div className="flex basis-full flex-col pl-3 lg:basis-3/5">
        <Link to={memberUrl}>
          <h4 className="color-secondary font-medium">{accountName}</h4>
        </Link>
        <p className="text-sm">{companyName}</p>
        <div className="mt-3 flex flex-col lg:hidden">
          {displayBillAddress()}
          {displayWebsite()}
        </div>
        {areasOfPractice && areasOfPractice.length > 0 && (
          <div className="mt-[20px] flex flex-wrap justify-start gap-y-2 lg:justify-normal">
            {areasOfPractice.map((badge) => (
              <Badge key={badge} color="grey">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="ml-auto hidden w-1/3 flex-col justify-start lg:flex">
        <div className="flex flex-col pl-3">
          {displayBillAddress()}
          {displayWebsite()}
        </div>
      </div>
    </div>
  );
};

FacultyCard.propTypes = {
  accountName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  imageUrl: PropTypes.string,
  website: PropTypes.string,
  billAddress: PropTypes.string,
  companyName: PropTypes.string,
  facultyWebUserId: PropTypes.number,
  areasOfPractice: PropTypes.array
};

export default FacultyCard;
