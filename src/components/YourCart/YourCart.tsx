import Image from 'next/image';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { setYourCart } from 'src/redux/reducer/FlightDetails';
import { ancillaryCode } from 'components/ModifyBooking/AnicillaryCodeForAddons';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const YourCart = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartData = useSelector((state: RootState) => state?.flightDetails?.yourCart);
  const modifyData = useSelector((state: RootState) => state?.flightDetails?.modifyData);
  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const yourCartContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );
  const allAddOnsData = useSelector((state: RootState) =>
    !modifyData
      ? state?.flightDetails?.prepareFlight?.EMDTicketFareOptions
      : state?.flightDetails?.prepareBookingModification?.EMDTicketFareOptions
  );
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);

  const [featuredAddons, setFeaturedAddons] =
    useState<{ name: string; amount: number; quantity: number }[]>(cartData);

  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('class')) {
        img.classList.add('addon-image');
      }
    });
  }, [featuredAddons]);

  const selectedAddOns = allAddOnsData?.filter((item: { AncillaryCode: string }) =>
    ancillaryCode?.includes(Number(item?.AncillaryCode))
  );

  const remainingAddOns = selectedAddOns?.filter(
    (item: { Label: string }) =>
      featuredAddons?.find((dt) => dt?.name === item?.Label) === undefined
  );

  const getParticularAddon = (label: string) => {
    return featuredAddons?.find((item) => item?.name === label) as {
      name: string;
      amount: number;
      quantity: number;
    };
  };

  const addCartItem = (name: string) => {
    if (
      getParticularAddon(name) !== undefined &&
      getParticularAddon(name)?.quantity <
        selectedAddOns?.find((dt: { Label: string }) => dt?.Label === name)?.AppliableRefPassengers
          ?.length
    ) {
      setFeaturedAddons(
        featuredAddons?.map((dt) => {
          if (dt?.name === name) {
            return {
              name: name,
              quantity: getParticularAddon(name)?.quantity + 1,
              amount:
                getParticularAddon(name)?.amount +
                Number(
                  selectedAddOns?.find((dt: { Label: string }) => dt?.Label === name)
                    ?.SaleCurrencyAmount?.TotalAmount
                ),
            };
          } else return dt;
        })
      );
      dispatch(
        setYourCart(
          featuredAddons?.map((dt) => {
            if (dt?.name === name) {
              return {
                name: name,
                quantity: getParticularAddon(name)?.quantity + 1,
                amount:
                  getParticularAddon(name)?.amount +
                  Number(
                    selectedAddOns?.find((dt: { Label: string }) => dt?.Label === name)
                      ?.SaleCurrencyAmount?.TotalAmount
                  ),
              };
            } else return dt;
          })
        )
      );
    }
  };

  const removeCartItem = (name: string) => {
    setFeaturedAddons(
      getParticularAddon(name)?.quantity > 1
        ? featuredAddons?.map((dt) => {
            if (dt?.name === name) {
              return {
                name: name,
                quantity: getParticularAddon(name)?.quantity - 1,
                amount:
                  getParticularAddon(name)?.amount -
                  Number(
                    selectedAddOns?.find((dt: { Label: string }) => dt?.Label === name)
                      ?.SaleCurrencyAmount?.TotalAmount
                  ),
              };
            } else return dt;
          })
        : featuredAddons?.filter((dt) => dt?.name !== name)
    );
    dispatch(
      setYourCart(
        getParticularAddon(name)?.quantity > 1
          ? featuredAddons?.map((dt) => {
              if (dt?.name === name) {
                return {
                  name: name,
                  quantity: getParticularAddon(name)?.quantity - 1,
                  amount:
                    getParticularAddon(name)?.amount -
                    Number(
                      selectedAddOns?.find((dt: { Label: string }) => dt?.Label === name)
                        ?.SaleCurrencyAmount?.TotalAmount
                    ),
                };
              } else return dt;
            })
          : featuredAddons?.filter((dt) => dt?.name !== name)
      )
    );
  };

  const SelectedAddons = () => (
    <div className="bg-white  xl:w-full mt-3 rounded-lg border border-cadetgray">
      {featuredAddons?.map(
        (
          item: {
            name: string;
            quantity: number;
          },
          index: number
        ) => {
          return (
            <div className="flex gap-3 p-3 justify-between items-center" key={index}>
              <div>
                <h1 className="text-base font-black text-black">{item?.name}</h1>
                <p className="font-black text-sm text-aqua">
                  {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                    ' ' +
                    selectedAddOns?.find((dt: { Label: string }) => dt?.Label === item?.name)
                      ?.SaleCurrencyAmount?.TotalAmount}{' '}
                  {getFieldName(yourCartContent, 'perPerson')}
                </p>
              </div>
              <div>
                <div className=" xs:flex xs:justify-end">
                  <div className="custom-number-input h-7 w-20">
                    <div className="flex flex-row h-7 w-full rounded-lg relative bg-transparent mt-1">
                      <button
                        className={`bg-lightblue flex text-gray-600 rounded-md  h-full w-20 `}
                        onClick={() => removeCartItem(item?.name)}
                      >
                        <span className="m-auto text-xl font-thin text-aqua ">
                          <Image
                            src={getImageSrc(yourCartContent, 'trashIcon') as string}
                            className="text-red text-sm font-black h-5 w-5"
                            alt=""
                            height={10}
                            width={10}
                          />
                        </span>
                      </button>
                      <div className="text-center w-full font-semibold text-md justify-center flex items-center text-black">
                        {item?.quantity}
                      </div>
                      <button
                        className={`bg-lightblue flex text-gray-600 rounded-md  h-full w-20 ${
                          getParticularAddon(item?.name)?.quantity <
                          selectedAddOns?.find((dt: { Label: string }) => dt?.Label === item?.name)
                            ?.AppliableRefPassengers?.length
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed'
                        }`}
                        disabled={
                          !(
                            getParticularAddon(item?.name)?.quantity <
                            selectedAddOns?.find(
                              (dt: { Label: string }) => dt?.Label === item?.name
                            )?.AppliableRefPassengers?.length
                          )
                        }
                        onClick={() => addCartItem(item?.name)}
                      >
                        <span className="m-auto text-xl font-thin text-aqua ">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );

  const CartDetails = () => {
    return (
      <div className=" xs:mt-2">
        {featuredAddons?.length > 0 && (
          <div className="bg-white p-3 rounded-lg">
            <div className="xl:not-sr-only	xs:sr-only">
              <h1 className="text-2xl font-black text-black">
                {getFieldName(yourCartContent, 'yourCart')}
              </h1>
              <SelectedAddons />
            </div>
            <div className="mt-5">
              {featuredAddons?.map(
                (item: { name: string; amount: number; quantity: number }, index: number) => (
                  <div className="flex justify-between my-1" key={index}>
                    <p className="text-slategray text-base font-medium">
                      {item?.name} x{item?.quantity}
                    </p>
                    <p className="font-black text-base text-black ">
                      {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                        ' ' +
                        item?.amount}
                    </p>
                  </div>
                )
              )}
              <div className="flex justify-between my-1">
                <p className="text-slategray text-base font-medium">
                  {getFieldName(yourCartContent, 'totalPrice')}
                </p>
                <p className="font-black text-base text-black">
                  {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                    ' ' +
                    featuredAddons?.reduce((a, b) => a + b?.amount, 0)}
                </p>
              </div>
            </div>
            <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
              <button
                data-modal-hide="popup-modal-calendar"
                type="button"
                className="w-full xs:justify-center  xs:text-center text-white bg-aqua focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
              >
                {getFieldName(yourCartContent, 'confirmPayButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="xl:not-sr-only	xs:sr-only">
        <div className="w-full h-52 xl:h-screen  xl:w-1/4 overflow-hidden xs:relative xl:fixed right-0">
          <Image
            src={getImageSrc(searchFlightContent, 'desktopBanner') as string}
            className="xs:absolute  inset-0 h-full w-full object-cover"
            alt=""
            height={200}
            width={160}
          />
        </div>
        <div className="xl:not-sr-only	xs:sr-only">
          <div className="fixed top-24 right-3.5  xl:m-auto price-modal">
            <CartDetails />
          </div>
        </div>
      </div>
      <div className="px-3 xl:bg-cadetgray width-auto  xl:w-3/4 xs:w-full xl:py-24 xl:mt-0 xs:pt-20 ">
        <div className="xl:w-2/4 xl:m-auto xs:w-full">
          <div>
            <div className="flex justify-between items-center xl:py-0 xs:py-3  cursor-pointer">
              <div
                className="xl:py-3 xs:py-0 cursor-pointer"
                onClick={() => {
                  router.back();
                }}
              >
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  aria-hidden="true"
                  className="text-black text-sm font-black h-4 w-4  "
                />
                <span className="px-2 text-black text-sm font-black">
                  {getFieldName(yourCartContent, 'backButton')}
                </span>
              </div>
            </div>
            <div className="xs:not-sr-only	xl:sr-only">
              <h1 className="text-2xl font-black text-black">
                {getFieldName(yourCartContent, 'yourCart')}
              </h1>
              <SelectedAddons />
            </div>
            {remainingAddOns?.length > 0 && (
              <div>
                <h1 className="text-2xl font-black text-black">
                  {getFieldName(yourCartContent, 'youMightAlsoLike')}
                </h1>
              </div>
            )}
          </div>
          <div className=" xs:block gap-2">
            <div>
              {remainingAddOns?.map(
                (
                  item: {
                    Label: string;
                    SaleCurrencyAmount: { TotalAmount: string };
                    HtmlDescription: string;
                  },
                  index: number
                ) => (
                  <div className="bg-white  xl:w-full mt-3 rounded-lg" key={index}>
                    <div className="flex p-3 justify-between items-center ">
                      <div>
                        <h1 className="text-base font-black text-black">{item?.Label}</h1>
                        <p className="font-black text-sm text-aqua">
                          {(flightInfo?.details?.currency ? flightInfo?.details?.currency : '') +
                            ' ' +
                            item?.SaleCurrencyAmount?.TotalAmount}{' '}
                          {getFieldName(yourCartContent, 'perPerson')}
                        </p>
                      </div>
                      <div
                        className="h-28 w-44 object-contain rounded-md flex justify-end"
                        onClick={() => {
                          setFeaturedAddons((prev) => [
                            ...prev,
                            {
                              name: item?.Label,
                              amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                              quantity: 1,
                            },
                          ]);
                          dispatch(
                            setYourCart([
                              ...featuredAddons,
                              {
                                name: item?.Label,
                                amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                                quantity: 1,
                              },
                            ])
                          );
                        }}
                      >
                        {parse(item?.HtmlDescription?.replace(/style="[^"]*"/, ''))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="xs:not-sr-only	xl:sr-only">
            <CartDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourCart;
