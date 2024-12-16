import Badge from '@/components/Badge';
import SelectDropdown from '@/components/SelectDropdown';
import SubscriptionAddToCart from '@/components/SubscriptionAddToCart';
import SvgIcon from '@/components/SvgIcon';
import ToggleSwitch from '@/components/ToggleSwitch';
import AddSubscriptionModal from '@/components/modals/AddSubscriptionModal';
import useMetaobjects from '@/hooks/useMetaobjects';
import mapFields from '@/utils/mapFields';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import states from 'states-us';
import useLocalStorage from 'use-local-storage';

const SubscriptionItem = ({ item }) => {
  const isIPELabel = item.benefitstatement.indexOf('IPE') > -1;
  const label = item.benefitstatement.replace('IPE', '');

  return (
    <>
      <p className="subscriptions--table-label">
        {isIPELabel && (
          <SvgIcon
            className="mr-1 inline-block text-white"
            width={45}
            name="ipe-logo"
          />
        )}{' '}
        {label}
      </p>
      {window.SubscriptionSettings.products.map((product, i) => {
        return (
          <span
            key={i}
            className={[
              'subscription--lineitem',
              ...(product.isHighlightedSection
                ? ['subscription--lineitem-highlighted']
                : ['bg-primary', 'border-grey-light', 'border-b'])
            ].join(' ')}
          >
            {item[product.type] === true ? (
              <SvgIcon
                className="icon-check mx-auto block"
                name="check"
                strokeWidth={1}
              />
            ) : (
              item[product.type] || ''
            )}
          </span>
        );
      })}
    </>
  );
};

SubscriptionItem.propTypes = {
  item: PropTypes.object
};

