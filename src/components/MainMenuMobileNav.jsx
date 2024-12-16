import { Disclosure } from '@headlessui/react';
import PropTypes from 'prop-types';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';

const MainMenuMobileNav = ({ title, items }) => {
  return (
    <nav className="w-full">
      <ul
        className={['flex', 'flex-col', 'pl-0', 'mb-10', 'list-none'].join(' ')}
      >
        <li>
          <div
            className={[
              'border-t',
              'border-t-secondary',
              'border-solid',
              'pt-[0.937rem]',
              'mb-5',
              'text-secondary',
              'font-medium',
              'text-sm-body',
              'leading-[130%]',
              'flex',
              'items-center',
              'tracking-widest',
              'uppercase'
            ].join(' ')}
          >
            {title}
          </div>

          <ul
            className={['flex', 'flex-col', 'pl-0', 'mb-0', 'list-none'].join(
              ' '
            )}
          >
            {items.map((item) => {
              const hasSubItems = item?.items.length > 0;
              if (hasSubItems) {
                return (
                  <Disclosure as="li" key={item.id}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={[
                            'flex',
                            'items-center',
                            'py-2.5',
                            'font-normal',
                            'no-underline',
                            'bg-none',
                            'border-0',
                            'transition-colors',
                            'text-h4',
                            'leading-[130%]',
                            'text-white',
                            'w-full',
                            '!text-left'
                          ].join(' ')}
                        >
                          <span className="flex-grow">{item.title}</span>

                          <SvgIcon
                            className={`flex-shrink-0 transition-transform ${
                              open ? '-rotate-180 transform' : ''
                            }`}
                            name="caret-down"
                            width={15}
                            height={15}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mb-4 rounded-xl bg-white/10 px-6 py-4">
                          {item?.items.map((menuItem) => (
                            <div key={menuItem.id}>
                              <Link
                                className={[
                                  'block',
                                  'py-2.5',
                                  'font-normal',
                                  'no-underline',
                                  'bg-none',
                                  'border-0',
                                  'transition-colors',
                                  'text-h4',
                                  'leading-[130%]',
                                  'text-white'
                                ].join(' ')}
                                to={menuItem.url.replace(
                                  `https://${
                                    import.meta.env.VITE_PUBLIC_STORE_DOMAIN
                                  }`,
                                  ''
                                )}
                              >
                                {menuItem.title}
                              </Link>
                            </div>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                );
              }

              return (
                <li key={item.id}>
                  <Link
                    className={[
                      'block',
                      'py-2.5',
                      'font-normal',
                      'no-underline',
                      'bg-none',
                      'border-0',
                      'transition-colors',
                      'text-h4',
                      'leading-[130%]',
                      'text-white'
                    ].join(' ')}
                    to={item.url.replace(
                      `https://${import.meta.env.VITE_PUBLIC_STORE_DOMAIN}`,
                      ''
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

MainMenuMobileNav.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      to: PropTypes.string
    })
  )
};

export default MainMenuMobileNav;
