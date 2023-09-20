interface modalType {
  id: string;
  name: string;
  editDate?: boolean;
  oneway?: boolean;
  modifyBooking?: boolean;
  showModal: boolean;
  closeModal: () => void;
  setOldDates?: () => void;
  originCode?: string;
  dateFlexible?: boolean;
  destinationCode?: string;
  adult?: number;
  childrens?: number;
  departDate?: Date | string; //new-added
  returnDate?: Date | string; //new-added
  setShowModal?: Dispatch<
    SetStateAction<{
      destination: boolean;
      depart: boolean;
      return: boolean;
      passenger: boolean;
      promoCode: boolean;
    }>
  >;
  setSelectFlight?: Dispatch<
    SetStateAction<{
      display: boolean;
      name: string;
      index: number;
      details: flightInfo;
    }>
  >;
  errorMessage?: {
    departure: string;
    returnDate: string;
  };
  setErrorMessage?: Dispatch<
    SetStateAction<{
      departure: string;
      returnDate: string;
    }>
  >;
  setShowFlightInfo?: Dispatch<SetStateAction<boolean>>;
  flightDetails?:
    | {
        departDate: Date | string; //new-added
        returnDate: Date | string; //new-added
        adult: number;
        dateFlexible: boolean;
        children: number;
        originCode: string;
        destinationCode: string;
      }
    | {
        adult: number;
        children: number;
      }
    | { departDate: Date; returnDate: Date; dateFlexible: boolean };
  setFlightDetails?: Dispatch<
    SetStateAction<{
      departDate: Dat | string;
      returnDate: Dat | string;
      adult: number;
      children: number;
      originCode: string;
      destinationCode: string;
    }>
  >;
  navigate?: boolean;
  fareFamilyName?: string;
  fareFamilyValue?: string;
  returnFlight?: boolean;
}

interface tabType {
  name?: string;
  tabName: string;
  fareFamily: string;
  showModal: {
    destination: boolean;
    depart: boolean;
    return: boolean;
    passenger: boolean;
    promoCode: boolean;
  };
  promoCode: string;
  dateFlexible: boolean;
  errorMessage: {
    departure: string;
    returnDate: string;
  };
  openSelectModal?: boolean;
  setOpenSelectModal?: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<
    SetStateAction<{
      departure: string;
      returnDate: string;
    }>
  >;
  setShowModal: Dispatch<
    SetStateAction<{
      destination: boolean;
      depart: boolean;
      return: boolean;
      passenger: boolean;
      promoCode: boolean;
    }>
  >;
  flightDetails: {
    departDate: Date | string; //new-added
    returnDate: Date | string; //new-added
    adult: number;
    dateFlexible: boolean;
    children: number;
    originCode: string;
    destinationCode: string;
  };
  setFlightDetails: Dispatch<
    SetStateAction<{
      departDate: Date | string;
      returnDate: Date | string;
      dateFlexible: boolean;
      adult: number;
      children: number;
      originCode: string;
      destinationCode: string;
    }>
  >;
  departDate: Date | string;
  returnDate?: Date | string;
  originCode: string;
  destinationCode: string;
  adult: number;
  childrens: number;
  getDate: (arg0: string) => string;
  dropdownOptions: {
    code: string;
    country: string;
    Label: string;
    _id: string;
    __v: number;
  }[];
  selectOptions: {
    country: string;
    code: string;
    Label: string;
  }[];
  loading: boolean;
  setSelectOptions: Dispatch<
    SetStateAction<
      {
        label: string;
        value: string;
      }[]
    >
  >;
  setLoading: Dispatch<SetStateAction<boolean>>;
  searchDataWithDelay: (...args: string[]) => void;
  dropdownOptionDestination?: {
    code: string;
    country: string;
    Label: string;
    _id: string;
    __v: number;
  }[];
}

interface searchFlights {
  PnrCode?: string;
  RefETTicketFare?: string;
  PassangerLastname?: string;
  DateFlexible?: boolean;
  Passengers: {
    Ref: string;
    RefClient: string;
    PassengerQuantity: number;
    PassengerTypeCode: string;
  }[];
  OriginDestinations: {
    TargetDate: Date;
    OriginCode: string;
    DestinationCode: string;
    Extensions: null;
  }[];
}

