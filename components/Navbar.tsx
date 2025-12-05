import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useData } from "../contexts/DataContext";

function Navbar() {
  const router = useRouter();
  const { account, loadWeb3 } = useData();

  return (
    <>
      <nav className="w-full h-20 mt-4 mx-auto max-w-7xl sticky top-2 z-50 px-2 sm:px-4">
        <div className="flex flex-row justify-between items-center h-full px-4 rounded-2xl bg-brand-gradient shadow-brand-soft">
          <Link href="/" passHref>
            <span className="font-semibold text-2xl cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-white via-cyanbrand to-cyan-100 tracking-tight">
              Polymarket
            </span>
          </Link>
          {!router.asPath.includes("/market") &&
            !router.asPath.includes("/admin") && (
              <div className="flex flex-row items-center justify-center h-full space-x-1 bg-white bg-opacity-10 rounded-full px-1 py-0.5">
                <TabButton
                  title="Market"
                  isActive={router.asPath === "/"}
                  url={"/"}
                />
                <TabButton
                  title="For You"
                  isActive={router.asPath === "/foryou"}
                  url={"/foryou"}
                />
                <TabButton
                  title="Portfolio"
                  isActive={router.asPath === "/portfolio"}
                  url={"/portfolio"}
                />
              </div>
            )}
          {account ? (
            <div className="px-5 py-2 rounded-full cursor-default bg-white bg-opacity-10 border border-cyanbrand/60 shadow-brand-card">
              <span className="text-sm text-white number-mono tracking-wide">
                {account.substr(0, 10)}...
              </span>
            </div>
          ) : (
            <div
              className="px-6 py-2 rounded-full cursor-pointer cta-primary shadow-brand-card text-sm font-semibold text-white tracking-wide"
              onClick={() => {
                loadWeb3();
              }}
            >
              <span>Connect Wallet</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

const TabButton = ({
  title,
  isActive,
  url,
}: {
  title: string;
  isActive: boolean;
  url: string;
}) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-9 px-4 flex items-center text-sm font-semibold rounded-full cursor-pointer transition-all ${
          isActive
            ? "tab-gradient-active shadow-brand-card"
            : "text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10"
        }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};
