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
    
    

    return (
        <StyledHeader>
            <Logo src="/whitelogo.png" alt="CineNiche" onClick={handleHomeClick} />
            <NavMenu>
                <NavItem onClick={handleHomeClick}>Home</NavItem>
                <NavItem>Movies</NavItem>
                <NavItem>TV Shows</NavItem>
                <GenreSelect value={selectedGenre} onChange={handleGenreChange}>
                    <option value="all">Genres</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {formatGenreName(genre)}
                        </option>
                    ))}
                </GenreSelect>
            </NavMenu>

            <IconGroup>
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
                <StyledIcon as={FiUser} />
            </IconGroup>
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

const NavItem = styled.div`
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
`;

const GenreSelect = styled.select`
  background: transparent;
  border: none;
  color: white;
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