interface dropdownModal {
  name: string;
  tabName: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  originCode: string;
  destinationCode: string;
  errorMessage: {
    departure: string;
    returnDate: string;
  };
  setErrorMessage: Dispatch<
    SetStateAction<{
      departure: string;
      returnDate: string;
    }>
  >;
  selectOptions: {
    country: string;
    code: string;
    Label: string;
  }[];
  flightDetails: {
    departDate: Date | string; //new-added
    returnDate: Date | string; //new-added
    adult: number;
    dateFlexible: boolean;
    children: number;
    originCode: string;
    destinationCode: string;
  };
  setFlightDetails: Dispatch<
    SetStateAction<{
      departDate: Date | string; //new-added
      returnDate: Date | string; //new-added
      adult: number;
      dateFlexible: boolean;
      children: number;
      originCode: string;
      destinationCode: string;
    }>
  >;
  dropdownOptions: {
    country: string;
    code: string;
    Label: string;
    _id: string;
    __v: number;
  }[];
  openSelectModal?: boolean;
  setSelectOptions: Dispatch<
    SetStateAction<
      {
        Label: string;
      }[]
    >
  >;
  setOpenSelectModal?: Dispatch<SetStateAction<boolean>>;
  searchDataWithDelay: (...args: string[]) => void;
  closeModal?: () => void;
  textSize?: string;
}

interface flightInfo {
  DepartureDate: string;
  ArrivalDate: string;
  OriginCode: string;
  Otr: string;
  Dtr: string;
  DestinationCode: string;
  TotalAmount: number;
  BestPrice: string;
  BaseAmount: number;
  TaxAmount: number;
  Ref: string;
  RefItinerary: string;
  FaireFamilies: {
    orginDepartureDate: string;
    orginDepartureTime: string;
    originName: string;
    luxuryPickup: boolean;
    loungeAccess: boolean;
    BagAllowances: {
      Quantity: number;
      WeightMeasureQualifier: string;
      Weight: number;
    }[];
    destinationName: string;
    destinationArrivalDate: string;
    destinationArrivalTime: string;
  }[];
  cpd_code: string;
  symbol: string;
  currency: string;
}

interface flightAvaliabilityTab {
  passengerCount: {
    adult: number;
    children: number;
  };
  passengerLogo: string;
  noDataFound: string;
  notAvailable: string;
  adultLabel: string;
  childrenLabel: string;
  passengersLabel: string;
  modifyButton: string;
  fareFamily: string;
  confirmButton: string;
  router: NextRouter;
  modifyData: boolean;
  showModal: {
    depart: boolean;
    return: boolean;
    passenger: boolean;
  };
  setPassengerCount: Dispatch<
    SetStateAction<{
      adult: number;
      children: number;
    }>
  >;
  setShowModal: Dispatch<
    SetStateAction<{
      depart: boolean;
      return: boolean;
      passenger: boolean;
      compareFareFamily: boolean;
    }>
  >;
  selectFlight: {
    display: boolean;
    name: string;
    index: number;
    details: flightInfo;
  };
  setSelectFlight: Dispatch<
    SetStateAction<{
      display: boolean;
      name: string;
      index: number;
      details: flightInfo;
    }>
  >;
  PassangerLastname: string;
  PnrCode: string;
  showFlightInfo: boolean;
  setShowFlightInfo: Dispatch<SetStateAction<boolean>>;
}

interface detailsObj {
  Email?: string;
  Mobile: string;
  Firstname: string;
  Middlename: string;
  Surname: string;
  Dob: string;
  CivilityCode: string;
  Traveldocument: string;
  Homecontact: string;
  flagMobile?: string;
  validMobile?: string;
  dialCodeMobile: string;
}

interface flightDetails {
  showModal: {
    depart: boolean;
    return: boolean;
    passenger: boolean;
  };
  setShowModal: Dispatch<
    SetStateAction<{
      depart: boolean;
      return: boolean;
      passenger: boolean;
    }>
  >;
  setSelectFlight: Dispatch<
    SetStateAction<{
      display: boolean;
      name: string;
      index: number;
      details: flightInfo;
    }>
  >;
  setShowFlightInfo: Dispatch<SetStateAction<boolean>>;
}

interface postCreateBooking {
  booking: {
    PassengerDetails: detailsObj;
    SpecialServices: object;
    Documents: {
      IssueCountryCode: string;
      NationalityCountryCode: string;
      DateOfBirth: string;
      Gender: string;
      DocumentExpiryDate: string;
      DocumentIssuanceDate: string;
      Firstname: string;
      Surname: string;
      DocumentTypeCode: string;
      DocumentNumber: string;
    }[];
  }[];
  AncillaryData?:
    | {
        name: string;
        amount: number;
      }[]
    | [];
  RefItinerary?: string;
  Ref?: string;
  PnrCode?: string;
  RefETTicketFare?: string;
  PassangerLastname?: string;
  PassengerName?: string;
  SeatMap?: {
    departure: {
      AssociatedAncillaryCode: string;
      Extensions: null;
      Firstname: string;
      IsAvailable: boolean;
      Letter: string;
      PassengerTypeCodeRestrictions: [];
      RefPassenger: null;
      SeatTypeCode: string;
      SpecialServiceCodeRestrictions: [];
      Surname: string;
    }[];
    arrival: {
      AssociatedAncillaryCode: string;
      Extensions: null;
      Firstname: string;
      IsAvailable: boolean;
      Letter: string;
      PassengerTypeCodeRestrictions: [];
      RefPassenger: null;
      SeatTypeCode: string;
      SpecialServiceCodeRestrictions: [];
      Surname: string;
    }[];
  };
  EMDTicketFareOptions?: {
    AncillaryCode: string;
  }[];
  MealsDetails: {
    departure: { Code: string; Label: string }[];
    arrival: { Code: string; Label: string }[];
  };
}

