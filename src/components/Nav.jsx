import Image from '@/components/Image';
import Link from '@/components/Link';
import MainMenuMobileNav from '@/components/MainMenuMobileNav';
import NavSearchWrapper from '@/components/Search/NavSearchWrapper';
import Account from '@/components/svg/Account';
import CartIcon from '@/components/svg/CartIcon';
import NavMenu from '@/components/svg/Menu';
import SearchIcon from '@/components/svg/SearchIcon';
import useAuthLink from '@/hooks/useAuthLink';
import useCustomer from '@/hooks/useCustomer';
import useOnWindowScroll from '@/hooks/useOnWindowScroll';
import useScreens from '@/hooks/useScreens';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useCart } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MenuItemDivider = ({ ...rest }) => <div {...rest}></div>;

const Nav = ({ main, account, firm, support, settings, isShortNav }) => {
  const styles = {
    links: `text-primary leading-snug text-sm-body`,
    mobileLink: `block border-0 bg-none font-normal text-white underline transition-colors py-2.5 text-[1rem] leading-[130%]`,
    menuItem: `flex w-full items-center border-0 px-9 text-sm transition-colors py-1.5 group text-primary focus::bg-grey-light hover:bg-grey-light hover:text-secondary focus:text-secondary active:bg-grey-light active:text-secondary`,
    menuItemBordered: `mt-4 border-t border-solid pt-4 border-t-grey`,
    menuButton: `no-underline whitespace-nowrap align-middle select-none transition-colors bg-accent flex items-center justify-center rounded-full p-2.5`,
    loggedInMenuButton: `no-underline whitespace-nowrap select-none transition-colors bg-accent rounded-full`,
    logo: `max-w-full h-[25px]`,
    noCLick: `pointer-events-none flex-shrink-0`,
    transition: {
      enter: `transition-all`,
      enterFrom: `opacity-100`,
      enterTo: `opacity-100`,
      leave: `transition-all`,
      leaveFrom: `opacity-100`,
      leaveTo: `opacity-100`
    },
    menuTransition: {
      enter: `transition ease-out duration-100`,
      enterFrom: `transform opacity-0 scale-95`,
      enterTo: `transform opacity-100 scale-100`,
      leave: `transition ease-in duration-75`,
      leaveFrom: `transform opacity-100 scale-100`,
      leaveTo: `transform opacity-0 scale-95`
    }
  };

  const accountRef = useRef(null);
  const ref = useRef(null);
  const supportRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const { isDesktop } = useScreens();
  const { items, itemsCount } = main;
  const { totalQuantity, lines, linesRemove } = useCart();
  const authLink = useAuthLink(settings?.auth_link);
  const announcementEl = document.querySelector('#announcement-bar');
  const [isPageScrolled, setPageScrolled] = useState(
    window.scrollY >=
      Math.floor(announcementEl.getBoundingClientRect().height + 5)
  );
  const hasMobileLogo = settings.logo_mobile.length > 0;

  const getIconSize = () => (isDesktop ? '25' : '20');

  const [theCartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setCartCount(totalQuantity);

    const handlePopState = () => {
      setCartCount(totalQuantity);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, totalQuantity])

  useEffect(() => {
    setCartCount(totalQuantity);
  }, [])



  useOnWindowScroll(() => {
    setPageScrolled(
      window.scrollY >=
        Math.floor(announcementEl.getBoundingClientRect().height + 5)
    );
  });

  const customer = useCustomer();
  let customerInitials = '';

  if (customer) {
    customerInitials =
      customer.first_name?.charAt(0) + customer.last_name?.charAt(0) ||
      customer.email.charAt(0);
  }

  const [account_url, setCxAccountUrl] = useState('');

  useEffect(() => {
    if (account?.items && account.items.length > 0) {
      const accountUrl = account.items[0].url.replace(
        `https://${import.meta.env.VITE_PUBLIC_STORE_DOMAIN}`,
        ''
      );
      setCxAccountUrl(accountUrl);
    }
  }, [account]);

  if (isDesktop && isMenuOpen) {
    setMenuOpen(false);
  }

  const handleLogout = (event) => {
    event.preventDefault();

    localStorage.setItem('sessioncart', '[]');
    localStorage.setItem('refreshcart', 'false');

    if(lines){
      const lineItemIds = lines.map((item) => item.id);

      linesRemove(lineItemIds);
    }

    window.location.href = event.currentTarget.href;
  };

  return itemsCount ? (
    <nav className="bg-primary py-5 text-white xl:py-4 min-h-[80px] xl:min-h-[90px]">
      <div
        className={[
          'flex',
          'max-w-screen-2xl',
          'items-start',
          'justify-between',
          'container-fluid',
          'gx-sm',
          'xl:gx-xl',
          !isShortNav && isPageScrolled ? 'xl:items-center' : ''
        ].join(' ')}
      >
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          type="button"
          className={[
            'flex',
            'items-center',
            'justify-center',
            'rounded-full',
            'p-2',
            'bg-accent',
            'xl:hidden'
          ].join(' ')}
        >
          <NavMenu width="20" className="block text-accent-text-color" />
        </button>

        <Link
          className={[
            'xl-max:absolute',
            'xl-max:left-2/4',
            'flex',
            'xl-max:-translate-x-2/4',
            'select-none',
            'items-center',
            'whitespace-nowrap',
            'align-middle',
            'text-white',
            'no-underline',
            'transition-colors',
            'h-[35px]'
          ].join(' ')}
          to="/"
        >
          {settings.logo && isDesktop && (
            <Image
              className={`${styles.logo} xl:h-[35px]`}
              id={settings.logo}
            />
          )}

          {hasMobileLogo && !isDesktop && (
            <Image className={`${styles.logo}`} id={settings.logo_mobile} />
          )}
        </Link>

        <div
          className={`col relative hidden flex-col xl:flex ${
            isDesktop ? '' : '!hidden'
          }`}
        >
          <ul
            className={[
              'flex',
              'items-center',
              'xl:col',
              'xl:justify-evenly',
              !isShortNav && isPageScrolled
                ? 'pointer-events-none absolute opacity-0'
                : ''
            ].join(' ')}
          >
            {items.map((item) => {
              const hasSubItems = item?.items.length > 0;
              if (hasSubItems) {
                return (
                  <Menu
                    key={item.id}
                    as="li"
                    className="relative inline-block text-left text-callout"
                  >
                    {({ open }) => (
                      <>
                        <Menu.Button
                          className={[
                            'border-b-[3px]',
                            'border-b-solid',
                            'border-b-transparent',
                            'px-1',
                            'py-3',
                            'whitespace-nowrap',
                            'text-white',
                            'font-medium',
                            'leading-snug',
                            'flex',
                            'items-center',
                            'tracking-widest',
                            'text-sm',
                            'uppercase',
                            'no-underline',
                            'align-middle',
                            'select-none',
                            'transition-colors',
                            open && '!border-b-accent'
                          ].join(' ')}
                        >
                          {item.title}
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter={`${styles.menuTransition.enter}`}
                          enterFrom={`${styles.menuTransition.enterFrom}`}
                          enterTo={`${styles.menuTransition.enterTo}`}
                          leave={`${styles.menuTransition.leave}`}
                          leaveFrom={`${styles.menuTransition.leaveFrom}`}
                          leaveTo={`${styles.menuTransition.leaveTo}`}
                        >
                          <Menu.Items
                            className={[
                              'absolute',
                              'left-0',
                              'mt-3',
                              'w-56',
                              'origin-top-left',
                              'overflow-hidden',
                              'bg-white',
                              'py-6',
                              'ring-1',
                              'ring-black',
                              'ring-opacity-5',
                              'rounded-[20px]',
                              'shadow-dropdown',
                              'focus:outline-none',
                              'z-10'
                            ].join(' ')}
                          >
                            {item?.items.map((menuItem) => (
                              <Menu.Item key={menuItem.id} as={Fragment}>
                                <div ref={ref}>
                                  <Link
                                    className={`${styles.menuItem}`}
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
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                );
              }
              return (
                <li key={item.id} className="text-callout">
                  <Link
                    className={[
                      'flex',
                      'select-none',
                      'items-center',
                      'whitespace-nowrap',
                      'border-b-transparent',
                      'px-1',
                      'py-3',
                      'align-middle',
                      'text-sm',
                      'font-medium',
                      'uppercase',
                      'leading-snug',
                      'tracking-widest',
                      'text-white',
                      'no-underline',
                      'transition-colors',
                      'border-b-[3px]',
                      'border-b-solid'
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
          {!window?._disableNavSearch && (
            <div
              className={`${
                isShortNav ? (isSearchOpen ? 'flex' : 'hidden') : 'flex'
              } items-center justify-center px-8 text-primary`}
            >
              <NavSearchWrapper />
            </div>
          )}
        </div>

        {!isDesktop && isMenuOpen && (
          <>
            <Transition appear show={isMenuOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setMenuOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-primary bg-opacity-50" />
                </Transition.Child>

                <div
                  className={[
                    'fixed',
                    'top-0',
                    'bottom-0',
                    'left-0',
                    'flex',
                    'w-full',
                    'max-w-full',
                    'flex-col',
                    'bg-clip-padding',
                    'outline-0',
                    'lg:w-[400px]'
                  ].join(' ')}
                >
                  <div className="flex min-h-full">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="-translate-x-full"
                      enterTo="translate-x-0"
                      leave="ease-in duration-200"
                      leaveFrom="translate-x-0"
                      leaveTo="-translate-x-full"
                    >
                      <Dialog.Panel
                        className={[
                          'flex',
                          'w-full',
                          'flex-grow',
                          'transform',
                          'flex-col',
                          'overflow-hidden',
                          'overflow-y-auto',
                          'text-left',
                          'transition-all',
                          'bg-primary',
                          'p-[1.875rem]'
                        ].join(' ')}
                      >
                        <button
                          type="button"
                          className={[
                            'flex',
                            'select-none',
                            'items-center',
                            'justify-center',
                            'whitespace-nowrap',
                            'rounded-full',
                            'bg-transparent',
                            'p-0',
                            'align-middle',
                            'leading-snug',
                            'text-white',
                            'no-underline',
                            'transition-colors',
                            'mb-[1.875rem]',
                            'text-sm-body',
                            'self-end'
                          ].join(' ')}
                          onClick={() => setMenuOpen(false)}
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

                        {customer && (
                          <div className="pb-[1.875rem]">
                            <a
                              href={account_url}
                              className={[
                                'flex',
                                'select-none',
                                'items-center',
                                'bg-white',
                                'p-5',
                                'rounded-[20px]',
                                'shadow-dropdown'
                              ].join(' ')}
                            >
                              <div className={styles.noCLick}>
                                <div
                                  className={[
                                    'flex',
                                    'select-none',
                                    'items-center',
                                    'justify-center',
                                    'whitespace-nowrap',
                                    'rounded-full',
                                    'p-3',
                                    'align-middle',
                                    'leading-snug',
                                    'no-underline',
                                    'transition-colors',
                                    'bg-accent',
                                    'text-accent-text-color',
                                    'text-sm-body'
                                  ].join(' ')}
                                >
                                  <Account
                                    height="25"
                                    className="block text-accent-text-color"
                                    isCustomerLoggedIn={!!customer}
                                  />
                                </div>
                              </div>
                              <div className="mx-2.5 flex-grow overflow-hidden text-ellipsis whitespace-nowrap break-words">
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-medium text-primary">
                                  {customer.first_name.length > 0 &&
                                    customer.first_name}

                                  {customer.first_name.length === 0 &&
                                    customer.email}
                                </div>
                                <div className="text-sm-body font-normal text-grey-dark">
                                  View Account
                                </div>
                              </div>
                              <div className={styles.noCLick}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="26"
                                  aria-hidden="true"
                                  focusable="false"
                                  className="fill-none"
                                >
                                  <path
                                    className="stroke-accent-text-color"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12.75h19.5M17.252 18l5.25-5.25-5.25-5.25"
                                  />
                                </svg>
                              </div>
                            </a>
                          </div>
                        )}

                        <MainMenuMobileNav
                          title={main?.title}
                          items={main?.items}
                        />

                        {customer && (
                          <>
                            <MainMenuMobileNav
                              title={account?.title}
                              items={account?.items}
                            />

                            <MainMenuMobileNav
                              title={support?.title}
                              items={support?.items}
                            />
                            <Link
                              className={styles.mobileLink}
                              to={settings.log_out_url}
                              onClick={handleLogout}
                            >
                              Log Out
                            </Link>
                          </>
                        )}

                        {!customer && (
                          <>
                            <Link className={styles.mobileLink} to={authLink}>
                              Log In
                            </Link>
                            <Link
                              className={styles.mobileLink}
                              to={settings.sign_up_url || settings.auth_link}
                            >
                              Sign Up
                            </Link>
                          </>
                        )}
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        )}

        <div className="flex items-center gap-2.5">
          {isDesktop && (
            <>
              <Menu
                key="div"
                className="relative inline-block text-left text-callout"
              >
                {({ open }) => (
                  <div>
                    {customer && (
                      <Menu.Button
                        className={`${styles.loggedInMenuButton} text-sm-body leading-snug text-primary ${open && '!border-b-accent'}`}
                      >
                        {customerInitials && (
                          <span className="profile__badge h-[50px] w-[50px] text-h4-mobile lg:text-h4">
                            {customerInitials}
                          </span>
                        )}
                      </Menu.Button>
                    )}
                    {!customer && (
                      <Link
                        className={`${styles.menuButton} ml-1 h-full text-sm-body font-semibold leading-snug text-accent-text-color xl:p-3`}
                        to={authLink}
                      >
                        <Account
                          height={getIconSize()}
                          className="block text-accent-text-color"
                          isCustomerLoggedIn={!!customer}
                        />
                      </Link>
                    )}

                    <Transition
                      as={Fragment}
                      enter={`${styles.menuTransition.enter}`}
                      enterFrom={`${styles.menuTransition.enterFrom}`}
                      enterTo={`${styles.menuTransition.enterTo}`}
                      leave={`${styles.menuTransition.leave}`}
                      leaveFrom={`${styles.menuTransition.leaveFrom}`}
                      leaveTo={`${styles.menuTransition.leaveTo}`}
                    >
                      <Menu.Items
                        className={[
                          'absolute',
                          'overflow-hidden',
                          'rounded-[20px]',
                          'py-6',
                          'right-0',
                          'mt-3',
                          'w-[260px]',
                          'origin-top-left',
                          'bg-white',
                          '!shadow-dropdown',
                          'focus:outline-none'
                        ].join(' ')}
                      >
                        {customer && (
                          <>
                            {settings.picks_for_you_text && (
                              <Menu.Item>
                                <div>
                                  <Link
                                    className={`${styles.menuItem}`}
                                    to={settings.picks_for_you_url}
                                  >
                                    <span
                                      className={[
                                        'inline-block',
                                        'whitespace-nowrap',
                                        'text-center',
                                        'align-baseline',
                                        'font-medium',
                                        'leading-none',
                                        'text-[0.75rem]',
                                        'mr-2.5',
                                        'bg-error-light',
                                        'text-error',
                                        'px-[0.65em]',
                                        'py-[0.35em]',
                                        'rounded-[5px]'
                                      ].join(' ')}
                                    >
                                      New
                                    </span>
                                    {settings.picks_for_you_text}
                                  </Link>
                                </div>
                              </Menu.Item>
                            )}

                            {firm && customer?.tags?.includes('FirmAdmin') && (
                              <>
                                <Menu.Item>
                                  <div>
                                    <MenuItemDivider
                                      className={`pointer-events-none ${styles.menuItemBordered}`}
                                    />
                                  </div>
                                </Menu.Item>
                                {firm?.items?.map((menuItem) => (
                                  <Menu.Item key={menuItem.id} as={Fragment}>
                                    <div ref={accountRef}>
                                      <Link
                                        className={`${styles.menuItem}`}
                                        to={menuItem.url.replace(
                                          `https://${
                                            import.meta.env
                                              .VITE_PUBLIC_STORE_DOMAIN
                                          }`,
                                          ''
                                        )}
                                      >
                                        {menuItem.title}
                                      </Link>
                                    </div>
                                  </Menu.Item>
                                ))}
                              </>
                            )}

                            <Menu.Item>
                              <div>
                                <MenuItemDivider
                                  className={`pointer-events-none ${styles.menuItemBordered}`}
                                />
                              </div>
                            </Menu.Item>

                            {account?.items?.map((menuItem) => (
                              <Menu.Item key={menuItem.id} as={Fragment}>
                                <div ref={accountRef}>
                                  <Link
                                    className={`${styles.menuItem}`}
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
                              </Menu.Item>
                            ))}

                            <Menu.Item>
                              <div>
                                <MenuItemDivider
                                  className={`pointer-events-none ${styles.menuItemBordered}`}
                                />
                              </div>
                            </Menu.Item>

                            {support?.items?.map((menuItem) => (
                              <Menu.Item key={menuItem.id} as={Fragment}>
                                <div ref={supportRef}>
                                  <Link
                                    className={`${styles.menuItem}`}
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
                              </Menu.Item>
                            ))}

                            <Menu.Item>
                              <div className={`${styles.menuItemBordered}`}>
                                <Link
                                  className={`${styles.menuItem}`}
                                  to={settings.log_out_url}
                                  onClick={handleLogout}
                                >
                                  Log Out
                                </Link>
                              </div>
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Items>
                    </Transition>
                  </div>
                )}
              </Menu>
            </>
          )}
          {!window?._disableNavSearch && isShortNav && (
            <button
              type="button"
              className={`${styles.links} ${styles.menuButton} xl:p-3`}
              onClick={() => setSearchOpen(!isSearchOpen)}
            >
              <SearchIcon height={getIconSize()} className="block" />
            </button>
          )}
          <Link
            to="/cart"
            className={`${styles.links} ${styles.menuButton} text-accent-text-color xl:px-5 xl:py-3`}
          >
            <CartIcon
              height={getIconSize()}
              className="block text-accent-text-color"
            />
            <span
              className={[
                'ml-1',
                'font-semibold',
                'xl:inline-block',
                'text-accent-text-color'
              ].join(' ')}
            >
               {theCartCount ? theCartCount : 0}{' '}
               {isDesktop ? (theCartCount == 1 ? 'Course' : 'Courses') : ''}
            </span>
          </Link>
        </div>
      </div>
      {!isDesktop && !window?._disableNavSearch && (
        <div
          className={`container-fluid ${
            isShortNav
              ? isSearchOpen
                ? 'absolute inset-x-0 top-0 flex py-2'
                : '!hidden'
              : 'pt-3'
          }`}
        >
          <NavSearchWrapper />
          {isShortNav && isSearchOpen && (
            <div
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="fixed inset-0 z-[-1] h-full w-full overflow-y-auto overflow-x-hidden"
            ></div>
          )}
        </div>
      )}
    </nav>
  ) : null;
};

Nav.propTypes = {
  main: PropTypes.any,
  account: PropTypes.any,
  firm: PropTypes.any,
  support: PropTypes.any,
  settings: PropTypes.shape({
    logo: PropTypes.string,
    logo_mobile: PropTypes.string,
    auth_link: PropTypes.string,
    picks_for_you_text: PropTypes.string,
    picks_for_you_url: PropTypes.string,
    account_url: PropTypes.string,
    support_url: PropTypes.string,
    log_out_url: PropTypes.string,
    sign_up_url: PropTypes.string
  }),
  isShortNav: PropTypes.bool
};

export default Nav;
