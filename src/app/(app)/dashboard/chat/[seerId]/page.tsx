"use client";

import React from "react";
import { use } from "react";
import ChatPageComponent from "../ChatPageComponent";

const Page = ({ params }: { params: Promise<{ seerId: string }> }) => {
  const resolvedParams = use(params);
  const { seerId } = resolvedParams;
  const urlSeerId = Array.isArray(seerId) ? seerId[0] : seerId;

  return <ChatPageComponent id={urlSeerId} />;
};

export default Page;