const SubscriptionPage = () => {
  const { title, body } = useLoaderData();
  const statesArr = states.reduce((acc, block) => {
      if (!block.territory && block.abbreviation !== 'DC') {
        acc.push(block.abbreviation + ':' + block.name);
      }
      return acc;
    }, []),
    statesKeys = states.reduce((acc, block) => {
      if (!block.territory && block.abbreviation !== 'DC') {
        acc.push(block.abbreviation);
      }
      return acc;
    }, []);
  const metaobjects = useMetaobjects('subscription_benefits', 20);
  const [savedStates] = useLocalStorage('jurisdictionKeys', []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedState, setSelectedState] = useState(statesKeys[0]);
  const [subscriptionBenefits, setSubscriptionBenefits] = useState();
  const [subscriptionInCart, setSubscriptionInCart] = useState();
  const [subscriptionType, setSubscriptionType] = useState('monthly');

  const data = useMemo(() => {
    return metaobjects
      ? metaobjects.reduce(
          (acc, block) => ({
            ...acc,
            [block.handle]: mapFields(block.fields)
          }),
          {}
        )
      : null;
  }, [metaobjects]);

  const defaultSelectedStateIndex = useMemo(() => {
    const savedStateIndex = savedStates.indexOf(selectedState);
    const stateListIndex = statesArr.findIndex((state) => {
      return (
        state.split(':')[1] === selectedState ||
        state.split(':')[0] === selectedState
      );
    });

    if (savedStateIndex > -1) return savedStateIndex;

    return stateListIndex > -1 ? stateListIndex : 0;
  }, [savedStates, selectedState, searchParams, statesKeys]);

  const defaultTypeIndex = useMemo(() => {
    const arr = ['monthly', 'annual'];

    if (searchParams.get('type')) {
      return arr.indexOf(searchParams.get('type'));
    }

    return arr.indexOf(subscriptionType);
  }, [searchParams, subscriptionType]);

  useEffect(() => {
    let jurisdictionQueryParam = searchParams.get(
      `${AlgoliaProductIndexName}[refinementList][meta.course.credits.credit-title-group][0]`
    );

    let newSelectedState;

    if (searchParams.has('state')) {
      const queryParamState = searchParams.get('state');
      const foundState = statesArr.find((state) => {
        return (
          state.split(':')[1] === queryParamState ||
          state.split(':')[0] === queryParamState
        );
      });

      const formattedState = foundState ? foundState.split(':')[1] : 'Alabama';
      newSelectedState = formattedState;
      setSelectedState(formattedState);
    } else if (savedStates.length >= 1) {
      newSelectedState = savedStates[0].split('_')[1].split(' ')[0];
      setSelectedState(newSelectedState);
    } else if (jurisdictionQueryParam) {
      newSelectedState = jurisdictionQueryParam.split('_')[1].split(' ')[0];
      setSelectedState(newSelectedState);
    } else {
      newSelectedState = 'Alabama';
      setSelectedState('Alabama');
    }

    if (searchParams.get('type')) {
      setSubscriptionType(searchParams.get('type'));
    }

    if (data) {
      const sBenefits = JSON.parse(data?.subscription_benefits?.state_benefits) || [];
      const stateBenefits = sBenefits?.statebenefits;

      if (stateBenefits) {
        let matchedBenefits = stateBenefits
          .filter((x) => {
            return x.state === newSelectedState;
          })
          .map((x) => x.benefits)[0];

        if (!matchedBenefits) {
          matchedBenefits = stateBenefits[0].benefits;
        }

        setSubscriptionBenefits(matchedBenefits);
      }
    }
  }, [selectedState, data, searchParams, subscriptionType]);

  return window.SubscriptionSettings ? (
    <div
      className={`
      subscriptions
      ${window.SubscriptionSettings?.page?.backgroundImagePosition}
      ${window.SubscriptionSettings?.page?.backgroundImageSize}
      `}
      style={{
        backgroundImage: `url(${window.SubscriptionSettings?.page?.backgroundImage})`
      }}
    >
      <div className="container xl:gx-xl">
        <h3 className="subscriptions--subtitle">
          {window.SubscriptionSettings?.page?.subtitle}
        </h3>
        <h1 className="subscriptions--title">{title}</h1>
        <p
          className="text-center md:text-left"
          dangerouslySetInnerHTML={{ __html: body }}
        ></p>
        <div className="subscriptions--table">
          <div className="dark-select subscriptions--table-selectbox">
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <SelectDropdown
                id="state-select"
                type="sort"
                label={selectedState}
                defaultOptionIndex={defaultSelectedStateIndex}
                options={statesArr}
                namespace="stateSelect"
                setValFunc={setSelectedState}
                onChangeFunc={(value) => {
                  setSearchParams((prevValue) => {
                    const existingSearchParams = new URLSearchParams(prevValue);
                    if (existingSearchParams.has('state')) {
                      existingSearchParams.set('state', value);
                    } else {
                      existingSearchParams.append('state', value);
                    }

                    if (existingSearchParams.has('type')) {
                      existingSearchParams.set('type', subscriptionType);
                    } else {
                      existingSearchParams.append('type', subscriptionType);
                    }

                    return existingSearchParams.toString();
                  });
                }}
                sortLabel="Viewing: "
              />
              <ToggleSwitch
                options={[
                  {
                    id: 'switchMonthly',
                    name: 'subscriptiontype',
                    value: 'monthly',
                    label: 'Monthly'
                  },
                  {
                    id: 'switchAnnual',
                    name: 'subscriptiontype',
                    value: 'annual',
                    label: 'Annual'
                  }
                ]}
                selectedIndex={defaultTypeIndex}
                setValFunc={setSubscriptionType}
                onChangeFunc={(value) => {
                  setSearchParams((prevValue) => {
                    const existingSearchParams = new URLSearchParams(prevValue);
                    if (existingSearchParams.has('state')) {
                      existingSearchParams.set('state', selectedState);
                    } else {
                      existingSearchParams.append('state', selectedState);
                    }

                    if (existingSearchParams.has('type')) {
                      existingSearchParams.set('type', value);
                    } else {
                      existingSearchParams.append('type', value);
                    }

                    return existingSearchParams.toString();
                  });
                }}
              />
            </div>
          </div>
          {window.SubscriptionSettings?.products &&
            window.SubscriptionSettings.products.map((data, i) => {
              return (
                <div
                  key={i}
                  className={[
                    'subscription--header',
                    ...(data.isHighlightedSection
                      ? ['bg-secondary']
                      : ['bg-primary'])
                  ].join(' ')}
                >
                  {data.badge?.text && (
                    <div className="absolute left-2/4 top-[-0.8rem] translate-x-[-50%]">
                      <Badge color={data.badge.color}>{data.badge.text}</Badge>
                    </div>
                  )}
                  <h4 className="italic text-accent">{data.subHead}</h4>
                  <h4>{data.productTitle}</h4>
                  {data.type !== 'lawfirm' ? (
                    <h4 className="mt-3.5 flex-1">
                      {data[subscriptionType].details?.price}
                      <span className="font-thin text-grey">
                        {subscriptionType === 'monthly' ? '/month' : '/year'}
                      </span>
                    </h4>
                  ) : (
                    <h4 className="mt-3.5 flex-1 font-thin text-grey">
                      Contact Us
                    </h4>
                  )}
                  <p className="mb-7 mt-6 text-fine-print font-normal">
                    { subscriptionType === 'monthly' ? data?.description : ( data?.description2 ? data?.description2 : data?.description ) }
                  </p>
                  {data.type !== 'lawfirm' ? (
                    <SubscriptionAddToCart
                      productData={data}
                      subscriptionType={subscriptionType}
                      setSubscriptionInCart={setSubscriptionInCart}
                    />
                  ) : (
                    <a
                      href={data.url}
                      className="btn btn--accent mx-auto mt-4 flex w-fit items-center gap-2"
                    >
                      {subscriptionType === 'monthly' ? data.cta : (data.cta2 ? data.cta2 : data.cta)}
                      <SvgIcon
                        className="icon-arrow hidden rotate-180 md:block"
                        width={13}
                        name="arrow"
                      />
                    </a>
                  )}
                </div>
              );
            })}

          {subscriptionBenefits &&
            subscriptionBenefits.map((benefit, x) => {
              return <SubscriptionItem key={x} item={benefit} />;
            })}

          <div></div>
          <div className="col-start-1 col-end-3 hidden md:block"></div>
          {window.SubscriptionSettings.products &&
            window.SubscriptionSettings.products.map((data, i) => {
              return (
                <div
                  key={i}
                  className={[
                    'subscription--footer',
                    ...(data.isHighlightedSection
                      ? ['bg-secondary']
                      : ['bg-transparent'])
                  ].join(' ')}
                >
                  <p className="text-fine-print font-normal">{ subscriptionType === 'monthly' ? data?.altText : ( data?.altText2 ? data?.altText2 : data?.altText ) }</p>
                  {data.type !== 'lawfirm' ? (
                    <SubscriptionAddToCart
                      productData={data}
                      subscriptionType={subscriptionType}
                      setSubscriptionInCart={setSubscriptionInCart}
                    />
                  ) : (
                    <a
                      href={data.url}
                      className="btn btn--accent mx-auto mt-4 flex w-fit items-center gap-2"
                    >
                      { subscriptionType === 'monthly' ? data.cta : (data.cta2 ? data.cta2 : data.cta) }
                      <SvgIcon
                        className="icon-arrow hidden rotate-180 md:block"
                        width={13}
                        name="arrow"
                      />
                    </a>
                  )}
                </div>
              );
            })}
        </div>
        {window.SubscriptionSettings?.products &&
          window.SubscriptionSettings.products.map((data, i) => {
            return (
              <div
                key={i}
                className={`my-5 rounded-xl p-6 text-center md:hidden ${data.mobileBackgroundImagePosition}`}
                style={{
                  backgroundImage: `url(${data.mobileBackgroundImage})`
                }}
              >
                <h4 className="italic text-accent">{data.subHead}</h4>
                <h4>{data.productTitle}</h4>
                {data.type !== 'lawfirm' ? (
                  <h4 className="mt-3.5">
                    {data[subscriptionType].details?.price}
                    <span className="font-thin text-grey">
                      {subscriptionType === 'monthly' ? 'month' : 'year'}
                    </span>
                  </h4>
                ) : (
                  <h4 className="mt-3.5 font-thin text-grey">Contact Us</h4>
                )}
                <p className="mb-7 mt-6 text-fine-print font-normal">
                  { subscriptionType === 'monthly' ? data?.description : ( data?.description2 ? data?.description2 : data?.description ) }
                </p>
                {data.type !== 'lawfirm' ? (
                  <SubscriptionAddToCart
                    productData={data}
                    subscriptionType={subscriptionType}
                    setSubscriptionInCart={setSubscriptionInCart}
                  />
                ) : (
                  <a
                    href={data.url}
                    className="btn btn--accent mx-auto mt-4 flex w-fit items-center gap-2"
                  >
                    {subscriptionType === 'monthly' ? data.cta : (data.cta2 ? data.cta2 : data.cta)}
                    <SvgIcon
                      className="icon-arrow hidden rotate-180 md:block"
                      width={13}
                      name="arrow"
                    />
                  </a>
                )}
              </div>
            );
          })}
      </div>
      <AddSubscriptionModal item={subscriptionInCart} />
    </div>
  ) : null;
};

export default SubscriptionPage;
