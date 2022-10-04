export const shortenAddress = (address: string) => {
  if (address)
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 4)
    );
};
