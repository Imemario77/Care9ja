export const parseTimestamp = (timestamp) => {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Extract date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = String(hours).padStart(2, "0");

  // Format the results
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

export const cleanData = (userdata) => {
  if (typeof userdata.user.user === "object") {
    return {
      ...userdata,
      user: {
        ...userdata.user.user,
        full_name: userdata.user.user.full_name,
        specialization: userdata.user.specialization,
      },
    };
  } else {
    return { ...userdata };
  }
};

export const useFormatedData = (data) => {
  if (Array.isArray(data)) {
    return data.map((data) => cleanData(data));
  }
};

// Format to YYYY-MM-DD HH:MM:SS
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