interface postPrepareFlight {
  RefItinerary: string;
  Ref: string;
  FareFamily: string;
  PnrCode?: string;
  PassangerLastname?: string;
}

interface getEligibleOriginDestinationDates {
  OriginCode: string;
  DestinationCode: string;
}

interface promoCodeModal {
  id: string;
  promoCode: string;
  showModal: boolean;
  closeModal: () => void;
  flightDetails: {
    departDate: Date | string; //new-added
    returnDate: Date | string; //new-added
    adult: number;
    children: number;
    originCode: string;
    destinationCode: string;
  };
  setFlightDetails: Dispatch<
    SetStateAction<{
      departDate: Date | string;
      returnDate: Date | string;
      adult: number;
      children: number;
      originCode: string;
      destinationCode: string;
    }>
  >;
}

interface DateOfBirthModal {
  id: string;
  name: string;
  type: string;
  index: number;
  showModal: boolean;
  selectedDate: string;
  closeModal: () => void;
  setFieldValue: (arg0: string, arg1: string) => void;
}

interface selectedFareFamily {
  originName: string;
  orginDepartureTime: string;
  orginDepartureDate: string;
  luxuryPickup: boolean;
  loungeAccess: boolean;
  BagAllowances: {
    Quantity: string;
    Weight: string;
    WeightMeasureQualifier: string;
    TotalWeight: string;
  }[];
  destinationName: string;
  destinationArrivalTime: string;
  destinationArrivalDate: string;
  FlightNumber: string;
  Remarks: string;
  Stops: {
    LocationCode: string;
  }[];
  Duration?: string;
  AircraftType?: string;
  OriginAirportTerminal: string;
  DestinationAirportTerminal: string;
  WebClass: string;
}

interface youngAdultAgeModal {
  id: string;
  tabIndex?: number;
  changeIndex?: {
    name: string;
    index: number;
  };
  showModal: boolean;
  lastIndex?: boolean;
  values?: detailsObj[];
  submitForm?: () => void;
  setShowModal?: Dispatch<
    SetStateAction<{
      young: boolean;
      adult: boolean;
      depart: boolean;
      return: boolean;
    }>
  >;
  closeModal: () => void;
  ageChangesAccecpted?: number[];
  setTabIndex?: Dispatch<SetStateAction<number>>;
  setAgeChangesAccecpted?: (value: SetStateAction<number[]>) => void;
  setPassengerValues?: (value: SetStateAction<detailsObj[]>) => void;
}

interface flightSchedule {
  index: number;
  seats: boolean;
  meals?: boolean;
  special?: boolean;
  WebClass?: string;
  Remarks: string;
  Duration?: string;
  AircraftType?: string;
  OriginAirportTerminal?: string;
  DestinationAirportTerminal?: string;
  Stops: {
    LocationCode: string;
  }[];
  bagAllowances:
    | {
        Quantity: string;
        Weight: string;
        WeightMeasureQualifier: string;
        TotalWeight: string;
      }
    | {
        Quantity: string;
        Weight: string;
        WeightMeasureQualifier: string;
        TotalWeight: string;
      }[];
  originCode: string;
  arrivalDate: string;
  arrivalTime: string;
  luxuryPickup: boolean;
  loungeAccess: boolean;
  departureDate: string;
  departureTime: string;
  destinationCode: string;
  originAirportName: string;
  FlightNumber?: string;
  destinationAirportName: string;
  seatsDestinationToOrigin?: { Text: string }[];
  seatsOriginToDestination?: { Text: string }[];
  originToDestinationSeatData?: {
    Firstname: string;
    Surname: string;
    Dob: string;
    seatLabel: string;
    Text: string;
  }[];
  destinationToOriginSeatData?: {
    Firstname: string;
    Surname: string;
    Dob: string;
    seatLabel: string;
    Text: string;
  }[];
  mealDataWithPassengerInfo?: {
    Firstname: string;
    Surname: string;
    originMeal: string;
    returnMeal: string;
    Dob: string;
  }[];
  // selectedItem: null | number;
  // setSelectedItem: (arg0: SetStateAction<number | null>) => void;
}

interface compareFareFamily {
  id: string;
  setShowModal: Dispatch<
    SetStateAction<{
      depart: boolean;
      return: boolean;
      passenger: boolean;
      compareFareFamily: boolean;
    }>
  >;
  showModal: boolean;
}

