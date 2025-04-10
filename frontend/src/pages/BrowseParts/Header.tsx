import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../../types/MovieType";
import React, { useState, useEffect, useRef } from "react";
import Logout from "../../components/Logout";
import AdminButton from "../../components/AdminButton";

export interface HeaderProps {
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    genres: string[];
    formatGenreName: (genre: string) => string;
    allMovies: MovieType[];
}

const Header = ({
                    selectedGenre,
                    setSelectedGenre,
                    genres,
                    formatGenreName,
                    allMovies,
                }: HeaderProps) => {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const userMenuWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("https://localhost:5001/user/info", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.roles?.includes("Administrator")) {
                        setUserRole("Administrator");
                    } else {
                        setUserRole("User"); // Optional fallback
                    }
                } else {
                    console.error("Failed to fetch user info");
                }
            } catch (err) {
                console.error("Error fetching user info", err);
            }
        };

        fetchUserInfo();

        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuWrapperRef.current &&
                !userMenuWrapperRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const genre = e.target.value;
        navigate(`/browse?genre=${genre}`);
    };

    const handleHomeClick = () => {
        window.location.href = "/browse";
    };

    const handleMoviesClick = () => {
        window.location.href = "/browse?type=Movies";
    };

    const handleTVClick = () => {
        window.location.href = "/browse?type=TV-Shows";
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };
    

    const isGenreSelected = () => {
        return selectedGenre !== "all" && !window.location.search.includes("type=");
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
                    onClick={handleMoviesClick}
                >
                    Movies
                </NavItem>

                <NavItem
                    $active={location.search.includes("type=TV-Shows")}
                    onClick={handleTVClick}
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
                        $visible={searchOpen}
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        autoFocus
                    />

                )}
                <StyledIcon as={FiSearch} onClick={() => setSearchOpen(!searchOpen)} />
                <StyledIcon as={FiUser} onClick={() => setUserMenuOpen(!userMenuOpen)} />

                {userMenuOpen && (
                    <UserDropdown ref={userMenuRef}>
                        <Logout>Logout</Logout>
                        {userRole === "Administrator" && <AdminButton>Admin</AdminButton>}
                    </UserDropdown>
                )}
            </IconWrapper>
        </StyledHeader>
    );
};

export default Header;

// Styled Components

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
    justify-content: flex-end;
    position: relative;
    min-width: 240px;
    flex-shrink: 0;

    > * {
        flex-shrink: 0;
    }
`;

const LogoWrapper = styled.div`
  width: 340px;
  display: flex;
  align-items: center;
`;

const StyledIcon = styled.div`
    width: 24px;
    height: 24px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`;

const SearchInput = styled.input<{ $visible: boolean }>`
    padding: 6px 12px;
    font-size: 1rem;
    border: 1px solid white;
    border-radius: 4px;
    background-color: black;
    color: white;
    width: ${({ $visible }) => ($visible ? "200px" : "0")};
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    margin-right: ${({ $visible }) => ($visible ? "12px" : "0")};
    transition: all 0.4s ease;
    overflow: hidden;
    white-space: nowrap;
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;


const UserDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 24px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  color: white;
  z-index: 999;
  min-width: 120px;

  a.logout,
  a.admin-button {
    color: white;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 6px 10px;
    border-radius: 6px;
    transition: background 0.3s;

    &:hover {
      background: #222;
    }
  }
`;
