
import styled from "styled-components";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";
import React, { useState } from "react";

export interface HeaderProps {
    allMovies: MovieType[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    loadMovies: (size?: number, page?: number) => void;
    handleShowAddMovieForm: () => void;
    loading: boolean;
}

const AdminHeader = ({
                         searchQuery,
                         setSearchQuery,
                         loadMovies,
                         handleShowAddMovieForm,
                     }: HeaderProps) => {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearch = () => {
        loadMovies(); // ✅ trigger search with current query
    };

    return (
        <StyledHeader>
            <Logo src="/whitelogo.png" alt="CineNiche" onClick={() => navigate("/browse")} />
            <NavMenu>
                <NavItem onClick={() => navigate("/browse")}>Home</NavItem>
                <NavItem onClick={handleShowAddMovieForm}>Add Movie</NavItem>
            </NavMenu>
            <IconGroup>
                {searchOpen && (
                    <SearchInput
                        type="text"
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch(); // ✅ ENTER pressed
                            }
                        }}
                        autoFocus={searchOpen}
                    />
                )}
                <StyledIcon
                    as={FiSearch}
                    onClick={() => {
                        if (searchOpen) {
                            handleSearch(); // ✅ SEARCH ICON clicked
                        }
                        setSearchOpen(true); // open input if not open
                    }}
                />
                <StyledIcon as={FiUser} />
            </IconGroup>
        </StyledHeader>
    );
};

export default AdminHeader;

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

const NavItem = styled.div`
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
`;

const IconGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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

const Spinner = styled.div`
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top: 3px solid white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    animation: spin 0.6s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
