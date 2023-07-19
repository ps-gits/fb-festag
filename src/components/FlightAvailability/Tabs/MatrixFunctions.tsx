export const commonDepartureData = (flightData: { Otr: string }[]) => {
  const departureData = flightData
    ?.filter(
      (item: { Otr: string }, index: number) =>
        index ===
        flightData?.findIndex(
          (dt: { Otr: string }) =>
            dt?.Otr?.split('T')[0]?.trim() === item?.Otr?.split('T')[0]?.trim()
        )
    )
    ?.sort(
      (a: { Otr: string | number | Date }, b: { Otr: string | number | Date }) =>
        new Date(a?.Otr).valueOf() - new Date(b?.Otr).valueOf()
    );
  return departureData;
};

export const commonArrivalData = (flightData: { Dtr: string }[]) => {
  const arrivalData = flightData
    ?.filter(
      (item: { Dtr: string }, index: number) =>
        index ===
        flightData?.findIndex(
          (dt: { Dtr: string }) =>
            dt?.Dtr?.split('T')[0]?.trim() === item?.Dtr?.split('T')[0]?.trim()
        )
    )
    ?.sort(
      (a: { Dtr: string | number | Date }, b: { Dtr: string | number | Date }) =>
        new Date(a?.Dtr).valueOf() - new Date(b?.Dtr).valueOf()
    );
  return arrivalData;
};

export const completeFlightDetails = {
  DepartureDate: '',
  ArrivalDate: '',
  OriginCode: '',
  Otr: '',
  Dtr: '',
  DestinationCode: '',
  TotalAmount: 0,
  BestPrice: '',
  BaseAmount: 0,
  TaxAmount: 0,
  Ref: '',
  RefItinerary: '',
  FaireFamilies: [
    {
      orginDepartureDate: '',
      orginDepartureTime: '',
      originName: '',
      luxuryPickup: true,
      loungeAccess: true,
      BagAllowances: [
        {
          Quantity: 0,
          WeightMeasureQualifier: '',
          Weight: 0,
        },
      ],
      destinationName: '',
      destinationArrivalDate: '',
      destinationArrivalTime: '',
    },
  ],
  cpd_code: '',
  symbol: '',
  currency: '',
};
