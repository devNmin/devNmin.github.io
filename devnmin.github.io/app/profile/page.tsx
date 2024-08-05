"use client";
import Navbar from '../components/Navbar';
import { prefix } from "../../config/config";
import { PortfolioProvider } from "../../context/context";

export default function Profile() {
  return (
    <PortfolioProvider value={ { prefix } }>
      <div>
        <Navbar></Navbar>
        <h1>My Profile</h1>
      </div>
    </PortfolioProvider>
  );
}
