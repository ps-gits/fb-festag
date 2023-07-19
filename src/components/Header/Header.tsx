import Link from 'next/link';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faSearch, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import {
  setNewsInDetail,
  setReadNewsInDetails,
  setFurtherInformation,
} from 'src/redux/reducer/Sitecore';
import { RootState } from 'src/redux/store';
import { getSitecoreContent } from 'src/redux/action/Sitecore';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ref = useRef<HTMLUListElement>();
  let prevScrollpos = window.scrollY;
  window.onscroll = function () {
    const currentScrollPos = window.scrollY;
    const navbar = document.getElementById('navbar');
    if (prevScrollpos > currentScrollPos && navbar !== null) {
      navbar.style.top = '0';
    } else if (navbar !== null) {
      navbar.style.top = '-50px';
    }
    prevScrollpos = currentScrollPos;
  };

  const newsInDetails = useSelector((state: RootState) => state?.sitecore?.newsInDetail);
  const headerContent = useSelector((state: RootState) => state?.sitecore?.header?.fields);
  const readNewsInDetails = useSelector((state: RootState) => state?.sitecore?.readNewsInDetails);

  const [navbar, setNavbar] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: { target: Node | null | EventTarget }) => {
      if (
        ref.current !== undefined &&
        ref.current?.contains !== undefined &&
        !ref.current?.contains(event.target as Node)
      ) {
        setTimeout(() => {
          setSearchText('');
        }, 500);
        setNavbar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return document.removeEventListener('mouseup', handleClickOutside);
  }, [ref]);

  useEffect(() => {
    if (readNewsInDetails !== undefined && readNewsInDetails && newsInDetails !== undefined) {
      dispatch(setNewsInDetail([]));
      dispatch(setFurtherInformation([]));
      dispatch(setReadNewsInDetails(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (headerContent === undefined) {
      dispatch(getSitecoreContent('Header') as unknown as AnyAction);
    }
  }, [dispatch, headerContent]);

  const headerSearch = (fieldName: string) => {
    return (
      (searchText?.length > 2 &&
        getFieldName(headerContent, fieldName)
          ?.toLowerCase()
          ?.replaceAll(/\s/g, '')
          ?.includes(searchText?.toLowerCase()?.replaceAll(/\s/g, ''))) ||
      ((searchText?.length === 0 || searchText?.length < 3) && true)
    );
  };

  return (
    <div>
      <nav className=" z-50 bg-white fixed w-full  shadow-md">
        <div>
          <div className="flex items-center justify-between py-1 xl:px-0 w-5/6 m-auto  xl:h-20 xs:h-20">
            <div className="flex items-center justify-between w-full">
              <div>
                <Link href="/" className="flex items-center">
                  <Image
                    className="w-100 h-90 object-cover"
                    src={getImageSrc(headerContent, 'logo')}
                    alt=""
                    width={100}
                    height={90}
                  />
                </Link>
              </div>
              <ul className="xl:not-sr-only xs:sr-only">
                <div className="flex justify-between xl:w-full xl:m-auto place-items-center pt-1">
                  <div className="xl:flex xl:gap-10 xs:block items-center ">
                    <li>
                      <Link href="/" className="block text-black text-sm " aria-current="page">
                        {getFieldName(headerContent, 'home')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'destinations')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-sm "
                      >
                        {getFieldName(headerContent, 'destinations')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'experience')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-sm "
                      >
                        {getFieldName(headerContent, 'experience')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'resorts')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-sm "
                      >
                        {getFieldName(headerContent, 'resorts')}
                      </Link>
                    </li>
                  </div>
                </div>
              </ul>
              <div className="flex items-center">
                <div className="xl:not-sr-only xs:sr-only">
                  <button
                    type="submit"
                    className="text-white bg-lightorange   font-medium rounded-full text-base px-4 py-3"
                  >
                    {getFieldName(headerContent, 'bookNowButton')}
                  </button>
                </div>
                <div>
                  <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="border inline-flex items-center pl-4 ml-3 text-sm text-gray-500 z-50 rounded-md:hidden text-white h-10"
                    aria-controls="navbar-default"
                    aria-expanded="true"
                    onClick={() => setNavbar(!navbar)}
                  >
                    {navbar == false ? (
                      <FontAwesomeIcon
                        icon={faBars}
                        aria-hidden="true"
                        className="text-xl text-black"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faXmark}
                        aria-hidden="true"
                        className="text-xl text-white close-icon"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <ul
              className={`fixed xs:fixed top-0 xl:mt-0 xs:right-0 z-50 xl:h-screen xs:h-screen bg-black  xl:block text-black  ease-in-out duration-500 xl:justify-end header-index md:w-1/4 sidebar
                ${
                  navbar
                    ? 'xs:translate-x-0  xl:translate-x-0 xs:w-9/12 xl:w-1/4'
                    : 'xs:translate-x-full xl:w-0 xl:translate-x-0'
                }`}
              id="navbar-default"
              ref={ref as LegacyRef<HTMLUListElement>}
            >
              <div className="flex xl:w-5/6 xl:m-auto place-items-center pt-1 xl:px-2 xs:px-5">
                <div className="xl:block xl:gap-10 xs:flex xs:flex-col pt-20 w-full">
                  {headerSearch('destinations') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'destinations')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                        aria-current="page"
                      >
                        {getFieldName(headerContent, 'destinations')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('experience') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'experience')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'experience')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('resorts') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'resorts')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'resorts')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('company') && (
                    <li>
                      <div className="bg-black w-full py-2">
                        <details className="flex">
                          <summary className="flex text-white text-sm">
                            <div className="flex items-center gap-2  cursor-pointer">
                              <div className="text-sm">
                                {getFieldName(headerContent, 'company')}
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faAngleDown}
                                  aria-hidden="true"
                                  className="text-sm text-white close-icon"
                                />
                              </div>
                            </div>
                          </summary>
                          <div className="pt-2">
                            <div className="py-1">
                              <p className=" text-Silvergray text-xs cursor-pointer">
                                <Link
                                  href={`/${getFieldName(headerContent, 'company')
                                    ?.toLowerCase()
                                    ?.replace(/\s/g, '')}/${getFieldName(
                                    headerContent,
                                    'companyDropdownItem1'
                                  )
                                    ?.toLowerCase()
                                    ?.replace(/\s/g, '')}`}
                                >
                                  {getFieldName(headerContent, 'companyDropdownItem1')}
                                </Link>
                              </p>
                            </div>
                            <div className="py-1">
                              <p className=" text-Silvergray text-xs  cursor-pointer">
                                <Link
                                  href={`/${getFieldName(headerContent, 'company')
                                    ?.toLowerCase()
                                    ?.replace(/\s/g, '')}/${getFieldName(
                                    headerContent,
                                    'companyDropdownItem2'
                                  )
                                    ?.toLowerCase()
                                    ?.replace(/\s/g, '')}`}
                                >
                                  {getFieldName(headerContent, 'companyDropdownItem2')}
                                </Link>
                              </p>
                            </div>
                            <div className="py-1">
                              <p className=" text-Silvergray text-xs  cursor-pointer ">
                                {getFieldName(headerContent, 'companyDropdownItem3')}
                              </p>
                            </div>
                            <div className="py-1">
                              <p className=" text-Silvergray text-xs  cursor-pointer">
                                {getFieldName(headerContent, 'companyDropdownItem4')}
                              </p>
                            </div>
                          </div>
                        </details>
                      </div>
                    </li>
                  )}
                  {headerSearch('mediaCenter') && (
                    <li>
                      <Link href="#" className="block text-white text-sm py-2 ">
                        {getFieldName(headerContent, 'mediaCenter')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('sustainability') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'sustainability')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'sustainability')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('careers') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'careers')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'careers')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('faqs') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'faqs')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'faqs')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('contact') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'contact')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-sm py-2 "
                      >
                        {getFieldName(headerContent, 'contact')}
                      </Link>
                    </li>
                  )}
                  <li>
                    <div>
                      <div className="relative">
                        {navbar && (
                          <div className="absolute inset-y-0 xs:right-2  flex items-center pl-3 pointer-events-none ">
                            <FontAwesomeIcon
                              icon={faSearch}
                              aria-hidden="true"
                              className="text-xl text-black"
                            />
                          </div>
                        )}
                        <input
                          type="text"
                          id="search"
                          className="block w-full px-4 py-2  text-basetext border border-slategray rounded focus:border-blue-500  dark:focus:border-blue-500"
                          placeholder={getFieldName(headerContent, 'searchBarPlaceholder')}
                          autoComplete="off"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                    </div>
                  </li>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <Image
                    className="w-full h-20  absolute bottom-0"
                    src={getImageSrc(headerContent, 'bottomBanner')}
                    alt=""
                    width={100}
                    height={300}
                  />
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
