import log from 'loglevel';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  log.error(error);

  return (
    <div id="error-page" className="container">
      <div className="row justify-center">
        <div className="col-10">
          <h1>Sorry!</h1>
          <p>An unexpected error has occurred.</p>
          {import.meta.env.DEV && (
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
