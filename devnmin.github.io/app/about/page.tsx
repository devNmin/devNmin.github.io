"use client";
import Navbar from '../components/Navbar';
import { prefix } from "../../config/config";
import { PortfolioProvider } from "../../context/context";
export default function About() {
  return (
    <PortfolioProvider value={ { prefix } }>
      <div>
        <Navbar></Navbar>
        <h1>About me</h1>
      </div>
    </PortfolioProvider>
  );
}
