import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export default {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
};

export const Default = () => <LoadingSpinner />;
export const Large = () => <LoadingSpinner size="lg" />;
export const Accent = () => <LoadingSpinner color="accent" />;
export const WithText = () => <LoadingSpinner text="로딩 중..." />;
export const Classic = () => <LoadingSpinner variant="classic" />;
