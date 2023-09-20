import Image from 'next/image';
import { AnyAction } from 'redux';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { RootState } from 'src/redux/store';
import { loader } from 'src/redux/reducer/Loader';
import SavingDataLoader from 'components/Loader/SavingData';
import { setYourCart } from 'src/redux/reducer/FlightDetails';
import { civilityCodeOptions } from 'components/Select/SelectOptions';
import { postModifyBookingSeats } from 'src/redux/action/SearchFlights';
import { calculateDob } from 'components/PassengerDetails/CalculateDob';
import { fieldsWithCode } from 'components/PassengerDetails/FieldsData';
import { ancillaryCode } from 'components/ModifyBooking/AnicillaryCodeForAddons';
import { getFieldName, getImageSrc } from 'components/SearchFlight/SitecoreContent';

const YourCart = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const searchFlightContent = useSelector(
    (state: RootState) => state?.sitecore?.searchFlight?.fields
  );
  const yourCartContent = useSelector(
    (state: RootState) => state?.sitecore?.bookingComplete?.fields
  );
  const load = useSelector((state: RootState) => state?.loader?.loader);
  const prepareFlightDetails = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification
  );
  const passengerDetails = useSelector(
    (state: RootState) =>
      state?.flightDetails?.prepareBookingModification?.Passengers?.map(
        (item: { NameElement: { Firstname: string; Surname: string } }, index: number) => {
          // const otherFields = Object.fromEntries(
          //   state?.flightDetails?.prepareBookingModification?.PassengersDetails[index]?.fields.map(
          //     (dt: { Code: string; Text: string }) => [
          //       fieldsWithCode?.find((item1) => item1?.Code === dt?.Code)?.name,
          //       dt.Text,
          //     ]
          //   )
          // );
          const otherFields = Object.fromEntries(
            (
              state?.flightDetails?.prepareBookingModification?.PassengersDetails[index]?.fields ||
              []
            )
              .map((dt: { Code: string; Text: string }) => {
                const matchingItem = fieldsWithCode?.find((item1) => item1?.Code === dt?.Code);
                return matchingItem ? [matchingItem?.name, dt?.Text] : null;
              })
              ?.filter(Boolean)
          );
          return {
            ...item?.NameElement,
            ...otherFields,
          };
        }
      )
    // ?.map(({ undefined: {}, ...rest }) => ({ ...rest }))
  );
  const flightWay = useSelector(
    (state: RootState) => state?.flightDetails?.modifyBooking?.OriginDestination
  );
  const cartData = useSelector((state: RootState) => state?.flightDetails?.yourCart);
  const seatMaps = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.SeatMaps
  );
  const allMealData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.MealsDetails
  );
  const selectedMeal = useSelector((state: RootState) => state?.flightDetails?.selectedMeal);
  const flightInfo = useSelector((state: RootState) => state?.flightDetails?.selectedFlight);
  const allAddOnsData = useSelector(
    (state: RootState) => state?.flightDetails?.prepareBookingModification?.EMDTicketFareOptions
  );
  const modifyBookingInfo = useSelector((state: RootState) => state?.flightDetails?.modifyBooking);

  const [featuredAddons, setFeaturedAddons] =
    useState<{ name: string; amount: number; quantity: number; code: string }[]>(cartData);

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

  const addCartItem = (name: string, code: string) => {
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
              code: code,
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
                code: code,
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

  const removeCartItem = (name: string, code: string) => {
    setFeaturedAddons(
      getParticularAddon(name)?.quantity > 1
        ? featuredAddons?.map((dt) => {
            if (dt?.name === name) {
              return {
                code: code,
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
                  code: code,
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
    <div className="  xl:w-full mt-3 max-h-48 overflow-auto ">
      {featuredAddons?.map(
        (
          item: {
            name: string;
            quantity: number;
            code: string;
          },
          index: number
        ) => {
          return (
            <div
              className=" bg-white rounded-lg  border border-cadetgray mb-3 flex gap-3 p-3 justify-between items-center"
              key={index}
            >
              <div>
                <h1 className="text-base font-black text-black">{item?.name}</h1>
                <p className="font-black text-sm text-aqua">
                  {(modifyBookingInfo?.Amount?.SaleCurrencyCode
                    ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                    : flightInfo?.details?.currency
                    ? flightInfo?.details?.currency
                    : '') +
                    ' ' +
                    selectedAddOns
                      ?.find((dt: { Label: string }) => dt?.Label === item?.name)
                      ?.SaleCurrencyAmount?.TotalAmount?.toLocaleString('en-GB')}{' '}
                  {getFieldName(yourCartContent, 'perPerson')}
                </p>
              </div>
              <div>
                <div className=" xs:flex xs:justify-end">
                  <div className="custom-number-input h-7 w-20">
                    <div className="flex flex-row h-7 w-full rounded-lg relative bg-transparent mt-1">
                      <button
                        className={`bg-lightred flex text-gray-600 rounded-md  h-full w-20 `}
                        onClick={() => removeCartItem(item?.name, item?.code)}
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
                        onClick={() => addCartItem(item?.name, item?.code)}
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

  const addAncillaryData = () => {
    dispatch(
      loader({
        name: 'save',
        show: true,
      })
    );
    let ancillaryData: { name: string; amount: number }[] = [];
    cartData?.map((item: { quantity: number; name: string; amount: number; code: string }) => {
      const ancillaryWithPassenger = Array(item.quantity)
        ?.fill({
          name: item?.name,
          AncillaryCode: item?.code,
          amount: item?.amount / item.quantity,
        })
        ?.map((_dt, index: number) => {
          return {
            name: item?.name,
            AncillaryCode: item?.code,
            amount: item?.amount / item.quantity,
            Firstname:
              passengerDetails &&
              passengerDetails?.length > 0 &&
              passengerDetails[Math.floor(index % passengerDetails?.length)]
                ? passengerDetails[Math.floor(index % passengerDetails?.length)]?.Firstname
                : '',
            Surname:
              passengerDetails &&
              passengerDetails?.length > 0 &&
              passengerDetails[Math.floor(index % passengerDetails?.length)]
                ? passengerDetails[Math.floor(index % passengerDetails?.length)]?.Surname
                : '',
            RefPassenger:
              prepareFlightDetails?.Passengers &&
              prepareFlightDetails?.Passengers?.length > 0 &&
              prepareFlightDetails?.Passengers[
                Math.floor(index % prepareFlightDetails?.Passengers?.length)
              ]
                ? prepareFlightDetails?.Passengers[
                    Math.floor(index % prepareFlightDetails?.Passengers?.length)
                  ]?.Ref
                : '',
          };
        });
      ancillaryData = [...ancillaryData, ...ancillaryWithPassenger];
    });
    const allSeats = modifyBookingInfo?.PassengersDetails?.map(
      (item: { fields: { Code: string }[] }) =>
        item?.fields?.filter((item: { Code: string }) => item?.Code === 'SEAT')?.map((item) => item)
    );

    const mealSelected: mealObjectKeys[] = selectedMeal ? selectedMeal : [];

    const refSegmentDeparture = seatMaps?.find(
      (item: object, index: number) => item !== undefined && index === 0
    )?.RefSegment;

    const refSegmentArrival = seatMaps?.find(
      (item: object, index: number) => item !== undefined && index === 1
    )?.RefSegment;

    const seatDataWithPassengerInfo = (
      allSeats && allSeats?.length > 0 ? allSeats?.flat(1) : []
    )?.map((item: { Data: { Seat: { SeatRow: number; SeatLetter: string } } }, index: number) => {
      const seatRows = seatMaps
        ?.find(
          (seatItem: object, seatIndex: number) =>
            seatItem !== undefined &&
            seatIndex === (flightWay && flightWay?.length === 1 ? 0 : index % 2)
        )
        ?.Decks?.map((item: { Areas: { Rows: { RowNumber: number }[] }[] }) =>
          item?.Areas?.find((item1) => item1?.Rows)
        )
        ?.find((item2: object) => item2 !== undefined)?.Rows;
      const seatInfo = seatRows
        ?.find(
          (seatRowItem: { RowNumber: number }) =>
            seatRowItem?.RowNumber === item?.Data?.Seat?.SeatRow
        )
        ?.Columns?.find((seatRowItem1: { Seats: { Letter: string }[] }) =>
          seatRowItem1?.Seats?.find(
            (seatRowItem2: { Letter: string }) =>
              seatRowItem2?.Letter === item?.Data?.Seat?.SeatLetter
          )
        )
        ?.Seats?.find(
          (seatRowItem3: { Letter: string }) =>
            seatRowItem3?.Letter === item?.Data?.Seat?.SeatLetter
        );

      if (flightWay && flightWay?.length === 1) {
        const passengerInfo = passengerDetails?.find(
          (passengerItem: { Surname: string; Firstname: string }, passengerIndex: number) =>
            passengerItem !== undefined && passengerIndex === index
        );
        return {
          ...item,
          Firstname: passengerInfo?.Firstname,
          Surname: passengerInfo?.Surname,
          mapIndex: 0,
          price: '500',
          seatNumber: item?.Data?.Seat?.SeatLetter,
          passengerIndex: index,
          rowNumber: item?.Data?.Seat?.SeatRow,
          AircraftName: seatMaps[0]?.AircraftName,
          RefSegment: seatMaps[0]?.RefSegment,
        };
      } else if (flightWay && flightWay?.length > 1) {
        const passengerInfo = passengerDetails?.find(
          (passengerItem: { Surname: string; Firstname: string }, passengerIndex: number) =>
            passengerItem !== undefined && passengerIndex === Math.floor(index / 2)
        );
        return {
          ...item,
          ...seatInfo,
          Firstname: passengerInfo?.Firstname,
          Surname: passengerInfo?.Surname,
          mapIndex: index % 2,
          price: '500',
          seatNumber: item?.Data?.Seat?.SeatLetter,
          passengerIndex: Math.floor(index / 2),
          rowNumber: item?.Data?.Seat?.SeatRow,
          AircraftName: seatMaps && seatMaps?.length ? seatMaps[index % 2]?.AircraftName : '',
          RefSegment: seatMaps && seatMaps?.length ? seatMaps[index % 2]?.RefSegment : '',
        };
      }
    });

    const selectSeat: seatDetails[] =
      seatDataWithPassengerInfo && seatDataWithPassengerInfo?.length > 0
        ? seatDataWithPassengerInfo
        : [];

    const seatData = selectSeat?.map((item) => {
      const finalData = JSON.parse(JSON.stringify({ ...item, RowNumber: item?.rowNumber }));
      delete finalData?.mapIndex;
      delete finalData?.passengerIndex;
      delete finalData?.price;
      delete finalData?.rowNumber;
      delete finalData?.seatNumber;
      return finalData;
    });
    const ticketFareOptions = seatData
      ?.map((item) => {
        const findData = prepareFlightDetails?.EMDTicketFareOptions?.find(
          (dt: { AncillaryCode: string }) => dt?.AncillaryCode === item?.AssociatedAncillaryCode
        );
        return findData;
      })
      ?.filter(
        (item, index, arr) =>
          item !== undefined &&
          index === arr?.findIndex((dt) => dt?.AncillaryCode === item?.AncillaryCode)
      );
    const departure = mealSelected?.filter(
      (item: { originMealCode: string }) => item?.originMealCode?.length > 0
    );
    const arrival = mealSelected?.filter(
      (item: { returnMealCode: string }) => item?.returnMealCode?.length > 0
    );
    const dataToPost = passengerDetails?.map(
      (
        item: {
          Dob: string;
          Email: string;
          Mobile: string;
          Surname: string;
          Firstname: string;
          flagMobile: string;
          validMobile: string;
          // Homecontact: string;
          dialCodeMobile: string;
          // flagHomeContact: string;
          // validHomeContact: string;
          // dialCodeHomeContact: string;
        },
        index: number
      ) => {
        const postData = JSON.parse(JSON.stringify(item));
        if (Object.keys(item).includes('Mobile')) {
          postData['Mobile'] =
            (item['dialCodeMobile'] === undefined ? '' : item['dialCodeMobile']) + item['Mobile'];
        }
        // if (Object.keys(item).includes('Homecontact')) {
        //   postData['Homecontact'] = item['dialCodeHomeContact'] + item['Homecontact'];
        // }
        Object.keys(item).includes('undefined') && delete postData['undefined'];
        delete postData?.flagMobile;
        delete postData?.validMobile;
        delete postData?.dialCodeMobile;
        // delete postData?.flagHomeContact;
        // delete postData?.validHomeContact;
        // delete postData?.dialCodeHomeContact;
        return {
          PassengerDetails: {
            ...postData,
            CivilityCode: civilityCodeOptions?.find(
              (dt) => dt?.label === postData?.CivilityCode || dt?.Code === postData?.CivilityCode
            )?.Code,
            Surname: item?.Surname,
            Firstname: item?.Firstname,
            Ref: prepareFlightDetails?.Passengers[index]?.Ref,
            PassengerType: calculateDob(new Date(), new Date(),item?.Dob) >= 11 ? 'AD' : 'CHD',
            Homecontact: postData?.Mobile,
          },
          SpecialServices:
            calculateDob(new Date(), new Date(),item?.Dob) >= 11
              ? {
                  CTCE: item.Email,
                  CTCH: postData?.Mobile,
                  CTCM: postData?.Mobile,
                  DOCS: '',
                  EXTADOB: item?.Dob,
                }
              : {
                  CTCE: item.Email,
                  CTCH: postData?.Mobile,
                  CTCM: postData?.Mobile,
                  DOCS: '',
                  CHLD: item?.Dob,
                },
          Documents: [
            {
              NationalityCountryCode: 'FR',
              DateOfBirth: item.Dob,
              Gender: 'F',
              Firstname: item.Firstname,
              Surname: item.Surname,
            },
          ],
        };
      }
    );
    dispatch(
      postModifyBookingSeats(
        {
          booking: dataToPost,
          PnrCode: modifyBookingInfo?.PnrInformation?.PnrCode,
          PassengerName: passengerDetails !== undefined ? passengerDetails[0].Surname : '',
          SeatMap: {
            departure:
              seatData && seatData?.length > 0
                ? seatData?.slice(0, passengerDetails?.length)?.map((item, index) => {
                    return {
                      ...item,
                      RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                    };
                  })
                : [],
            arrival:
              seatData && seatData?.length > 0
                ? seatData
                    ?.slice(passengerDetails?.length, seatData?.length)
                    ?.map((item, index) => {
                      return {
                        ...item,
                        RefPassenger: prepareFlightDetails?.Passengers[index]?.Ref,
                      };
                    })
                : [],
          },
          EMDTicketFareOptions:
            ticketFareOptions && ticketFareOptions?.length > 0 ? ticketFareOptions : [],
          AncillaryData: ancillaryData,
          MealsDetails: {
            departure:
              departure && departure?.length > 0
                ? departure?.map(
                    (item: {
                      originMealCode: string;
                      passengerName: string;
                      passengerIndex: number;
                    }) => {
                      const findPassengerIndex = passengerDetails?.findIndex(
                        (dt: { Firstname: string }, index: number) =>
                          dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                      );
                      const findData = allMealData[findPassengerIndex]?.fields?.find(
                        (dt: { Code: string }) => item?.originMealCode === dt?.Code
                      );
                      return {
                        Code: item?.originMealCode,
                        Label: findData?.Label,
                        RefPassenger: findData?.RefPassenger,
                        RefSegment: refSegmentDeparture ? refSegmentDeparture : '',
                      };
                    }
                  )
                : [],
            arrival:
              arrival && arrival?.length > 0
                ? arrival?.map(
                    (item: {
                      returnMealCode: string;
                      passengerName: string;
                      passengerIndex: number;
                    }) => {
                      const findPassengerIndex = passengerDetails?.findIndex(
                        (dt: { Firstname: string }, index: number) =>
                          dt?.Firstname === item?.passengerName && index === item?.passengerIndex
                      );
                      const findData = allMealData[findPassengerIndex]?.fields?.find(
                        (dt: { Code: string }) => item?.returnMealCode === dt?.Code
                      );
                      return {
                        Code: item?.returnMealCode,
                        Label: findData?.Label,
                        RefPassenger: findData?.RefPassenger,
                        RefSegment: refSegmentArrival ? refSegmentArrival : '',
                      };
                    }
                  )
                : [],
          },
        },
        router,
        prepareFlightDetails?.cpd_code,
        true
      ) as unknown as AnyAction
    );
  };

  const CartDetails = () => {
    return (
      <div className=" xs:mt-2">
        {featuredAddons?.length > 0 && (
          <div className="bg-white p-3 rounded-lg overflow-y-auto">
            <div className="xl:not-sr-only	xs:sr-only">
              <h1 className="text-2xl font-black text-black">
                {getFieldName(yourCartContent, 'yourCart')}
              </h1>
              <SelectedAddons />
            </div>
            <div className="xs:mt-5 xl:mt-0">
              {featuredAddons?.map(
                (item: { name: string; amount: number; quantity: number }, index: number) => (
                  <div className="flex justify-between my-1" key={index}>
                    <p className="text-slategray text-base font-medium">
                      {item?.name} x{item?.quantity}
                    </p>
                    <p className="font-black text-base text-black ">
                      {(modifyBookingInfo?.Amount?.SaleCurrencyCode
                        ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                        : flightInfo?.details?.currency
                        ? flightInfo?.details?.currency
                        : '') +
                        ' ' +
                        item?.amount?.toLocaleString('en-GB')}
                    </p>
                  </div>
                )
              )}
              <div className="flex justify-between xl:mt-5 xs:mt-0">
                <p className="text-slategray text-lg font-medium">
                  {getFieldName(yourCartContent, 'totalPrice')}
                </p>
                <p className="font-black text-lg text-black">
                  {(modifyBookingInfo?.Amount?.SaleCurrencyCode
                    ? modifyBookingInfo?.Amount?.SaleCurrencyCode
                    : flightInfo?.details?.currency
                    ? flightInfo?.details?.currency
                    : '') +
                    ' ' +
                    featuredAddons?.reduce((a, b) => a + b?.amount, 0)}
                </p>
              </div>
            </div>
            <div className="py-3 lg:flex md:flex block h-full items-center justify-center relative gap-3 w-full  m-auto">
              <button
                data-modal-hide="popup-modal-calendar"
                type="button"
                className="w-full xs:justify-center  xs:text-center text-white bg-aqua font-black rounded-lg text-lg inline-flex items-center px-5 py-2 text-center "
                onClick={addAncillaryData}
              >
                Confirm
                {/* {getFieldName(yourCartContent, 'confirmPayButton')} */}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      {!load?.show ? (
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
                  <div className="xs:mt-5 xl:mt-0">
                    <h1 className="text-xl font-black text-black">
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
                        SaleCurrencyAmount: { TotalAmount: number };
                        HtmlDescription: string;
                        AncillaryCode: string;
                      },
                      index: number
                    ) => (
                      <div className="bg-white  xl:w-full my-3 rounded-lg" key={index}>
                        <div className="flex p-3 justify-between items-center ">
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
                              {getFieldName(yourCartContent, 'perPerson')}
                            </p>
                          </div>
                          <div
                            className="h-28 w-44 object-contain rounded-md flex justify-end"
                            onClick={() => {
                              setFeaturedAddons((prev) => [
                                ...prev,
                                {
                                  code: item?.AncillaryCode,
                                  name: item?.Label,
                                  amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                                  quantity: 1,
                                },
                              ]);
                              dispatch(
                                setYourCart([
                                  ...featuredAddons,
                                  {
                                    code: item?.AncillaryCode,
                                    name: item?.Label,
                                    amount: Number(item?.SaleCurrencyAmount?.TotalAmount),
                                    quantity: 1,
                                  },
                                ])
                              );
                            }}
                          >
                            {item?.HtmlDescription &&
                              parse(item?.HtmlDescription?.replace(/style="[^"]*"/, ''))}
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
      ) : (
        load?.name === 'save' && <SavingDataLoader open={load?.show} />
      )}
    </Fragment>
  );
};

export default YourCart;