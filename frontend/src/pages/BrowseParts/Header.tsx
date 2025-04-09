import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../../types/MovieType";
import React, { useState } from "react";


export interface HeaderProps {
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    genres: string[];
    formatGenreName: (genre: string) => string;
    allMovies: MovieType[];
}



const Header = ({ selectedGenre, setSelectedGenre, genres, formatGenreName, allMovies }: HeaderProps) => {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery(""); // reset input
            setSearchOpen(false); // close input
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const genre = e.target.value;
        navigate(`/browse?genre=${genre}`);
    };


    const handleHomeClick = () => {
        navigate("/browse");
        setTimeout(() => setSelectedGenre("all"), 0);
    };

    
    const isGenreSelected = () => {
        return selectedGenre !== "all" && !window.location.search.includes("type=");
    };


    const handleLogout = async () => {
        try {
            await fetch("https://localhost:5001/logout", {
                method: "POST",
                credentials: "include",
            });
            window.location.href = "/"; // or navigate("/login") if you have a login page
        } catch (error) {
            console.error("Logout failed", error);
        }
    };




    return (
        <StyledHeader>
            <LogoWrapper>
                <Logo src="/whitelogo.png" alt="CineNiche" onClick={handleHomeClick} />
            </LogoWrapper>
            <NavMenu>
                <NavItem
                    $active={location.pathname === "/browse" && !location.search.includes("type=") && selectedGenre === "all"}
                    onClick={handleHomeClick}
                >
                    Home
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=Movies")}
                    onClick={() => navigate("/browse?type=Movies")}
                >
                    Movies
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=TV-Shows")}
                    onClick={() => navigate("/browse?type=TV-Shows")}
                >
                    TV Shows
                </NavItem>

                <GenreSelect
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    $active={isGenreSelected()}
                >
                    <option value="all">Genres</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {formatGenreName(genre)}
                        </option>
                    ))}
                </GenreSelect>

            </NavMenu>

            <IconWrapper>
                {searchOpen && (
                    <SearchInput
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        autoFocus
                    />
                )}
                <StyledIcon as={FiSearch} onClick={() => setSearchOpen(!searchOpen)} />
                <UserWrapper>
                    <StyledIcon as={FiUser} onClick={() => setDropdownOpen(!dropdownOpen)} />
                    {dropdownOpen && (
                        <Dropdown>
                            <button onClick={handleLogout}>Log Out</button>
                        </Dropdown>
                    )}
                </UserWrapper>

            </IconWrapper>

        </StyledHeader>
    );
};


export default Header;


const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), transparent);
`;

const Logo = styled.img`
  height: 60px;
  object-fit: contain;
  cursor: pointer;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavItem = styled.div<{ $active?: boolean }>`
    color: ${({ $active }) => ($active ? "white" : "gray")};
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
`;



const GenreSelect = styled.select<{ $active?: boolean }>`
    background: transparent;
    border: none;
    color: ${({ $active }) => ($active ? "white" : "gray")};
    font-size: 1.125rem;
    font-weight: 600;
    appearance: none;
    cursor: pointer;
    padding: 4px 8px;

    option {
        background: #000;
        color: white;
    }
`;


const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    width: 250px; /* Reserve space so center stays centered */
    justify-content: flex-end;
`;

const LogoWrapper = styled.div`
  width: 340px;
  display: flex;
  align-items: center;
`;


const StyledIcon = styled.div`
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  font-size: 1rem;
  border: 1px solid white;
  border-radius: 4px;
  margin-right: 12px;
  background-color: black;
  color: white;
  width: 200px;
`;


const UserWrapper = styled.div`
    position: relative;
`;

const Dropdown = styled.div`
    position: absolute;
    top: 38px;
    right: 0;
    background-color: #121212;
    border-radius: 12px;
    padding: 0px 0px;
    z-index: 10;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    background-image: linear-gradient(to right, white 50%, #121212 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.4s ease;

    animation: slideDown 0.3s ease forwards;

    &:hover {
        background-position: left bottom;
    }

    &:hover button {
        color: black;
    }

    button {
        background: none;
        border: none;
        color: white;
        font-weight: 500;
        font-size: 1rem;
        transition: color 0.4s ease;
        z-index: 1;
        white-space: nowrap;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
