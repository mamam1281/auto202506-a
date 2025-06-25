import React from "react";
import { TokenDisplay } from "./TokenDisplay";
import { Star } from "lucide-react";

export default {
  title: "ui/data-display/TokenDisplay",
  component: TokenDisplay,
};

export const Default = () => <TokenDisplay amount={1234567} />;

export const WithIcon = () => (
  <TokenDisplay amount={987654} icon={<Star className="text-yellow-400" />} unit="GEM" />
);

export const LargeAmount = () => <TokenDisplay amount={1234567890} unit="CC" />;

export const CustomClass = () => (
  <TokenDisplay amount={42} className="text-2xl bg-[var(--color-primary-purple)]" />
);
