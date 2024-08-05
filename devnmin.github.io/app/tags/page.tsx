"use client";
import Navbar from '../components/Navbar';
import { prefix } from "../../config/config";
import { PortfolioProvider } from "../../context/context";

export default function Tags() {
  return (
    <PortfolioProvider value={ { prefix } }>
      <div>
        <Navbar></Navbar>
        <h1>태그목록</h1>
      </div>
    </PortfolioProvider>
  );
}
