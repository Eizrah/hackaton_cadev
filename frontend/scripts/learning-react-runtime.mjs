import React from "react";
import * as JSXRuntime from "react/jsx-runtime";
import * as ReactDOMClient from "react-dom/client";
import * as ReactRouter from "react-router-dom";

globalThis.__devafricaPackages = {
  react: React,
  "react/jsx-runtime": JSXRuntime,
  "react-dom/client": ReactDOMClient,
  "react-router-dom": ReactRouter,
};
