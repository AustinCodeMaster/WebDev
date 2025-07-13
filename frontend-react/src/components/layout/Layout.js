import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
