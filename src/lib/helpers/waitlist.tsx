"use server";

import { env } from "~/env";

export const joinWaitlist = async (email: string) => {
  
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.LOOPS_EMAIL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      firstName: "John",
      lastName: "Doe",
      source: "supaclip-waitlist",
    }),
  };

  return fetch("https://app.loops.so/api/v1/contacts/create", options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => err);
};
