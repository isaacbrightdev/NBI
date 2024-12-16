import PropTypes from 'prop-types';
import Modal from '@/components/Modal';
import CreditsAvailableMenu from '@/components/Search/CreditsAvailableMenu';
import useSettings from '@/hooks/useSettings';
import { AlgoliaFacets } from '@/utils/searchClient';

const CreditsModal = () => {
  const { modals } = useSettings();
  const currentProductCard = modals.credits.product;

  if (!currentProductCard || !modals) return null;

  let islive = false;

  if (currentProductCard?.named_tags?.format) {
    islive = Array.isArray(currentProductCard.named_tags?.format)
      ? currentProductCard.named_tags.format.some(
          (f) =>
            f.toLowerCase() == 'live in-person' ||
            f.toLowerCase() == 'live online'
        )
      : currentProductCard?.named_tags?.format?.toLowerCase() ==
          'live in-person' ||
        currentProductCard?.named_tags?.format?.toLowerCase() == 'live online';
  } else {
    islive = currentProductCard.tags.some(
      (t) =>
        t.toLowerCase() === 'format:live in-person' ||
        t.toLowerCase() === 'format:live online'
    );
  }

  return (
    <Modal name="credits" title="Credits Available">
      {currentProductCard?.meta?.course?.credits?.length === 0 ||
      (undefined && currentProductCard?.variant?.node?.credits?.length === 0) ||
      undefined ? (
        <div className="relative flex w-full items-center bg-white py-2.5">
          There is no credit available on this course.
        </div>
      ) : (
        <>
          <div className="border-light-grey relative flex w-full border-b bg-white py-2.5 text-left no-underline">
            <div
              className={`text-blue-grey text-sm-body font-medium uppercase leading-snug tracking-wide ${
                islive ? 'col-4' : 'col-3 md:col-2'
              }`}
            >
              Credit
            </div>
            <div
              className={`text-blue-grey text-sm-body font-medium uppercase leading-snug tracking-wide ${
                islive ? 'col-4' : 'col-5 md:col-4'
              }`}
            >
              Status
            </div>
            <div
              className={`text-blue-grey text-sm-body font-medium uppercase leading-snug tracking-wide ${
                islive ? 'col-4' : 'col-4 md:col-3'
              }`}
            >
              Total
            </div>
            {!islive && (
              <div
                className={`text-blue-grey col-1 hidden text-sm-body font-medium uppercase leading-snug tracking-wide md:col-3 md:block`}
              >
                Until
              </div>
            )}
          </div>
          <div className="CreditsAvailableComponent max-h-[70vh] overflow-y-auto">
            <CreditsAvailableMenu
              islive={islive}
              attributes={[AlgoliaFacets.CreditsState.attr]}
            />

            <CreditsAvailableMenu
              islive={islive}
              attributes={[AlgoliaFacets.CreditsParalegal.attr]}
            />

            <CreditsAvailableMenu
              islive={islive}
              attributes={[AlgoliaFacets.CreditsOther.attr]}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

CreditsModal.propTypes = {
  open: PropTypes.bool,
  setCreditsModalOpen: PropTypes.func,
  currentProductCard: PropTypes.any
};

export default CreditsModal;
