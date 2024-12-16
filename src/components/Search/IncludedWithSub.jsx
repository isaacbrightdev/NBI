import { Switch } from '@headlessui/react';
import log from 'loglevel';
import { Fragment, useMemo } from 'react';
import { useRefinementList } from 'react-instantsearch';
import useCustomer from '@/hooks/useCustomer';
import { AlgoliaFacets } from '@/utils/searchClient';

const eventMap = {
  all: 'allinclusive',
  ondemand: 'ondemand'
};

const IncludedWithSub = () => {
  const { refine, canRefine, items } = useRefinementList({
    attribute: AlgoliaFacets.IncludedWithSub.attr
  });

  const customer = useCustomer();

  const subscription = customer?.metafields?.subscriptions?.details ?? false;
  const subscriptionType = eventMap[subscription['sub-type']] ?? 'none';
  const now = Date.now();
  const expiration =
    subscription && 'expiration-timestamp' in subscription
      ? subscription['expiration-timestamp'] * 1000
      : 0;
  const isExpired = expiration < now;

  const isRefined = useMemo(
    () => items.find((item) => item.isRefined) !== undefined,
    [items]
  );

  const handleChange = () => {
    try {
      if (!canRefine) return;

      refine(subscriptionType);
    } catch (error) {
      log.error('Error refining for customer subs', error);
    }
  };

  if (!customer || isExpired) return <></>;

  return (
    <div className="mb-3 flex items-center">
      <Switch checked={isRefined} onChange={handleChange} as={Fragment}>
        {({ checked, disabled }) => (
          <button
            className={[
              'group inline-flex h-6 w-11 items-center rounded-full',
              checked ? 'bg-primary' : 'bg-gray-200',
              disabled && 'cursor-not-allowed opacity-50'
            ].join(' ')}
          >
            <span
              className={`size-4 rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        )}
      </Switch>
      <p className="ml-2">Included with My Subscription</p>
    </div>
  );
};

export default IncludedWithSub;
