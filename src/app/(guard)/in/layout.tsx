import Navbar from '@src/components/layouts/Navbar';
import Sidebar from '@src/components/layouts/Sidebar';
import React from 'react';


function GuardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 h-screen w-screen overflow-hidden bg-[#F4F4F4]">

      {/* Top contextual system tools */}
      <Navbar />

      {/* Main interface workspace */}
      <div className="flex h-full overflow-hidden">
        {/* Left-side Navigation panel */}
        <Sidebar />

        {/* Dynamic route viewports */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Top contextual system tools */}

          {children}
        </main>
      </div>
    </div>
  );
}

export default GuardLayout;