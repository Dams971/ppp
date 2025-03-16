import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-[#19042b] text-white p-3">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <a href="/" >
                    <div className="flex items-center">
                        <img src="/img/1.png" alt="Logo" className="h-10 mr-2" />
                        <span className="text-white text-lg font-bold">Fur'Agora</span>
                    </div>
                </a>

                {/* Navigation Links */}
                <div className="flex sm:space-x-6 md:space-x-16 lg:space-x-22 xl:space-x-30 font-bold">
                    {/* Menu Participer avec sous-menu */}
                    <div className="group relative dropdown cursor-pointer tracking-wide">
                        <a className="hover:text-white mb-4">Participer</a>
                        {/* Sous-menu */}
                        <div className="group-hover:block dropdown-menu absolute hidden h-auto left-0 w-35 bg-white shadow-lg rounded-lg">
                            <div className="top-0">
                                <a href="/programme" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                                    Programme
                                </a>
                                <a href="/billetterie" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                                    Billetterie
                                </a>
                            </div>
                        </div>
                    </div>

                    <a href="/creator-area" className="hover:text-white">Creator Area</a>
                    <a href="/events" className="hover:text-white">Events</a>
                    <a href="/contribuer" className="hover:text-white">Contribuer</a>
                </div>

                {/* Login */}
                <a href="/login" className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-xl shadow-md transition">
                    Login
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
