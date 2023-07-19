import moment from 'moment';

export const getDate = (date: string) => {
  const formatDate = moment(date).format('LL')?.split(',')[0]?.split(' ');
  const temp = formatDate[1];
  formatDate[1] = formatDate[0]?.slice(0, 3);
  formatDate[0] = temp;
  const finalDate =
    formatDate?.join(' ') +
    ' ' +
    moment(date).format('LL')?.split(',')[1]?.trim()?.substring(2, 4);
  return finalDate;
};
