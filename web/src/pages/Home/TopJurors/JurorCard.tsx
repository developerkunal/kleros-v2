import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { IdenticonOrAvatar, AddressOrName } from "components/ConnectWallet/AccountDisplay";
import EthIcon from "assets/svgs/icons/eth.svg";
import PnkIcon from "assets/svgs/icons/kleros.svg";
import PixelArt from "pages/Dashboard/JurorInfo/PixelArt";
import { getFormattedRewards } from "utils/jurorRewardConfig";
import { getUserLevelData } from "utils/userLevelCalculation";
import { useUserQuery } from "hooks/queries/useUser";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.whiteBackground};
  padding: 24px;
  border 1px solid ${({ theme }) => theme.stroke};
  border-top: none;
  align-items: center;

  label {
    font-size: 16px;
  }

  ${landscapeStyle(
    () => css`
      gap: 0px;
      padding: 15.55px 32px;
      flex-wrap: nowrap;
    `
  )}
`;

const LogoAndAddress = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  canvas {
    width: 20px;
    height: 20px;
    border-radius: 10%;
  }
`;

const PlaceAndTitleAndRewardsAndCoherency = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${landscapeStyle(
    () =>
      css`
        flex-direction: row;
        gap: 32px;
      `
  )}
`;

const JurorPlace = styled.div`
  width: 100%;

  label::before {
    content: "#";
    display: inline;
  }

  ${landscapeStyle(
    () => css`
      width: calc(16px + (24 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
      label::before {
        display: none;
      }
    `
  )}
`;

const JurorTitle = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;

  ${landscapeStyle(
    () => css`
      width: calc(40px + (220 - 40) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
      gap: 36px;
    `
  )}
`;

const Rewards = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  label {
    font-weight: 600;
  }
  width: 164px;
  flex-wrap: wrap;

  ${landscapeStyle(
    () =>
      css`
        width: calc(60px + (240 - 60) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
      `
  )}
`;

const Coherency = styled.div`
  display: flex;
  align-items: center;
  label {
    font-weight: 600;
  }
  flex-wrap: wrap;
`;

const StyledIcon = styled.div`
  width: 16px;
  height: 16px;

  path {
    fill: ${({ theme }) => theme.secondaryPurple};
  }
`;

const HowItWorks = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledIdenticonOrAvatar = styled(IdenticonOrAvatar)``;

interface IJurorCard {
  rank: number;
  address: `0x${string}`;
  coherenceScore: number;
  totalCoherent: number;
  totalResolvedDisputes: number;
}

const JurorCard: React.FC<IJurorCard> = ({ rank, address, coherenceScore, totalCoherent, totalResolvedDisputes }) => {
  const { data } = useUserQuery(address?.toLowerCase());

  const coherenceRatio = `${totalCoherent}/${totalResolvedDisputes}`;
  const userLevelData = getUserLevelData(coherenceScore);

  const formattedRewards = getFormattedRewards(data, {});
  const ethReward = formattedRewards.find((r) => r.token === "ETH")?.amount;
  const pnkReward = formattedRewards.find((r) => r.token === "PNK")?.amount;

  return (
    <Container>
      <PlaceAndTitleAndRewardsAndCoherency>
        <JurorPlace>
          <label>{rank}</label>
        </JurorPlace>
        <JurorTitle>
          <LogoAndAddress>
            <StyledIdenticonOrAvatar address={address} />
            <AddressOrName address={address} />
          </LogoAndAddress>
        </JurorTitle>
        <Rewards>
          <label>{ethReward}</label>
          <StyledIcon as={EthIcon} />
          <label>+</label>
          <label>{pnkReward}</label>
          <StyledIcon as={PnkIcon} />
        </Rewards>
        <Coherency>
          <label>{coherenceRatio}</label>
        </Coherency>
      </PlaceAndTitleAndRewardsAndCoherency>
      <HowItWorks>
        <label> Level {userLevelData.level}</label>
        <PixelArt width="32px" height="32px" level={userLevelData.level} />
      </HowItWorks>
    </Container>
  );
};

export default JurorCard;
