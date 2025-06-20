import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

interface PaginationProps {
  pages: number[];
  setPage: (page: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ pages, setPage, currentPage }) => {
  // Determine if previous/next buttons should be disabled
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pages.length;

  const handlePrevClick = () => {
    if (!isFirstPage) {
      setPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!isLastPage) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className='pagination__search'>
      <ul>
        {/* Previous Button */}
        <span
          onClick={handlePrevClick}
          className={isFirstPage ? 'disabled' : ''} // Add disabled class for styling
          aria-disabled={isFirstPage} // Accessibility attribute
        >
          <AiOutlineArrowLeft />
        </span>

        {/* Page Numbers */}
        {pages.map((pg) => (
          <li
            className={currentPage === pg ? 'active_page' : ''}
            key={pg} // Use pg as key, as it's unique and stable
            onClick={() => {
              setPage(pg); // Only one call needed
            }}
          >
            {pg}
          </li>
        ))}

        {/* Next Button */}
        <span
          onClick={handleNextClick}
          className={isLastPage ? 'disabled' : ''} // Add disabled class for styling
          aria-disabled={isLastPage} // Accessibility attribute
        >
          <AiOutlineArrowRight />
        </span>
      </ul>
    </div>
  );
};

export default Pagination;