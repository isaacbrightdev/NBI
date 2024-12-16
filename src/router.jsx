/* eslint-disable react-refresh/only-export-components */
import Layout from '@/Layout';
import articleLoader from '@/loaders/article';
import pageLoader from '@/loaders/page';
import Search from '@/pages/Search';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';

const Home = lazy(() => import('@/pages/Home'));
const Collection = lazy(() => import('@/pages/Collection'));
const Product = lazy(() => import('@/pages/Product'));
const Cart = lazy(() => import('@/pages/Cart'));
const Page = lazy(() => import('@/pages/Page'));
const UIGuide = lazy(() => import('@/pages/UIGuide'));
const Article = lazy(() => import('@/pages/Article'));
const Account = lazy(() => import('@/pages/Account'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <ErrorPage />
      },
      {
        path: '/collections/:handle',
        element: <Collection />,
        errorElement: <ErrorPage />
      },
      {
        path: '/products/:handle',
        element: <Product />,
        errorElement: <ErrorPage />
      },
      {
        path: '/account/*',
        element: <Account />,
        errorElement: <ErrorPage />
      },
      {
        path: '/cart',
        element: <Cart />,
        errorElement: <ErrorPage />
      },
      {
        path: '/pages/ui-guide',
        element: <UIGuide />,
        errorElement: <ErrorPage />
      },
      {
        path: '/pages/:handle',
        element: <Page />,
        loader: pageLoader,
        errorElement: <ErrorPage />
      },
      {
        path: '/pages/:handle/:id', // Needed to support page templates with nested routes like for Faculty Member
        element: <Page />,
        loader: pageLoader,
        errorElement: <ErrorPage />
      },
      {
        path: '/search',
        element: <Search />,
        errorElement: <ErrorPage />
      },
      {
        path: '/blogs/:handle(/tagged/:tag)',
        element: <></>,
        errorElement: <ErrorPage />
      },
      {
        path: '/blogs/:handle/:article',
        element: <Article />,
        loader: articleLoader,
        errorElement: <ErrorPage />
      },
      {
        path: '*',
        element: <></>
      }
    ]
  }
]);

export default router;
