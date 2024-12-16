import PropTypes from 'prop-types';
import FooterNav from '@/components/FooterNav';
import FooterSocialMediaLinks from '@/components/FooterSocialMediaLinks';
import Image from '@/components/Image';
import Link from '@/components/Link';
import useSettings from '@/hooks/useSettings';
import SvgIcon from '../components/SvgIcon';

const Footer = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const {
    footer_external_link,
    footer_external_link_logo,
    footer_external_link_title,
    footer_external_link_text,
    email_capture_form_id
  } = useSettings();
  const emailCaptureSource = `https://formbuilder.hulkapps.com/corepage/customform?id=${email_capture_form_id}&referrer_url=https://${
    import.meta.env.VITE_PUBLIC_STORE_DOMAIN
  }/`;

  return (
    <div className="footer bg-primary pt-11">
      <div className="relative px-6">
        <div className="gap-4 md:flex">
          <div className="grid w-full grid-cols-1 gap-4 md:w-3/5 md:grid-cols-2 lg:w-8/12 lg:grid-cols-4">
            {data.footer &&
              data.footer.items.map((menu) => (
                <FooterNav key={menu.id} menu={menu} />
              ))}
          </div>

          <div
            className={`mt-[30px] w-full border-0 border-t border-solid border-secondary pt-[45px] text-center md:mt-0 ${
              !email_capture_form_id && 'md:h-[450px]'
            } md:w-2/5 md:border-l md:border-t-0 md:pb-[82px] md:pl-[2.5vw] md:pt-0 md:text-left lg:w-4/12`}
          >
            {email_capture_form_id && (
              <iframe
                src={emailCaptureSource}
                title="Email Capture"
                width="100%"
                height={420}
              ></iframe>
            )}
            <FooterSocialMediaLinks />
          </div>
        </div>

        {footer_external_link && (
          <Link
            to={footer_external_link}
            className="mx-auto my-[30px] flex w-fit items-center justify-center gap-3 rounded-lg bg-white p-5 text-primary md:mx-0 lg:absolute lg:bottom-0"
          >
            {footer_external_link_logo && (
              <Image
                className="!md:w-[88.82px] !w-[63.44px]"
                id={footer_external_link_logo}
              />
            )}

            <span className="flex-1 leading-none md:leading-tight">
              {footer_external_link_title && (
                <strong className="text-fine-print leading-none md:text-h4-mobile">
                  {footer_external_link_title}
                </strong>
              )}
              {footer_external_link_text && (
                <span className="hidden text-sm-body font-normal md:block">
                  {footer_external_link_text}
                </span>
              )}
            </span>
            <SvgIcon
              width={19.5}
              height={10.5}
              className="icon-arrow rotate-180"
              name="arrow"
            />
          </Link>
        )}
      </div>
      <div className="footer__bottom mt-[50px] items-center justify-between gap-4 border-t border-solid border-secondary px-6 py-[34px] md:flex">
        <div className="items-center justify-between gap-4 md:flex">
          <Link to="/">
            <Image className="h-[25px]" id={data.settings.logo_mobile} />
          </Link>
          <p className="pb-[30px] pt-[20px] text-center text-fine-print text-white md:pb-0 md:pt-0">
            Copyright &copy; {currentYear} National Business Institute. All
            Rights Reserved.
          </p>
        </div>
        <FooterNav menu={data.footerPolicies} displayHorizontally={true} />
      </div>
    </div>
  );
};

Footer.propTypes = {
  data: PropTypes.shape({
    footer: PropTypes.any,
    footerPolicies: PropTypes.any,
    settings: PropTypes.object
  })
};

export default Footer;