interface codesInCurve {
  originCode: string;
  destinationCode: string;
  originCity: string;
  destinationCity: string;
  oneway: boolean;
}

interface bookingDetails {
  BagAllowances: {
    Quantity: string;
    Weight: string;
    WeightMeasureQualifier: string;
    TotalWeight: string;
  };
  OriginCode: string;
  ArrivalDate: string;
  Duration?: string;
  AircraftType?: string;
  OriginAirportTerminal?: string;
  DestinationAirportTerminal?: string;
  DepartureDate: string;
  DestinationCode: string;
  OrginDepartureTime: string;
  DestinationArrivalTime: string;
  Lounge: boolean;
  Luxury: boolean;
  FlightNumber: string;
  OriginName: string;
  DestinationName: string;
  Remarks: string;
  WebClass : string;
  Stops: {
    LocationCode: string;
  }[];
}

interface modifyBookingDetailsModal {
  id: string;
  adult?: number;
  childrens?: number;
  showModal: boolean;
  returnDate: string;
  departDate: string;
  closeModal: () => void;
  fareFamilyName?: string;
  datesModify: () => void;
  seatsModify: () => void;
  cancelBooking: () => void;
  passengerModify?: () => void;
  seatsLabel?: { Text: string }[];
}

interface postCreateTicket {
  ID: string;
  PassengerName: string;
  Amount: number;
}

interface seatDetails {
  Firstname: string;
  Surname: string;
  Dob?: string;
  seatLabel?: string;
  mapIndex: number;
  price: number;
  AssociatedAncillaryCode: string;
  seatNumber: string;
  passengerIndex: number;
  rowNumber: number;
  AircraftName: string;
  RefSegment: string;
  Text: string;
}

interface flightSeat {
  Letter: string;
  IsAvailable: boolean;
  AssociatedAncillaryCode: string;
  Extensions: null;
  PassengerTypeCodeRestrictions: never[];
  RefPassenger: null;
  SeatTypeCode: string;
  SpecialServiceCodeRestrictions: never[];
}

interface mealObjectKeys {
  originMeal: string;
  originMealCode: string;
  returnMeal: string;
  returnMealCode: string;
  passengerName: string;
  passengerIndex: number;
  FirstName?: string;
  Surname?: string;
  Dob?: string;
}

interface cookiesList {
  title: string;
  description: string;
  detailedDescription: string;
}

interface createAccountValues {
  CivilityCode: string;
  Emails: { Email: string; Type: string }[];
  FirstName: string;
  Surname: string;
  MiddleName: string;
  Password: string;
  ConfirmPassword: string;
}

interface familyFieldValues {
  CivilityCode: string;
  Emails: { Email: string; Type: string }[];
  FirstName: string;
  Surname: string;
  MiddleName: string;
  Phones: {
    flagPhone: string;
    validPhone: string;
    PhoneNumber: string;
    PhoneTypeCode: string;
    PhoneLocationTypeCode: string;
  }[];
  TypeCode: string;
  CultureName: string;
  Currency: string;
  Login: string;
  CompanyName: string;
  BirthDate: string;
  Addresses: {
    Ref: string;
    TypeCode: string;
    Address1: string;
    ZipCode: string;
    City: string;
    CountryNameOrCode: string;
  }[];
  Documents: {
    Ref: string;
    IssueCountryCode: string;
    NationalityCountryCode: string;
    Gender: string;
    DocumentExpiryDate: string;
    DocumentIssuanceDate: string;
    Firstname: string;
    Surname: string;
    DocumentTypeCode: string;
    DocumentNumber: string;
  }[];
}

interface arrayValueCreateAccount {
  Ref: string;
  IssueCountryCode: string;
  NationalityCountryCode: string;
  Gender: string;
  DocumentExpiryDate: string;
  DocumentIssuanceDate: string;
  Firstname: string;
  Surname: string;
  DocumentTypeCode: string;
  DocumentNumber: string;
  TypeCode: string;
  Address1: string;
  ZipCode: string;
  City: string;
  CountryNameOrCode: string;
  PhoneNumber: string;
  PhoneTypeCode: string;
  PhoneLocationTypeCode: string;
  Email: string;
}

interface errorMessageType {
  showToast: {
    show: boolean;
    status: number;
    message: string;
  };
  setShowToast?: Dispatch<
    SetStateAction<{
      show: boolean;
      status: number;
      message: string;
    }>
  >;
}

interface subscribeUser {
  Name?: string;
  Email: string;
  Mobile?: string;
}

interface toastMessageType {
  showToaster: {
    show: boolean;
    status: string;
    message: string;
  };
  setShowToaster?: Dispatch<
    SetStateAction<{
      show: boolean;
      status: string;
      message: string;
    }>
  >;
}