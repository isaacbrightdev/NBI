import { flattenConnection, Image } from '@shopify/hydrogen-react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import SvgIcon from '@/components/SvgIcon';
import useRelatedArticles from '@/hooks/useRelatedArticles';

const RelatedArticle = ({ article, handle }) => {
  const date = new Date(article?.publishedAt),
    formattedDate = date.toDateString();

  return article ? (
    <div className="group relative flex h-full min-w-0 flex-col items-stretch break-words rounded-[0.625rem] border border-solid border-grey bg-white bg-clip-border p-5">
      <div className="mb-5">
        {article?.image ? (
          <Image
            className="h-auto rounded-[10px]"
            data={article.image}
            sizes="(min-width: 640px) 360w, 295w"
            aspectRatio="16/9"
          />
        ) : null}
      </div>
      <div className="mb-5 flex gap-x-[15px]">
        <span className="flex items-center gap-[5px] text-[12px] font-medium leading-[15.6px]">
          {article?.author?.value && (
            <>
              <span className="block">
                <SvgIcon name="account" width={15} height={15} />
              </span>
              {article?.author?.value}
            </>
          )}
        </span>
        <span className="flex items-center gap-[5px] text-[12px] font-medium leading-[15.6px]">
          <span className="block">
            <SvgIcon name="calendar" width={15} height={15} />
          </span>
          {formattedDate}
        </span>
      </div>
      <div className="mb-5 min-h-[129px]">
        <a className="text-[16px] leading-[20.8px] text-secondary sm:text-[20px] sm:leading-[26px]">
          {article?.title}
        </a>
        <p className="text-[14px] leading-[18.2px]">
          {'excerpt' in article && article?.excerpt
            ? article?.excerpt
            : article?.content?.slice(0, 300)}
        </p>
      </div>
      <a
        href={`/blogs/${handle}/${article.handle}`}
        className="btn stretched-link mt-auto flex w-fit items-center rounded-[500px] border-accent px-[15px] py-[10px] font-medium text-accent text-black sm:px-[20px]"
      >
        <span className="mr-3 text-[14px] leading-[18.2px] sm:text-[16px] sm:leading-[20.8px]">
          More
        </span>
        <SvgIcon name="arrow" className="rotate-180" width={15} height={15} />
      </a>
    </div>
  ) : null;
};

RelatedArticle.propTypes = {
  article: PropTypes.object,
  handle: PropTypes.string
};

const RelatedArticles = ({ tags, blog, title }) => {
  const tagQuery =
      tags.length > 0 ? tags.map((x) => `(tag:${x})`).join(' OR ') : '',
    query = `-(NOT blog_title:${title}) AND (${tagQuery})`,
    handle = blog.handle,
    data = useRelatedArticles(handle, query);

  const relatedArticles = useMemo(() => {
    return data && data?.articles ? flattenConnection(data.articles) : null;
  }, [data]);

  return relatedArticles && relatedArticles.length > 0 ? (
    <div className="container-fluid xl:gx-xl xl-max:p-0">
      <div className="row">
        <div className="mx-auto mb-[70px] max-w-[828px]">
          <Splide
            hasTrack={false}
            className="splide-horizontal-product-carousel"
            options={{
              perPage: 2,
              gap: '1.5rem',
              pagination: false,
              breakpoints: {
                768: {
                  perPage: 1,
                  fixedWidth: '70%',
                  padding: { left: '1rem', right: '1rem' }
                },
                1024: {
                  padding: { left: '1rem' }
                }
              }
            }}
            aria-label="Related Articles"
          >
            <div className="mb-7 flex flex-shrink-0 items-center justify-between gap-2.5 lg-max:container-fluid lg:gap-4">
              <h3 className="text-h3 lg-max:!text-h3-mobile">
                Related Articles
              </h3>
              <div className="splide__arrows flex items-center gap-2.5 lg:gap-4">
                <button className="splide__arrow splide__arrow--prev !btn--nav !relative !left-auto !translate-y-0">
                  <SvgIcon name="caret-right" />
                </button>
                <button className="splide__arrow splide__arrow--next !btn--nav !relative !right-auto !translate-y-0">
                  <SvgIcon name="caret-right" />
                </button>
              </div>
            </div>
            <SplideTrack>
              {relatedArticles.map((relatedArticle, i) => {
                return (
                  <SplideSlide key={i}>
                    <RelatedArticle article={relatedArticle} handle={handle} />
                  </SplideSlide>
                );
              })}
            </SplideTrack>
          </Splide>
        </div>
      </div>
    </div>
  ) : null;
};

RelatedArticles.propTypes = {
  tags: PropTypes.array,
  blog: PropTypes.object,
  title: PropTypes.any
};

export default RelatedArticles;
