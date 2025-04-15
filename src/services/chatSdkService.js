import api from "./api";

export const GetSdkInfo = () => api.get("/sdk");

export const AuthSdk = (privatekey, publickey) => {
  return api.post(
    "/auth/sdk",
    { private_key: privatekey },
    {
      headers: {
        "x-api-key": publickey,
      },
    }
  );
};

export const CreateNewTicket = (customer, accessToken) => {
  return api.post(
    "/ticket",
    { customer },
    {
      headers: {
        "x-api-key": accessToken,
      },
    }
  );
};
