const addCommas = (value?: string | number, abbreviate: boolean = false, noFixed?: boolean): string => {
  if (!value) return "";
  value = value.toString().replace(/,/g, "");

  // Format the number with commas
  if (!abbreviate) {
    return Number(value).toLocaleString() || "";
  }

  const num = Number(value);

  const absNum = Math.abs(num);
  let formatted = "";

  if (absNum >= 1e12) {
    formatted = `${(num / 1e12).toFixed(noFixed ? 0 : 2)}T`;
  } else if (absNum >= 1e9) {
    formatted = `${(num / 1e9).toFixed(noFixed ? 0 : 2)}B`;
  } else if (absNum >= 1e6) {
    formatted = `${(num / 1e6).toFixed(noFixed ? 0 : 2)}M`;
  } else if (absNum >= 1e3) {
    formatted = `${(num / 1e3).toFixed(noFixed ? 0 : 1)}K`;
  } else {
    formatted = num.toString();
  }

  return formatted;
};

const formatCurrency = (value: string | number | undefined, abbreviate: boolean = false): string => {
  if (!value) return "₦0";

  const num = Number(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "₦0";

  if (!abbreviate) {
    return `₦${num.toLocaleString()}`;
  }

  const absNum = Math.abs(num);
  let formatted = "";

  if (absNum >= 1e12) {
    formatted = `${(num / 1e12).toFixed(2)}T`;
  } else if (absNum >= 1e9) {
    formatted = `${(num / 1e9).toFixed(2)}B`;
  } else if (absNum >= 1e6) {
    formatted = `${(num / 1e6).toFixed(2)}M`;
  } else if (absNum >= 1e3) {
    formatted = `${(num / 1e3).toFixed(1)}K`;
  } else {
    formatted = num.toString();
  }

  return `₦${formatted}`;
};

// Function to remove commas from a number string
const removeCommas = (num: string, type?: "string"): string | number => {
  const formatted = num.replace(/,/g, "");
  if (!type) {
    return !isNaN(parseInt(formatted)) ? parseInt(formatted) : formatted;
  }
  return formatted;
};

export { addCommas, removeCommas, formatCurrency };
