export const getFieldName = (
  sitecoreData: { name: string; value: string }[],
  fieldName: string
) => {
  return sitecoreData?.find((item: { name: string }) => item?.name === fieldName)?.value as string;
};

export const getImageSrc = (
  sitecoreData: { name: string; jsonValue: { value: { src: string } } }[],
  fieldName: string
) => {
  return sitecoreData?.find((item: { name: string }) => item?.name === fieldName)?.jsonValue?.value
    ?.src as string;
};

