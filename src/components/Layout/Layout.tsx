import { ReactNode } from 'react';
import { useRouter } from 'next/router';

import Header from '../Header/Header';

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <>
      <div>
        <>
          {router.asPath !== '/' && (
            <div className="w-full">
              <Header />
            </div>
          )}
        </>
        <div>
          <div
            className="
          layout-content"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;

