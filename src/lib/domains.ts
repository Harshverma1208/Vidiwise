"use server"

import verifyDomainValues from "~/config/domain.vercel";
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { env } from "~/env";
import {
  DomainResponse,
  DomainConfigResponse,
  DomainVerificationResponse,
} from "~/lib/types";
import { db } from "~/server/db";

export const addDomainToVercel = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v10/projects/${
     env.PROJECT_ID_VERCEL 
    }/domains${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
        // Optional: Redirect www. to root domain
        // ...(domain.startsWith("www.") && {
        //   redirect: domain.replace("www.", ""),
        // }),
      }),
    },
  ).then((res) => res.json());
};

export const removeDomainFromVercelProject = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${
      env.PROJECT_ID_VERCEL
    }/domains/${domain}${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
      },
      method: "DELETE",
    },
  ).then((res) => res.json());
};

export const removeDomainFromVercelTeam = async (domain: string) => {
  return await fetch(
    `https://api.vercel.com/v6/domains/${domain}${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
      },
      method: "DELETE",
    },
  ).then((res) => res.json());
};

export const getDomainResponse = async (
  domain: string,
): Promise<DomainResponse & { error: { code: string; message: string } }> => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${
      env.PROJECT_ID_VERCEL
    }/domains/${domain}${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => {
    return res.json();
  });
};

export const getConfigResponse = async (
  domain: string,
): Promise<DomainConfigResponse> => {
  return await fetch(
    `https://api.vercel.com/v6/domains/${domain}/config${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
};

export const verifyDomain = async (
  domain: string,
): Promise<DomainVerificationResponse> => {
  return await fetch(
    `https://api.vercel.com/v9/projects/${
      env.PROJECT_ID_VERCEL
    }/domains/${domain}/verify${
      env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""
    }`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());
};


export const getAllDomains = async() => {
    return await fetch(
        `https://api.vercel.com/v8/projects/${env.PROJECT_ID_VERCEL}/domains?teamId=${env.VERCEL_TEAM_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.AUTH_BEARER_TOKEN}`,
          },
        },
      ).then((res) => res.json());
    
}


export const domainConfigValuesAll = async(domain: string, add: boolean) => {
  if(add) {
    await addDomainToVercel(domain)
  }

  const configResponse = await getConfigResponse(domain)
  // console.log(configResponse)
        const misconfigured = {
            status: configResponse.misconfigured,
            type: verifyDomainValues[0]?.Type, 
            name: verifyDomainValues[0]?.Name,
            value: verifyDomainValues[0]?.Value, 
            ttl: verifyDomainValues[0]?.TTL
        }
       
        // verify domain res
      //  const verifyRes = await verifyDomain(domain)

       const verifyRes = await getDomainResponse(domain)
      //  console.log(res)
       
       console.log(verifyRes) 
        let verifyResponse: {
            status: boolean;
            type?: string;
            domain?: string;
            value?: string;
        } = {
            status: verifyRes.verified,
        }
        
      if(verifyRes?.verification && verifyRes.verification.length > 0) {
          verifyResponse = {
              status: verifyRes.verified,
              type: verifyRes.verification[0]?.type ?? "", 
              domain: verifyRes.verification[0]?.domain ?? "",
              value: verifyRes.verification[0]?.value ?? "",
          }
      }

    const isDomainVerified = verifyResponse.status == true && misconfigured.status == false
    
  return {
    misconfigured,
    verified: verifyResponse,
    isDomainVerified
  }
}


export const getSubdomain = (name: string, apexName: string) => {
  if (name === apexName) return null;
  return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string) => {
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    return "";
  }
  const parts = domain.split(".");
  if (parts.length > 2) {
    // if it's a subdomain (e.g. dub.vercel.app), return the last 2 parts
    return parts.slice(-2).join(".");
  }
  // if it's a normal domain (e.g. dub.sh), we return the domain
  return domain;
};
