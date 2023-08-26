import Image from 'next/image';
import parse from 'html-react-parser';
import { SetStateAction, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/redux/store';
import { ancillaryCode } from './AnicillaryCodeForAddons';
import { setYourCart } from 'src/redux/reducer/FlightDetails';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const FeaturedAddOns = (props: {
  featuredAddons: { name: string; amount: number; quantity: number }[];
  setFeaturedAddons: (
    value: SetStateAction<{ name: string; amount: number; quantity: number }[]>
  ) => void;
}) => {
  const dispatch = useDispatch();
  const { featuredAddons, setFeaturedAddons } = props;

  const featuredAddOnsContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );
  const allAddOnsData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.EMDTicketFareOptions
  );
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

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

  const getParticularAddon = (label: string) => {
    return featuredAddons?.find((item) => item?.name === label) as {
      name: string;
      amount: number;
      quantity: number;
    };
  };

  const addCartItem = (
    label: string,
    appliableRefPassengers: string[],
    amount: string,
    code: string
  ) => {
    if (
      getParticularAddon(label) !== undefined &&
      getParticularAddon(label)?.quantity < appliableRefPassengers?.length
    ) {
      setFeaturedAddons(
        featuredAddons?.map((dt) => {
          if (dt?.name === label) {
            return {
              code: code,
              name: label,
              quantity: getParticularAddon(label)?.quantity + 1,
              amount: getParticularAddon(label)?.amount + Number(amount),
            };
          } else return dt;
        })
      );
      dispatch(
        setYourCart(
          featuredAddons?.map((dt) => {
            if (dt?.name === label) {
              return {
                code: code,
                name: label,
                quantity: getParticularAddon(label)?.quantity + 1,
                amount: getParticularAddon(label)?.amount + Number(amount),
              };
            } else return dt;
          })
        )
      );
    }
  };

  const removeCartItem = (label: string, amount: string, code: string) => {
    setFeaturedAddons(
      getParticularAddon(label)?.quantity > 1
        ? featuredAddons?.map((dt) => {
            if (dt?.name === label) {
              return {
                code: code,
                name: label,
                quantity: getParticularAddon(label)?.quantity - 1,
                amount: getParticularAddon(label)?.amount - Number(amount),
              };
            } else return dt;
          })
        : featuredAddons?.filter((dt) => dt?.name !== label)
    );
    dispatch(
      setYourCart(
        getParticularAddon(label)?.quantity > 1
          ? featuredAddons?.map((dt) => {
              if (dt?.name === label) {
                return {
                  code: code,
                  name: label,
                  quantity: getParticularAddon(label)?.quantity - 1,
                  amount: getParticularAddon(label)?.amount - Number(amount),
                };
              } else return dt;
            })
          : featuredAddons?.filter((dt) => dt?.name !== label)
      )
    );
  };

  return (
    <div className="xs:mb-40 xl:mb-0">
      {selectedAddOns?.length > 0 && (
        <div>
          <h1 className="font-black text-xl text-black">
            {getFieldName(featuredAddOnsContent, 'featuredAddons')}
          </h1>
        </div>
      )}
      {selectedAddOns?.map(
        (
          item: {
            Label: string;
            SaleCurrencyAmount: {
              TotalAmount: number;
            };
            AppliableRefPassengers: string[];
            HtmlDescription: string;
            AncillaryCode: string;
          },
          index: number
        ) => {
          return (
            <div className="bg-white  xl:w-full mt-3 rounded-lg" key={index}>
              <div className="flex p-3 justify-between items-center">
                <div>
                  <h1 className="text-base font-black text-black">{item?.Label}</h1>
                  <p className="font-black text-sm text-aqua">
                    {(modifyBookingInfo?.Amount?.SaleCurrencyCode
                      ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                      : flightInfo?.details?.currency
                      ? flightInfo?.details?.currency
                      : '') +
                      ' ' +
                      item?.SaleCurrencyAmount?.TotalAmount?.toLocaleString('en-GB')}{' '}
                    {getFieldName(featuredAddOnsContent, 'perPerson')}
                  </p>
                </div>
                {featuredAddons?.find((dt) => dt?.name === item?.Label) === undefined ? (
                  <div
                    className="h-28 w-44  object-contain rounded-md flex justify-end"
                    onClick={() => {
                      setFeaturedAddons((prev) => [
                        ...prev,
                        {
                          name: item?.Label,
                          amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                          quantity: 1,
                          code: item?.AncillaryCode,
                        },
                      ]);
                      dispatch(
                        setYourCart([
                          ...featuredAddons,
                          {
                            name: item?.Label,
                            amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                            quantity: 1,
                            code: item?.AncillaryCode,
                          },
                        ])
                      );
                    }}
                  >
                    {item?.HtmlDescription &&
                      parse(item?.HtmlDescription?.replace(/style="[^"]*"/, ''))}
                  </div>
                ) : (
                  <div>
                    <div className=" xs:flex xs:justify-end">
                      <div className="custom-number-input h-7 w-20">
                        <div className="flex flex-row h-7 w-full rounded-lg relative bg-transparent mt-1">
                          <button
                            className={`bg-lightred flex text-gray-600 rounded-md  h-full w-20 `}
                            onClick={() =>
                              removeCartItem(
                                item?.Label,
                                String(item?.SaleCurrencyAmount?.TotalAmount),
                                item?.AncillaryCode
                              )
                            }
                          >
                            <span className="m-auto text-xl font-thin text-lightred ">
                              <Image
                                src={getImageSrc(featuredAddOnsContent, 'trashIcon') as string}
                                className="text-red text-sm font-black h-5 w-5"
                                alt=""
                                height={10}
                                width={10}
                              />
                            </span>
                          </button>
                          <div className="text-center w-full justify-center font-semibold text-md flex items-center text-black">
                            {getParticularAddon(item?.Label)?.quantity}
                          </div>
                          <button
                            className={`bg-lightblue flex text-gray-600 rounded-md  h-full w-20 ${
                              getParticularAddon(item?.Label)?.quantity <
                              item?.AppliableRefPassengers?.length
                                ? 'cursor-pointer'
                                : 'cursor-not-allowed'
                            }`}
                            disabled={
                              !(
                                getParticularAddon(item?.Label)?.quantity <
                                item?.AppliableRefPassengers?.length
                              )
                            }
                            onClick={() =>
                              addCartItem(
                                item?.Label,
                                item?.AppliableRefPassengers,
                                String(item?.SaleCurrencyAmount?.TotalAmount),
                                item?.AncillaryCode
                              )
                            }
                          >
                            <span className="m-auto text-xl font-thin text-aqua ">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default FeaturedAddOns;
