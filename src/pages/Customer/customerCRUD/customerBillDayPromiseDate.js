import moment from "moment";

// current date
const date = new Date();

// customer day left filtering in current date
export const getCustomerDayLeft = (billDate) => {
  //current day
  const currentDay = new Date(
    new Date(moment(date).format("YYYY-MM-DD"))
  ).getTime();

  // // billing day
  const billDay = new Date(
    new Date(moment(billDate).format("YYYY-MM-DD"))
  ).getTime();

  const diffInMs = billDay - currentDay;

  // // bill day left
  const dayLeft = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return dayLeft;
};

//find customer billing date before and after promise date
export const getCustomerPromiseDate = (data) => {
  const billDate = moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A");

  const promiseDate = moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A");

  var promiseDateChange;

  if (billDate < promiseDate) {
    promiseDateChange = "danger";
  } else if (billDate > promiseDate) {
    promiseDateChange = "warning";
  }

  return { billDate, promiseDate, promiseDateChange };
};
