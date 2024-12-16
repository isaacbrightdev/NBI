import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import useSettings from '@/hooks/useSettings';

const closeBtnClass = [
  'no-underline',
  'whitespace-nowrap',
  'align-middle',
  'select-none',
  'transition-colors',
  'bg-transparent',
  'flex',
  'items-center',
  'justify-center',
  'rounded-full',
  'p-0',
  'text-white',
  'leading-snug',
  'text-sm-body'
];

const dialogPanelClass = [
  'w-full',
  'max-w-[94%]',
  'md:max-w-[43.75rem]',
  'transform',
  'overflow-hidden',
  'rounded-2xl',
  'bg-white',
  'text-left',
  'align-middle',
  'shadow-xl',
  'transition-all'
];

const Modal = ({ name, title, children }) => {
  const { modals, dispatch } = useSettings();

  return (
    modals[name].state && (
      <Transition appear show={modals[name].state} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            dispatch({ type: 'SET_MODAL', data: { name, state: false } })
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-primary opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full max-w-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={dialogPanelClass.join(' ')}>
                  {title && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg flex items-center justify-between bg-primary px-12 py-7 font-medium text-white"
                    >
                      <span>{title}</span>

                      <button
                        type="button"
                        className={closeBtnClass.join(' ')}
                        onClick={() =>
                          dispatch({
                            type: 'SET_MODAL',
                            data: { name, state: false }
                          })
                        }
                        aria-label="Close"
                      >
                        <svg
                          className="select-none"
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M22 3 3 22M3 3l19 19"
                          />
                        </svg>
                      </button>
                    </Dialog.Title>
                  )}
                  <div className="p-6 lg:p-12">{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  );
};

Modal.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any
};

export default Modal;
