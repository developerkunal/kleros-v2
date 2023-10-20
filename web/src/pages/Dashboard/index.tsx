import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { OrderDirection } from "src/graphql/graphql";
import { DisputeDetailsFragment, useMyCasesQuery } from "queries/useCasesQuery";
import { useUserQuery } from "queries/useUser";
import { decodeURIFilter, useRootPath } from "utils/uri";
import CasesDisplay from "components/CasesDisplay";
import ConnectWallet from "components/ConnectWallet";
import JurorInfo from "./JurorInfo";
import Courts from "./Courts";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: calc(24px + (136 - 24) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-top: calc(32px + (80 - 32) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-bottom: calc(76px + (96 - 76) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  max-width: 1780px;
  margin: 0 auto;
`;

const StyledCasesDisplay = styled(CasesDisplay)`
  margin-top: 64px;

  h1 {
    margin-bottom: calc(16px + (48 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  }
`;

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primaryText};
`;

const Dashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { page, order, filter } = useParams();
  const location = useRootPath();
  const navigate = useNavigate();
  const casesPerPage = 3;
  const pageNumber = parseInt(page ?? "1");
  const disputeSkip = casesPerPage * (pageNumber - 1);
  const decodedFilter = decodeURIFilter(filter ?? "all");
  const { data: disputesData } = useMyCasesQuery(
    address,
    disputeSkip,
    decodedFilter,
    order === "asc" ? OrderDirection.Asc : OrderDirection.Desc
  );
  const { data: userData } = useUserQuery(address, decodedFilter);
  const totalCases = userData?.user?.disputes.length;
  const totalPages = Math.ceil(totalCases / casesPerPage);

  return (
    <Container>
      {isConnected ? (
        <>
          <JurorInfo />
          <Courts />
          <StyledCasesDisplay
            title="My Cases"
            disputes={disputesData?.user?.disputes as DisputeDetailsFragment[]}
            numberDisputes={totalCases}
            numberClosedDisputes={0}
            totalPages={totalPages}
            currentPage={pageNumber}
            setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
            {...{ casesPerPage }}
          />
        </>
      ) : (
        <ConnectWalletContainer>
          To see your dashboard, connect first
          <hr />
          <ConnectWallet />
        </ConnectWalletContainer>
      )}
    </Container>
  );
};

export default Dashboard;
