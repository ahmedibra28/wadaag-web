import axios from "axios";

const {
  WAAFI_PAY_MERCHANT_UID,
  WAAFI_PAY_API_USER_ID,
  WAAFI_PAY_API_KEY,
  WAAFI_PAY_MERCHANT_NO,
} = process.env;

const url = "https://waafipay.ahmedibra.com/api/v1/payments";

export const initPayment = async ({
  amount,
  mobile,
}: {
  amount: number;
  mobile: string;
}) => {
  try {
    const obj = {
      mobile,
      amount,
      credentials: {
        merchantUId: WAAFI_PAY_MERCHANT_UID,
        apiUId: WAAFI_PAY_API_USER_ID,
        apiKey: WAAFI_PAY_API_KEY,
        accountNumberToWithdraw: WAAFI_PAY_MERCHANT_NO,
      },
    };

    const { data } = await axios.post(url + "/initialize", obj);

    return data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || error?.message };
  }
};

export const refundPayment = async ({
  amount,
  transactionId,
  reason,
}: {
  amount: number;
  transactionId: string;
  reason?: string;
}) => {
  try {
    const obj = {
      transactionId,
      amount,
      reason: reason || "Refund",
      credentials: {
        merchantUId: WAAFI_PAY_MERCHANT_UID,
        apiUId: WAAFI_PAY_API_USER_ID,
        apiKey: WAAFI_PAY_API_KEY,
      },
    };

    const { data } = await axios.post(url + "/payments/refund", obj);

    return data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || error?.message };
  }
};
