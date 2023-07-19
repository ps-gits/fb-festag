import axios from 'axios';
import { Dispatch } from 'redux';

import { setOriginDetails, setDestinationDetails } from '../../reducer/AirportDetails';
import { loader } from '../../reducer/Loader';
import { url } from 'src/components/Api/ApiUrl';

export const getOriginDetails = () => (dispatch: Dispatch) => {
  axios
    .get(`${url}getOrigin`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((res) => {
      dispatch(
        loader({
          show: false,
          name: '',
        })
      );
      dispatch(setOriginDetails(res?.data?.data));
    })
    .catch((err) => {
      console.warn(err);
      dispatch(
        loader({
          show: false,
          name: '',
        })
      );
    });
};

export const getDestinationDetails = (originCode: string) => (dispatch: Dispatch) => {
  axios
    .post(
      `${url}getDestinations`,
      {
        OriginCode: originCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
    .then((res) => {
      dispatch(
        loader({
          show: false,
          name: '',
        })
      );
      dispatch(setDestinationDetails(res?.data?.data));
    })
    .catch((err) => {
      console.warn(err);
      dispatch(
        loader({
          show: false,
          name: '',
        })
      );
    });
};

