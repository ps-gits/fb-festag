import Link from 'next/link';
import Image from 'next/image';
import { AnyAction } from 'redux';
import { NextRouter, useRouter } from 'next/router';
import {
  faBars,
  faXmark,
  // faSearch,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, LegacyRef, useEffect, useRef, useState } from 'react';

import {
  setNewsInDetail,
  setReadNewsInDetails,
  setFurtherInformation,
} from 'src/redux/reducer/Sitecore';
import { RootState } from 'src/redux/store';
import { resetLogin } from 'src/redux/reducer/CreateAccount';
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

  const userDetails = useSelector((state: RootState) => state?.createAccount?.signIn);
  const newsInDetails = useSelector((state: RootState) => state?.sitecore?.newsInDetail);
  const headerContent = useSelector((state: RootState) => state?.sitecore?.header?.fields);
  const readNewsInDetails = useSelector((state: RootState) => state?.sitecore?.readNewsInDetails);

  const [navbar, setNavbar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [companyDropdown, setCompanyDropdown] = useState(false);

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
        setCompanyDropdown(false);
        document.body.style.overflow = 'unset';
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
    dispatch(getSitecoreContent('Header') as unknown as AnyAction);
  }, [dispatch]);

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

  const logout = (dispatch: Dispatch<AnyAction>, router: NextRouter) => {
    dispatch(resetLogin() as unknown as AnyAction);
    localStorage.clear();
    setTimeout(async () => {
      (await router.push('/')) && router.reload();
    }, 1000);
  };

  return (
    <header className='header'>
      <nav className="z-50 bg-white fixed w-full  shadow-md">
        <div className="container">
          <div className=" flex items-center justify-between py-1 xl:px-0 xl:h-20 xs:h-20">
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
                      <Link
                        href="/"
                        className="block text-black text-base font-medium "
                        aria-current="page"
                      >
                        {getFieldName(headerContent, 'home')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'destinations')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-base font-medium"
                      >
                        {getFieldName(headerContent, 'destinations')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'experience')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-base font-medium"
                      >
                        {getFieldName(headerContent, 'experience')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'resorts')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-black text-base font-medium"
                      >
                        {getFieldName(headerContent, 'resorts')}
                      </Link>
                    </li>
                  </div>
                </div>
              </ul>

              <div>
                <div className="flex items-center">
                  {/* <div className="cross-icon mr-6 ">
                    {navbar && (
                      <FontAwesomeIcon
                        icon={faXmark}
                        aria-hidden="true"
                        onClick={() => setNavbar(false)}
                        className="text-xl text-white close-icon cursor-pointer"
                      />
                    )}
                  </div> */}
                  <div className="xl:not-sr-only xs:sr-only">
                    <button
                      type="submit"
                      className="text-white bg-lightorange font-medium rounded-full text-base px-5 py-3"
                      onClick={() => router.push('/')}
                    >
                      {getFieldName(headerContent, 'bookNowButton')}
                    </button>
                  </div>

                  <div>
                    <button
                      data-collapse-toggle="navbar-default"
                      type="button"
                      className={`border inline-flex items-center pl-4 ml-3 text-base text-gray-500 z-50 rounded-md:hidden text-white h-10 ${navbar === false ? "" : "invisible"}`}
                      aria-controls="navbar-default"
                      aria-expanded="true"
                      onClick={() => {
                        setNavbar(!navbar);
                        document.body.style.overflow = 'hidden';
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBars}
                        aria-hidden="true"
                        className="text-xl text-black"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <ul
              className={`fixed top-0 xl:mt-0 right-0 z-50 h-screen  bg-black w-full  xl:block text-black  ease-in-out duration-500 xl:justify-end header-index sidebar
                ${navbar
                  ? 'xs:translate-x-0  xl:translate-x-0 w-full xl:w-1/4 md:2/6'
                  : 'xs:translate-x-full xl:w-0 xl:translate-x-0'
                }`}
              id="navbar-default"
              ref={ref as LegacyRef<HTMLUListElement>}
            >
              <div className="cross-icon absolute top-8 left-8 ">
                {navbar && (
                  <FontAwesomeIcon
                    icon={faXmark}
                    aria-hidden="true"
                    onClick={() => {
                      setNavbar(false);
                      document.body.style.overflow = 'unset';
                    }}
                    className="text-xl text-white close-icon cursor-pointer"
                  />
                )}
              </div>
              <div className="flex  place-items-center pt-1 px-8">
                <div className="xl:block xl:gap-10 xs:flex xs:flex-col pt-20 w-full">
                  {headerSearch('destinations') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'destinations')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-base py-2  font-medium"
                        aria-current="page"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
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
                        className="block text-white text-base py-2  font-medium"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
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
                        className="block text-white text-base py-2  font-medium"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
                      >
                        {getFieldName(headerContent, 'resorts')}
                      </Link>
                    </li>
                  )}
                  {headerSearch('company') && (
                    <li>
                      <div className="bg-black w-full py-2 font-medium">
                        <div>
                          <div className="flex text-white text-base">
                            <div
                              className="flex items-center gap-2 justify-center  cursor-pointer "
                              onClick={() => setCompanyDropdown(!companyDropdown)}
                            >
                              <div className=" text-white text-base font-medium">
                                {getFieldName(headerContent, 'company')}
                              </div>
                              {!companyDropdown ? (
                                <div className="mt-1">
                                  <FontAwesomeIcon
                                    icon={faAngleDown}
                                    aria-hidden="true"
                                    className="text-sm text-white close-icon"
                                  />
                                </div>
                              ) : (
                                <div className="mt-1">
                                  <FontAwesomeIcon
                                    icon={faAngleUp}
                                    aria-hidden="true"
                                    className="text-sm text-white close-icon"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {companyDropdown && (
                            <div className="pt-2 pl-4">
                              <div className="py-1">
                              <li className="block text-white text-base py-2 font-medium cursor-pointer">
                                  <Link
                                    href={`/${getFieldName(headerContent, 'company')
                                      ?.toLowerCase()
                                      ?.replace(/\s/g, '')}/${getFieldName(
                                        headerContent,
                                        'companyDropdownItem1'
                                      )
                                        ?.toLowerCase()
                                        ?.replace(/\s/g, '')}`}
                                        onClick={() => {
                                          setNavbar(false);
                                          document.body.style.overflow = 'unset';
                                        }}
                                  >
                                    {getFieldName(headerContent, 'companyDropdownItem1')}
                                  </Link>
                                </li>
                              </div>
                              <div className="py-1">
                              <li className="block text-white text-base py-2 font-medium cursor-pointer">
                                  <Link
                                    href={`/${getFieldName(headerContent, 'company')
                                      ?.toLowerCase()
                                      ?.replace(/\s/g, '')}/${getFieldName(
                                        headerContent,
                                        'companyDropdownItem2'
                                      )
                                        ?.toLowerCase()
                                        ?.replace(/\s/g, '')}`}
                                        onClick={() => {
                                          setNavbar(false);
                                          document.body.style.overflow = 'unset';
                                        }}
                                  >
                                    {getFieldName(headerContent, 'companyDropdownItem2')}
                                  </Link>
                                </li>
                              </div>
                              {/* <div className="py-1">
                                <li className="block text-white text-base py-2 font-medium cursor-pointer">
                                  <Link href={`/resorts`}>
                                    {getFieldName(headerContent, 'companyDropdownItem3')}
                                  </Link>
                                </p>
                              </div> */}
                              {/* <div className="py-1">
                                <p className=" text-Silvergray text-sm  cursor-pointer">
                                  {getFieldName(headerContent, 'companyDropdownItem4')}
                                </li>
                              </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  )}
                  {/* {headerSearch('mediaCenter') && (
                    <li>
                      <Link href="#" className="block text-white text-base py-2 font-medium"
                      onClick={() => {
                        setNavbar(false);
                        document.body.style.overflow = 'unset';
                      }}
                      >
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
                        className="block text-white text-base py-2 font-medium"
                      >
                        {getFieldName(headerContent, 'sustainability')}
                      </Link>
                    </li>
                  )} */}
                  {headerSearch('careers') && (
                    <li>
                      <Link
                        href={`/${getFieldName(headerContent, 'careers')
                          ?.toLowerCase()
                          ?.replace(/\s/g, '')}`}
                        className="block text-white text-base py-2 font-medium"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
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
                        className="block text-white text-base py-2 font-medium"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
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
                        className="block text-white text-base py-2 font-medium"
                        onClick={() => {
                          setNavbar(false);
                          document.body.style.overflow = 'unset';
                        }}
                      >
                        {getFieldName(headerContent, 'contact')}
                      </Link>
                    </li>
                  )}
                  {userDetails?.Login !== undefined && (
                    <li>
                      <div
                        className="block text-white text-base py-2 font-medium cursor-pointer"
                        onClick={() => logout(dispatch, router)}
                      >
                        Logout
                      </div>
                    </li>
                  )}
                  <li>
                    <div className="">
                      {/* <div className="relative z-50">
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
                          className="block w-full px-4 py-2  text-base text-black border border-slategray rounded focus:border-blue-500  dark:focus:border-blue-500"
                          placeholder={getFieldName(headerContent, 'searchBarPlaceholder')}
                          autoComplete="off"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div> */}
                    </div>
                  </li>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <Image
                    className="w-full h-20 absolute bottom-0 object-cover"
                    src={getImageSrc(headerContent, 'bottomBanner')}
                    alt=""
                    width={500}
                    height={1000}
                  />
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
