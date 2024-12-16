import { useLoaderData } from 'react-router-dom';
import RelatedArticles from '@/components/RelatedArticles';

const Article = () => {
  const article = useLoaderData();

  return article?.tags && article?.blog && article?.title ? (
    <RelatedArticles
      tags={article.tags}
      blog={article.blog}
      title={article.title}
    />
  ) : null;
};

export default Article;
