import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import CreditsButton from '@/components/CreditsButton';
import SpeakerProfile from '@/components/SpeakerProfile';
import SvgIcon from '@/components/SvgIcon';
import useFormattedHours from '@/hooks/useFormattedHours';
import addHoursToDate from '@/utils/addHoursToDate';

const ProductBannerInfoBlock = () => {
  const { product, selectedVariant } = useProduct();
  const { metafields } = product;
  const hours = metafields?.course?.hours;
  const speakers = metafields?.course?.speakers;
  const eventDate = metafields?.course?.['event-date-timestamp'];
  const eventDateEnd = metafields?.course?.['event-date-end-timestamp'];
  const eventHours = metafields?.course?.hours;
  const speakerCount = speakers ? Object.keys(speakers).length : 0;
  const primarySpeaker = speakers ? speakers[Object.keys(speakers)[0]] : null;
  const descriptionSubtext = selectedVariant?.descriptionSubtext?.value;
  const hoursFormatted = useFormattedHours(hours);

  const isLiveInPerson = product.tags.some(
    (tag) => tag.toLowerCase() === 'format:live in-person'
  );
  const isLive =
    isLiveInPerson ||
    product.tags.some((tag) => tag.toLowerCase() === 'format:live online');
  let primarySpeakerFormatted;

  const deliveryText = useMemo(() => {
    let text =
      product.tags
        .find((tag) => tag.startsWith('delivery-text'))
        ?.substring('delivery-text:'.length) ||
      product?.product_type ||
      '';

    text = decodeURIComponent(text.replace('encoded:', ''));

    if (isLiveInPerson) {
      text = text.replaceAll('+', ' ');
    }
    return text;
  }, [product.tags]);

  if (
    primarySpeaker &&
    primarySpeaker['first-name'] &&
    primarySpeaker['last-name']
  ) {
    const others =
      speakerCount - 1 === 1
        ? `${speakerCount - 1} Other`
        : `${speakerCount - 1} Others`;

    // Start with the "With {first-name} {last-name}" part
    let primarySpeakerParts = [`With ${primarySpeaker['account-name']}`];

    // Conditionally add the "from {law-firm}" part
    if (primarySpeaker['law-firm']) {
      primarySpeakerParts.push(`from ${primarySpeaker['law-firm']}`);
    }

    // Conditionally add the "Others" part
    if (speakerCount > 1) {
      primarySpeakerParts.push(`+ ${others}`);
    }

    // Join all parts into a single string
    primarySpeakerFormatted = primarySpeakerParts.join(' ');
  }

  // need to grab the profile-image for each speaker, and get them into an array
  const speakerEntries = speakers ? Object.entries(speakers) : null;

  // icon needs a fallback of first-name initial + last-name initial
  const speakerInitialsArray = speakerEntries.map((speaker) => {
    const value = speaker[1];
    const firstName = value['first-name'];
    const lastName = value['last-name'];
    const firstNameInitial = firstName ? firstName[0] : '';
    const lastNameInitial = lastName ? lastName[0] : '';
    return `${firstNameInitial}${lastNameInitial}`;
  });

  const speakerOffset = speakerCount;
  const speakerIconWidthClass = speakerOffset * 25 + 35; // 35 = 25 for 1/2 image width + 10px right padding

  // convert eventDate (UTC Timestamp) to a local date like Monday, June 21, 2021 9:00 AM
  const eventDateFormatted = eventDate ? new Date(eventDate * 1000) : null;
  const eventDateEndFormatted = eventDateEnd
    ? new Date(eventDateEnd * 1000)
    : null;
  const eventDateOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  const eventDateFormattedString = eventDateFormatted
    ? eventDateFormatted.toLocaleString('en-US', eventDateOptions)
    : null;

  const eventDateEndFormattedString = eventDateEndFormatted
    ? eventDateEndFormatted.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      })
    : null;

  const eventEndTime =
    eventHours && eventDate ? addHoursToDate(eventDate, eventHours) : null;

  const eventEndTimeFormatted = eventEndTime
    ? eventEndTime.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    : null;

  const InfoBlock = ({ icon, className, children }) => (
    <div className={`mb-[14px] flex items-center lg:mb-0 lg:mr-[15px]`}>
      <SvgIcon
        className={`mr-2 ${className}`}
        name={icon}
        width={25}
        height={25}
      />
      <span>{children}</span>
    </div>
  );

  InfoBlock.propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  };

  const reversedSpeakerEntries = [...speakerEntries].reverse();
  const reversedSpeakerInitialsArray = [...speakerInitialsArray].reverse();

  if (!product || !selectedVariant) return <></>;

  return (
    <>
      <div className="flex flex-col gap-y-0.5 lg:flex-row lg:items-center lg:py-[27px]">
        <CreditsButton
          product={product}
          className={
            'mb-[15px] flex cursor-pointer items-center border-none bg-transparent pl-0 lg:mb-0 lg:mr-[15px]'
          }
          spanClassName={'text-base font-normal'}
          plusSvgClassName={'hidden'}
          creditSvgWidth={25}
        />
        <InfoBlock
          icon={isLiveInPerson ? 'location' : 'platform'}
          className={isLiveInPerson ? 'icon-location' : 'icon-platform'}
        >
          {deliveryText}
        </InfoBlock>
        {eventDate && eventDateFormattedString && isLive ? (
          <InfoBlock icon="time" className="icon-time">
            {eventDateFormattedString} -{' '}
            {eventDateEndFormattedString || eventEndTimeFormatted}
          </InfoBlock>
        ) : hoursFormatted ? (
          <InfoBlock icon="time" className="icon-time">
            {hoursFormatted}
          </InfoBlock>
        ) : null}
      </div>
      <div className="flex">
        <div
          className={
            descriptionSubtext
              ? 'mb-5 mt-2 flex items-center justify-start lg:mt-0'
              : 'mb-10 mt-2 flex items-center justify-start lg:mt-0'
          }
        >
          {/* Profile pictures */}
          <div
            className="flex items-center"
            style={{ width: `${speakerIconWidthClass}px` }}
          >
            {reversedSpeakerEntries.map((speaker, index) => {
              return (
                <SpeakerProfile
                  key={`${speaker[1]['first-name']}_${speaker[1]['last-name']}-${index}`}
                  speaker={speaker[1]}
                  index={index}
                  speakerInitialsArray={reversedSpeakerInitialsArray}
                />
              );
            })}
          </div>
          {/* names + info */}
          {primarySpeaker !== null && (
            <>
              <div className="flex justify-center">
                <span className="text-sm-body">{primarySpeakerFormatted}</span>
              </div>
            </>
          )}
        </div>
      </div>
      {descriptionSubtext && (
        <>
          <div className="flex">
            <div className="mb-10 flex items-center justify-start italic lg:mt-0">
              <div className="flex justify-center">
                <span className="text-sm-body">{descriptionSubtext}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

ProductBannerInfoBlock.propTypes = {
  speakers: PropTypes.object,
  productType: PropTypes.string,
  hours: PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string
  }),
  variant: PropTypes.shape({
    credits: PropTypes.shape({
      value: PropTypes.string
    })
  }),
  eventDate: PropTypes.shape({
    value: PropTypes.string
  }),
  speakerCount: PropTypes.number,
  primarySpeaker: PropTypes.shape({
    'first-name': PropTypes.string,
    'last-name': PropTypes.string,
    'law-firm': PropTypes.string
  }),
  primarySpeakerFormatted: PropTypes.string,
  speakerInitialsArray: PropTypes.array,
  reversedSpeakerEntries: PropTypes.array,
  reversedSpeakerInitialsArray: PropTypes.array,
  speakerOffset: PropTypes.number,
  speakerIconWidthClass: PropTypes.number,
  eventDateFormatted: PropTypes.object,
  eventDateEndFormatted: PropTypes.object,
  eventDateOptions: PropTypes.object,
  eventDateFormattedString: PropTypes.string,
  eventDateEndFormattedString: PropTypes.string,
  hoursString: PropTypes.string,
  hoursArray: PropTypes.array,
  hoursInteger: PropTypes.number,
  minutesInteger: PropTypes.number,
  hoursFormatted: PropTypes.string
};

export default ProductBannerInfoBlock;
