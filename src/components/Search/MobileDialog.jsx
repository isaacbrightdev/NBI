import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

// eslint-disable-next-line no-unused-vars
const MobileDialog = ({ show, onClose, rootRef, children }) => {
  return (
    <Transition unmount={false} show={show} as={Fragment}>
      <Dialog
        unmount={false}
        as="div"
        className="relative z-[1000]"
        onClose={onClose}
        ref={rootRef}
      >
        <Transition.Child
          as={Fragment}
          unmount={false}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex max-h-full flex-col overflow-hidden">
          <div className="flex min-h-full items-stretch justify-center px-0 pb-0 pt-4 text-center">
            <Transition.Child
              as={Fragment}
              unmount={false}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                unmount={false}
                className="flex w-full max-w-full transform flex-col rounded-t-2xl bg-white pb-[82px] text-left align-middle shadow-dropdown transition-all"
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
MobileDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  rootRef: PropTypes.any,
  children: PropTypes.any
};
export default MobileDialog;
