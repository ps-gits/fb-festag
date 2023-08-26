import axios from 'axios';
import { Dispatch } from 'redux';
import { NextRouter } from 'next/router';

import { url } from 'src/components/Api/ApiUrl';
import { loader } from 'src/redux/reducer/Loader';
import { setSignIn, setCreateAccount, setFamilyDetails, setPassengerUpdate } from 'src/redux/reducer/CreateAccount';

export const postCreateAccount =
  (createAccountData: createAccountValues, router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}signup`, createAccountData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
        router.push('/signin');
        dispatch(setCreateAccount(res?.data?.data));
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

export const postSignIn =
  (signIn: { Login: string; Password: string }, router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}login`, signIn, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
        router.push('/myprofile');
        dispatch(setSignIn(res?.data?.data));
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

export const getFamilyDetails = (userId: string) => (dispatch: Dispatch) => {
  axios
    .get(`${url}users/profileData/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((res) => {
      setTimeout(() => {
        dispatch(
          loader({
            show: false,
            name: '',
          })
        );
      }, 1000);
      dispatch(setFamilyDetails(res?.data?.data));
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

export const postPassengerUpdate =
  (updateData: familyFieldValues[], router: NextRouter) => (dispatch: Dispatch) => {
    axios
      .post(`${url}users/updateUser`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then((res) => {
        setTimeout(() => {
          dispatch(
            loader({
              show: false,
              name: '',
            })
          );
        }, 1000);
        router.push('/myprofile');
        dispatch(setPassengerUpdate(res?.data?.data));
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
