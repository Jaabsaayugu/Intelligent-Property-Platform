import * as React from "react";

export const FormField = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const FormItem = ({ children }: { children: React.ReactNode }) => <div className="">{children}</div>;
export const FormLabel = ({ children }: { children: React.ReactNode }) => <label className="block mb-1 font-medium">{children}</label>;
export const FormControl = ({ children }: { children: React.ReactNode }) => <div className="">{children}</div>;
export const FormMessage = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-red-500">{children}</p>;