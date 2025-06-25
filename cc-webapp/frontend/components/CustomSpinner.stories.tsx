import React from "react";
import { CustomSpinner } from "./CustomProgress";

export default {
  title: "Components/CustomSpinner",
  component: CustomSpinner,
};

export const Default = () => <CustomSpinner />;
export const Large = () => <CustomSpinner size="lg" />;
export const Small = () => <CustomSpinner size="sm" />;
