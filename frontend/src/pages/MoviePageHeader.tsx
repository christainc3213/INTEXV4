import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";
import React, { useState, useEffect, useRef } from "react";
import Logout from "../components/Logout";
import AdminButton from "../components/AdminButton";

export interface HeaderProps {
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    genres: string[];
    formatGenreName: (genre: string) => string;
    allMovies: MovieType[];
}

const MovieHeader = ({
                    selectedGenre,
                    setSelectedGenre,
                    genres,
                    formatGenreName,
                    allMovies,
                }: HeaderProps) => {
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const userMenuWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/user/info", {
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

    const handleHomeClick = () => {
        navigate("/browse");
        setTimeout(() => setSelectedGenre("all"), 0);
    };

    return (
        <StyledHeader>
            <LogoWrapper>
                <Logo src="/whitelogo.png" alt="CineNiche" onClick={handleHomeClick} />
            </LogoWrapper>
            <NavMenu>
                <NavItem
                    $active={
                        location.pathname === "/browse" &&
                        !location.search.includes("type=") &&
                        selectedGenre === "all"
                    }
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
            </NavMenu>

            <IconWrapper>
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

export default MovieHeader;

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
  width: 250px;
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
