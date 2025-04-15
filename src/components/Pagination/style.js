import styled from 'styled-components';

export const PaginationWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    justify-content: ${(props) => props.justify || 'flex-end'};
`;
