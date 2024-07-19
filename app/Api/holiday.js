import React, { useEffect, useState } from 'react';

const Holiday = {
  date: String,
  name: String
};

const parseHolidays = (json) => {
  const holidaysMap = JSON.parse(json);
  return Object.entries(holidaysMap).map(([date, name]) => ({ date, name }));
};

const fetchHolidays = async () => {
  try {
    const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    if (response.ok) {
      const json = await response.text();
      return json;
    } else {
      console.error("Failed to fetch holidays:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return null;
  }
};

export { fetchHolidays, parseHolidays };

